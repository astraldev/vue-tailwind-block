import MagicString from 'magic-string'
import type { SourceMap } from 'magic-string'
import { parse } from 'vue/compiler-sfc'
import type { SFCBlock, SFCScriptBlock } from 'vue/compiler-sfc'
import { findTailwindBlocks, mayContainTailwindBlock, readBlockLang } from '~/core/blocks'
import { compileBlockOrThrow } from '~/core/compile'
import { PackageConfig } from '~/core/package-config'
import { declareClasses } from '~/core/declaration'
import { resolveOptions } from '~/core/options'
import type { TailwindBlockOptions } from '~/core/options'

interface BlockRange {
  start: number
  end: number
}

export interface TransformedSfc {
  /** The `.vue` source without its block, with the variable declared in `<script setup>`. */
  code: string
  /** Maps the transformed code back to the original source. */
  map: SourceMap
}

/**
 * The transform the Vite plugin runs on each `.vue` file, for other build tools. Replaces the
 * `<tailwind>` block with a variable declared at the top of `<script setup>`, and adds a
 * `<script setup>` when the file has none.
 * @returns `undefined` when the file has no block.
 * @throws {TailwindBlockError} when the block does not compile.
 * @throws {Error} when the file has more than one block, because both would declare the same
 * variable.
 */
export function transformSfc(
  sfcSource: string,
  options: TailwindBlockOptions = {},
): TransformedSfc | undefined {
  if (!mayContainTailwindBlock(sfcSource)) {
    return undefined
  }

  const { descriptor } = parse(sfcSource)
  const tailwindBlocks = findTailwindBlocks(descriptor.customBlocks)

  if (tailwindBlocks.length === 0) {
    return undefined
  }

  if (tailwindBlocks.length > 1) {
    throw new Error(`Expected one <${PackageConfig.blockType}> block per file, found ${tailwindBlocks.length}`)
  }

  const [tailwindBlock] = tailwindBlocks
  const { binding } = resolveOptions(options)
  const declaration = declareClasses(binding, compileBlockOrThrow(tailwindBlock.content, { lang: readBlockLang(tailwindBlock) }))
  const blockRange = findBlockRange(sfcSource, tailwindBlock)
  const editableSource = new MagicString(sfcSource)

  if (descriptor.scriptSetup !== null) {
    injectIntoScriptSetup(editableSource, blockRange, descriptor.scriptSetup, declaration)
  } else {
    replaceBlockWithScriptSetup(editableSource, blockRange, descriptor.script, declaration)
  }

  return { code: editableSource.toString(), map: editableSource.generateMap({ hires: true }) }
}

/** The block's content range is known, so walk outwards to the surrounding tags. */
function findBlockRange(sfcSource: string, tailwindBlock: SFCBlock): BlockRange {
  const openingTagStart = sfcSource.lastIndexOf(`<${PackageConfig.blockType}`, tailwindBlock.loc.start.offset)
  const closingTagStart = sfcSource.indexOf(`</${PackageConfig.blockType}`, tailwindBlock.loc.end.offset)
  const closingTagEnd = sfcSource.indexOf('>', closingTagStart) + 1

  return { start: openingTagStart, end: closingTagEnd }
}

function injectIntoScriptSetup(
  editableSource: MagicString,
  blockRange: BlockRange,
  scriptSetup: SFCScriptBlock,
  declaration: string,
): void {
  editableSource.remove(blockRange.start, blockRange.end)
  editableSource.appendLeft(scriptSetup.loc.start.offset, `\n${declaration}`)
}

/** Vue requires `<script>` and `<script setup>` to share a lang, so copy the existing one. */
function replaceBlockWithScriptSetup(
  editableSource: MagicString,
  blockRange: BlockRange,
  existingScript: SFCScriptBlock | null,
  declaration: string,
): void {
  const langAttribute = existingScript?.lang ? ` lang="${existingScript.lang}"` : ''
  const scriptSetupBlock = `<script setup${langAttribute}>\n${declaration}\n</script>`

  editableSource.overwrite(blockRange.start, blockRange.end, scriptSetupBlock)
}
