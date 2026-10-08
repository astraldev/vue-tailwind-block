import MagicString from 'magic-string'
import type { SourceMap } from 'magic-string'
import { parse } from 'vue/compiler-sfc'
import type { SFCBlock, SFCScriptBlock } from 'vue/compiler-sfc'
import { parseYaml } from '~/core'
import { buildClassTree, DEFAULT_VARIABLE_NAME, normalizeScalarsToStrings } from '~/_utils'
import type { TailwindBlockOptions } from '~/_utils'

const TAILWIND_BLOCK_TYPE = 'tailwind'

interface BlockRange {
  start: number
  end: number
}

export interface TransformedSfc {
  code: string
  map: SourceMap
}

/**
 * Replaces the `<tailwind lang="yaml">` block of a .vue file with a variable declared at the
 * top of `<script setup>` (created when missing). Returns undefined when there is no block.
 * Throws when the file has more than one block, since they would compete for the same variable.
 */
export function transformSfc(
  sfcSource: string,
  options: TailwindBlockOptions = {},
): TransformedSfc | undefined {
  const { descriptor } = parse(sfcSource)
  const tailwindBlocks = descriptor.customBlocks.filter((block) => block.type === TAILWIND_BLOCK_TYPE)

  if (tailwindBlocks.length === 0) {
    return undefined
  }

  if (tailwindBlocks.length > 1) {
    throw new Error(`Expected one <${TAILWIND_BLOCK_TYPE}> block per file, found ${tailwindBlocks.length}`)
  }

  const [tailwindBlock] = tailwindBlocks
  const declaration = buildDeclaration(tailwindBlock.content, options)
  const blockRange = findBlockRange(sfcSource, tailwindBlock)
  const editableSource = new MagicString(sfcSource)

  if (descriptor.scriptSetup !== null) {
    injectIntoScriptSetup(editableSource, blockRange, descriptor.scriptSetup, declaration)
  } else {
    replaceBlockWithScriptSetup(editableSource, blockRange, descriptor.script, declaration)
  }

  return { code: editableSource.toString(), map: editableSource.generateMap({ hires: true }) }
}

function buildDeclaration(blockContent: string, options: TailwindBlockOptions): string {
  const variableName = options.variableName ?? DEFAULT_VARIABLE_NAME
  const stringOnlyYaml = normalizeScalarsToStrings(blockContent)
  const classTree = buildClassTree(parseYaml(stringOnlyYaml, { strict: true }))

  return `const ${variableName} = ${JSON.stringify(classTree)};`
}

/** The block's content range is known, so walk outwards to the surrounding tags. */
function findBlockRange(sfcSource: string, tailwindBlock: SFCBlock): BlockRange {
  const openingTagStart = sfcSource.lastIndexOf(`<${TAILWIND_BLOCK_TYPE}`, tailwindBlock.loc.start.offset)
  const closingTagStart = sfcSource.indexOf(`</${TAILWIND_BLOCK_TYPE}`, tailwindBlock.loc.end.offset)
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
