import { describe, expect, it } from 'vitest'
import { buildVirtualBlock } from '~/eslint/virtual-block'

describe('buildVirtualBlock', () => {
  it('emits one clsx call per entry on the same line, skipping keys and block scalars', () => {
    const blockContent = ['', 'base:', '  root: flex p-4', '  list:', '    - "@md:flex" # note', '  text: |', '    - not a class', ''].join('\n')

    const { text, segments } = buildVirtualBlock(blockContent, 100)

    expect(text.split('\n').slice(0, 8)).toEqual(['', '', 'clsx("flex p-4");', '', 'clsx("@md:flex");', '', '', ''])
    expect(segments.map((segment) => blockContent.slice(segment.sourceStart - 100, segment.sourceStart - 100 + 7))).toEqual(['flex p-', '@md:fle'])
  })

  it('skips entries that cannot be written unescaped in a js string', () => {
    const blockContent = ['base:', "  root: content-['\\201C']", '  other: flex'].join('\n')

    const { text } = buildVirtualBlock(blockContent, 0)

    expect(text.split('\n').slice(0, 3)).toEqual(['', '', 'clsx("flex");'])
  })
})
