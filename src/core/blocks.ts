import { PackageConfig } from './package-config'

/** Cheap text check, so files that cannot hold a block skip the SFC parser. */
export function mayContainTailwindBlock(sfcSource: string): boolean {
  return sfcSource.includes(`<${PackageConfig.blockType}`)
}

/**
 * Read from the attributes rather than a `lang` property, because Volar fills a missing lang
 * with `txt`, which would then be rejected. A bare `lang` attribute counts as an empty string.
 */
export function readBlockLang(block: { attrs: Record<string, string | true> }): string | undefined {
  const lang = block.attrs.lang
  return lang === true ? '' : lang
}

export function isSupportedBlockLang(lang: string | undefined): boolean {
  return lang === undefined || PackageConfig.blockLangs.includes(lang)
}

/** Works on the custom blocks of vue's SFC descriptor and of Volar's IR alike. */
export function findTailwindBlocks<Block extends { type: string }>(customBlocks: readonly Block[]): Block[] {
  return customBlocks.filter((block) => block.type === PackageConfig.blockType)
}
