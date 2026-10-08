import { describe, expect, it } from 'vitest'
import { compileBlock, compileBlockOrThrow, TailwindBlockError } from '~/core'

describe('compileBlock', () => {
  it('compiles a valid block into its class tree', () => {
    expect(compileBlock('base:\n  root:\n    - h-5 w-5\n    - "@md:flex"\n')).toEqual({
      ok: true,
      classTree: { base: { root: 'h-5 w-5 @md:flex' } },
    })
  })

  it('reports a yaml syntax error on the line it happens', () => {
    const result = compileBlock('a: 1\na: 2')

    expect(result).toMatchObject({ ok: false, problems: [{ start: 5, end: 9 }] })
  })

  it('reports yaml warnings too', () => {
    expect(compileBlock('%FOO\n---\nbar: 1')).toMatchObject({ ok: false })
  })

  it('reports an empty slot on the whole block, naming its path', () => {
    const emptySlotBlock = 'base:\n  root:'

    const result = compileBlock(emptySlotBlock)

    expect(result).toMatchObject({ ok: false, problems: [{ start: 0, end: emptySlotBlock.length }] })
    expect(!result.ok && result.problems[0].message).toContain('base.root')
  })
})

describe('block lang', () => {
  it.each([undefined, 'yaml', 'yml'])('compiles a block with lang %s', (lang) => {
    expect(compileBlock('root: flex', { lang })).toMatchObject({ ok: true })
  })

  it('reports any other lang on the whole block', () => {
    const result = compileBlock('root: flex', { lang: 'json' })

    expect(result).toMatchObject({ ok: false, problems: [{ start: 0, end: 10 }] })
    expect(!result.ok && result.problems[0].message).toContain('got "json"')
  })
})

describe('compileBlockOrThrow', () => {
  it('throws a TailwindBlockError carrying the problems', () => {
    expect(() => compileBlockOrThrow('a: 1\na: 2')).toThrow(TailwindBlockError)
  })
})
