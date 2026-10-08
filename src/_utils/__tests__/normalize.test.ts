import { describe, expect, it } from 'vitest'
import { normalizeScalarsToStrings } from '~/_utils/normalize'

describe('normalizeScalarsToStrings', () => {
  it('quotes list entries and mapping values, including ones yaml would reject', () => {
    const source = ['base:', '  root: h-5 w-5', '  title:', '    - !flex', '    - @md:flex', '    - [&>*]:p-4'].join('\n')

    expect(normalizeScalarsToStrings(source)).toBe(
      ['base:', '  root: "h-5 w-5"', '  title:', '    - "!flex"', '    - "@md:flex"', '    - "[&>*]:p-4"'].join('\n'),
    )
  })

  it('escapes quotes and keeps trailing comments outside the string', () => {
    const source = `- content-["a"] p-2 # spacing`

    expect(normalizeScalarsToStrings(source)).toBe(`- "content-[\\"a\\"] p-2" # spacing`)
  })

  it('leaves keys, comments, quoted values and block scalars untouched', () => {
    const source = ['# note', 'base:', '  root: "already quoted"', "  text: 'single'", '  folded: |', '    - not a list', '    keep: me'].join('\n')

    expect(normalizeScalarsToStrings(source)).toBe(source)
  })
})
