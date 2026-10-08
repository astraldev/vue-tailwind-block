import { findScalarLines, locateEntryText } from '~/core/scalars'
import { findLineStarts } from '~/core/text'

/** A callee that eslint-plugin-better-tailwindcss and eslint-plugin-tailwindcss both lint by default. */
export const VIRTUAL_CALLEE = 'clsx'

const QUOTE_CHARACTERS = ['"', "'", '`']

/** Where one entry's class text sits in the virtual file and in the real .vue file. */
export interface EntrySegment {
  virtualStart: number
  virtualEnd: number
  sourceStart: number
  /** Offset in the .vue file where this entry's line starts. */
  lineStart: number
  /** Indentation and list dash or key that come before the entry, like `    - ` or `  root: `. */
  prefix: string
  /** The quote the entry is written in inside the yaml, if any. */
  quote: string | undefined
}

export interface VirtualBlock {
  /** Plain js, one `clsx("classes")` call per yaml entry and the same line numbers as the block. */
  text: string
  segments: EntrySegment[]
  virtualLineStarts: number[]
  /** Offset in the .vue file where the block content starts. */
  contentStart: number
}

/**
 * Turns the yaml of a tailwind block into js the class sorting rules already understand. Every
 * entry keeps its exact characters, so a position or fix in the js maps one to one back to the yaml.
 */
export function buildVirtualBlock(blockContent: string, contentStart: number): VirtualBlock {
  const sourceLineStarts = findLineStarts(blockContent)
  const statementsByLineIndex = new Map<number, { statement: string; segment: EntrySegment }>()

  for (const scalarLine of findScalarLines(blockContent)) {
    const entryText = locateEntryText(scalarLine.rawScalar)
    const javascriptQuote = entryText === undefined ? undefined : pickQuote(entryText.text)

    if (entryText === undefined || javascriptQuote === undefined) {
      continue
    }

    const statementPrefix = `${VIRTUAL_CALLEE}(${javascriptQuote}`
    const lineStart = contentStart + sourceLineStarts[scalarLine.lineIndex]
    const yamlQuote = entryText.offset === 1 ? scalarLine.rawScalar[0] : undefined

    statementsByLineIndex.set(scalarLine.lineIndex, {
      statement: `${statementPrefix}${entryText.text}${javascriptQuote});`,
      segment: {
        virtualStart: statementPrefix.length,
        virtualEnd: statementPrefix.length + entryText.text.length,
        sourceStart: lineStart + scalarLine.prefix.length + entryText.offset,
        lineStart,
        prefix: scalarLine.prefix,
        quote: yamlQuote,
      },
    })
  }

  return assembleVirtualBlock(sourceLineStarts.length, statementsByLineIndex, contentStart)
}

/** Lines without a class entry stay empty so line numbers keep matching the yaml. */
function assembleVirtualBlock(
  lineCount: number,
  statementsByLineIndex: Map<number, { statement: string; segment: EntrySegment }>,
  contentStart: number,
): VirtualBlock {
  const virtualLines: string[] = []
  const virtualLineStarts: number[] = []
  const segments: EntrySegment[] = []
  let virtualOffset = 0

  for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
    const lineEntry = statementsByLineIndex.get(lineIndex)

    virtualLineStarts.push(virtualOffset)
    virtualLines.push(lineEntry?.statement ?? '')

    if (lineEntry !== undefined) {
      segments.push({
        ...lineEntry.segment,
        virtualStart: virtualOffset + lineEntry.segment.virtualStart,
        virtualEnd: virtualOffset + lineEntry.segment.virtualEnd,
      })
    }

    virtualOffset += (lineEntry?.statement.length ?? 0) + 1
  }

  // declared as a global so no-undef does not flag the callee
  const text = [...virtualLines, `/* global ${VIRTUAL_CALLEE} */`].join('\n')

  return { text, segments, virtualLineStarts, contentStart }
}

/** Entries that cannot sit unescaped in a js string are skipped instead of risking a wrong fix. */
function pickQuote(entryText: string): string | undefined {
  if (entryText.includes('\\') || entryText.includes('${')) {
    return undefined
  }

  return QUOTE_CHARACTERS.find((quote) => !entryText.includes(quote))
}
