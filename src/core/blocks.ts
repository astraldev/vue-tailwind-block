import { BLOCK_TYPE } from './constants'

/** Cheap text check, so files that cannot hold a block skip the SFC parser. */
export function mayContainTailwindBlock(sfcSource: string): boolean {
  return sfcSource.includes(`<${BLOCK_TYPE}`)
}

/** Works on the custom blocks of vue's SFC descriptor and of Volar's IR alike. */
export function findTailwindBlocks<Block extends { type: string }>(customBlocks: readonly Block[]): Block[] {
  return customBlocks.filter((block) => block.type === BLOCK_TYPE)
}
