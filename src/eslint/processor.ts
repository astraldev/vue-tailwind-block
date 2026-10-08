import type { Linter } from 'eslint'
import { parse } from 'vue/compiler-sfc'
import { findTailwindBlocks, isSupportedBlockLang, mayContainTailwindBlock, readBlockLang } from '~/core/blocks'
import { PackageConfig } from '~/core/package-config'
import { mapBlockMessages } from './map-messages'
import { buildVirtualBlock } from './virtual-block'
import type { VirtualBlock } from './virtual-block'

/** Virtual files end up as `<file>.vue/<index>_tailwind-block.js`. */
export const VIRTUAL_FILE_NAME = 'tailwind-block.js'

export interface TailwindBlockEslintOptions {
  /**
   * Rules whose messages are reported on tailwind blocks: rule ids, or patterns tested against
   * them. The block is turned into plain js, so other rules (quotes, semi, ...) would only add
   * noise. Default: every rule with "tailwind" in its name.
   */
  rules?: (string | RegExp)[]
}

const DEFAULT_REPORTED_RULES = [/tailwind/i]

/** What preprocess knew about a file, kept until postprocess maps its messages back. */
interface ProcessedFile {
  sourceText: string
  innerBlockCount: number
  virtualBlocks: VirtualBlock[]
}

/**
 * Flat config allows one processor per file, so this one wraps another (eslint-plugin-vue's) and
 * hands it the blocks it expects. Without that, vue rules that rely on their processor, like
 * comment directives, report stray errors.
 */
export function createProcessor(innerProcessor?: Linter.Processor, options: TailwindBlockEslintOptions = {}): Linter.Processor {
  const processedFiles = new Map<string, ProcessedFile>()
  const reportedRules = options.rules ?? DEFAULT_REPORTED_RULES

  return {
    meta: { name: `${PackageConfig.name}/tailwind-block` },
    supportsAutofix: innerProcessor?.supportsAutofix ?? true,

    preprocess(sourceText, filename) {
      const innerBlocks = innerProcessor?.preprocess?.(sourceText, filename) ?? [sourceText]
      const virtualBlocks = findBlockContents(sourceText).map((block) => buildVirtualBlock(block.content, block.contentStart))

      processedFiles.set(filename, { sourceText, innerBlockCount: innerBlocks.length, virtualBlocks })

      // the .vue text stays a plain string so it is linted as the real file, with its own parser and rules
      return [...innerBlocks, ...virtualBlocks.map((virtualBlock) => ({ text: virtualBlock.text, filename: VIRTUAL_FILE_NAME }))]
    },

    postprocess(messageLists, filename) {
      const processedFile = processedFiles.get(filename)
      processedFiles.delete(filename)

      if (processedFile === undefined) {
        return messageLists.flat()
      }

      const innerMessageLists = messageLists.slice(0, processedFile.innerBlockCount)
      const virtualBlockMessageLists = messageLists.slice(processedFile.innerBlockCount)
      const innerMessages = innerProcessor?.postprocess?.(innerMessageLists, filename) ?? innerMessageLists.flat()
      const mappedBlockMessages = virtualBlockMessageLists.flatMap((messages, blockIndex) =>
        mapBlockMessages(messages.filter((message) => isReported(message, reportedRules)), processedFile.virtualBlocks[blockIndex], processedFile.sourceText),
      )

      return [...innerMessages, ...mappedBlockMessages]
    },
  }
}

/** Messages without a rule are parse errors, and those are always worth showing. */
function isReported(message: Linter.LintMessage, reportedRules: (string | RegExp)[]): boolean {
  const ruleId = message.ruleId

  if (ruleId === null) {
    return true
  }

  return reportedRules.some((reportedRule) => (typeof reportedRule === 'string' ? reportedRule === ruleId : reportedRule.test(ruleId)))
}

function findBlockContents(sourceText: string): { content: string; contentStart: number }[] {
  if (!mayContainTailwindBlock(sourceText)) {
    return []
  }

  // a block in another lang is not yaml, so its entries cannot be mapped back reliably
  return findTailwindBlocks(parse(sourceText).descriptor.customBlocks)
    .filter((block) => isSupportedBlockLang(readBlockLang(block)))
    .map((block) => ({ content: block.content, contentStart: block.loc.start.offset }))
}
