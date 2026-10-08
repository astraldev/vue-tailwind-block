import type { Linter } from 'eslint'
import { findLineStarts } from './virtual-block'
import type { EntrySegment, VirtualBlock } from './virtual-block'

type LintFix = NonNullable<Linter.LintMessage['fix']>

/** Moves messages reported on the virtual js back onto the yaml in the .vue file. */
export function mapBlockMessages(
  messages: Linter.LintMessage[],
  virtualBlock: VirtualBlock,
  sourceText: string,
): Linter.LintMessage[] {
  const sourceLineStarts = findLineStarts(sourceText)

  return messages.map((message) => ({
    ...message,
    ...mapPosition(message, virtualBlock, sourceLineStarts),
    fix: mapFix(message.fix, virtualBlock),
    suggestions: message.suggestions?.flatMap((suggestion) => {
      const fix = mapFix(suggestion.fix, virtualBlock)
      return fix === undefined ? [] : [{ ...suggestion, fix }]
    }),
  }))
}

function mapPosition(message: Linter.LintMessage, virtualBlock: VirtualBlock, sourceLineStarts: number[]) {
  const start = toSourcePosition(virtualOffsetOf(message.line, message.column, virtualBlock), virtualBlock, sourceLineStarts)
  const hasEnd = message.endLine !== undefined && message.endColumn !== undefined

  if (!hasEnd) {
    return start
  }

  const end = toSourcePosition(virtualOffsetOf(message.endLine!, message.endColumn!, virtualBlock), virtualBlock, sourceLineStarts)

  return { ...start, endLine: end.line, endColumn: end.column }
}

function toSourcePosition(virtualOffset: number, virtualBlock: VirtualBlock, sourceLineStarts: number[]) {
  const sourceOffset = toSourceOffset(virtualOffset, virtualBlock)
  const lineIndex = findLastIndex(sourceLineStarts, (lineStart) => lineStart <= sourceOffset)

  return { line: lineIndex + 1, column: sourceOffset - sourceLineStarts[lineIndex] + 1 }
}

function virtualOffsetOf(line: number, column: number, virtualBlock: VirtualBlock): number {
  const lineStart = virtualBlock.virtualLineStarts[line - 1] ?? virtualBlock.text.length

  return lineStart + column - 1
}

/** Offsets outside an entry, like the call and quotes around it, snap to the nearest edge of it. */
function toSourceOffset(virtualOffset: number, virtualBlock: VirtualBlock): number {
  const segment = findSegmentOnSameLine(virtualOffset, virtualBlock)

  if (segment === undefined) {
    return virtualBlock.contentStart
  }

  const clampedOffset = Math.min(Math.max(virtualOffset, segment.virtualStart), segment.virtualEnd)

  return segment.sourceStart + (clampedOffset - segment.virtualStart)
}

function findSegmentOnSameLine(virtualOffset: number, virtualBlock: VirtualBlock): EntrySegment | undefined {
  const lineIndex = findLastIndex(virtualBlock.virtualLineStarts, (lineStart) => lineStart <= virtualOffset)
  const lineStart = virtualBlock.virtualLineStarts[lineIndex]
  const nextLineStart = virtualBlock.virtualLineStarts[lineIndex + 1] ?? Number.POSITIVE_INFINITY

  return virtualBlock.segments.find((segment) => segment.virtualStart >= lineStart && segment.virtualStart < nextLineStart)
}

const LIST_ENTRY_PREFIX = /^\s*-\s+$/

/**
 * A rule may replace just the classes or the whole string including its quotes. Either way only
 * the classes may change in the yaml, so quotes are trimmed off the range and the new text.
 * When the new text spans lines (line wrapping), the yaml gets one list entry per line instead.
 */
function mapFix(fix: LintFix | undefined, virtualBlock: VirtualBlock): LintFix | undefined {
  if (fix === undefined) {
    return undefined
  }

  const [fixStart, fixEnd] = fix.range
  const segment = virtualBlock.segments.find(
    (candidate) => fixStart >= candidate.virtualStart - 1 && fixEnd <= candidate.virtualEnd + 1,
  )

  if (segment === undefined) {
    return undefined
  }

  const coversOpeningQuote = fixStart === segment.virtualStart - 1
  const coversClosingQuote = fixEnd === segment.virtualEnd + 1
  const text = fix.text.slice(coversOpeningQuote ? 1 : 0, coversClosingQuote ? -1 : undefined)
  const coversWholeEntry = fixStart <= segment.virtualStart && fixEnd >= segment.virtualEnd

  if (text.includes('\n')) {
    return coversWholeEntry ? buildLineBreakFix(text, segment) : undefined
  }

  const start = Math.max(fixStart, segment.virtualStart)
  const end = Math.min(fixEnd, segment.virtualEnd)

  return {
    range: [segment.sourceStart + (start - segment.virtualStart), segment.sourceStart + (end - segment.virtualStart)],
    text,
  }
}

/**
 * List entries are merged into one string, so splitting one entry into several keeps the meaning.
 * A `key: classes` line becomes `key:` over a list, because a plain value cannot span entries.
 */
function buildLineBreakFix(wrappedText: string, segment: EntrySegment): LintFix {
  const lines = wrappedText.split('\n').map((line) => line.trim()).filter((line) => line !== '')
  const entryEnd = segment.sourceStart + (segment.virtualEnd - segment.virtualStart)
  const yamlQuote = segment.quote ?? ''
  const indentation = segment.prefix.slice(0, segment.prefix.length - segment.prefix.trimStart().length)

  if (LIST_ENTRY_PREFIX.test(segment.prefix)) {
    const nextEntrySeparator = `${yamlQuote}\n${indentation}- ${yamlQuote}`
    return { range: [segment.sourceStart, entryEnd], text: lines.join(nextEntrySeparator) }
  }

  const entryIndentation = `${indentation}  `
  const nextEntrySeparator = `${yamlQuote}\n${entryIndentation}- ${yamlQuote}`
  const listText = `${segment.prefix.trimEnd()}\n${entryIndentation}- ${yamlQuote}${lines.join(nextEntrySeparator)}`

  return { range: [segment.lineStart, entryEnd], text: listText }
}

function findLastIndex<Item>(items: Item[], matches: (item: Item) => boolean): number {
  for (let index = items.length - 1; index >= 0; index--) {
    if (matches(items[index])) {
      return index
    }
  }

  return 0
}
