import { describe, expect, it } from 'vitest'
import { declareClasses, declareClassesType } from '~/core/declaration'

const classTree = { base: { root: 'h-5 w-5' } }

describe('declareClasses', () => {
  it('declares the variable with the compiled block', () => {
    expect(declareClasses('styles', classTree)).toBe('const styles = {"base":{"root":"h-5 w-5"}};')
  })
})

describe('declareClassesType', () => {
  it('types each key as a string documented with its classes', () => {
    expect(declareClassesType('classes', classTree)).toBe(
      ['const classes = {} as {', '  base: {', '    /** h-5 w-5 */', '    root: string', '  }', '};'].join('\n'),
    )
  })

  it('quotes keys that are not identifiers and keeps a comment end out of the doc', () => {
    expect(declareClassesType('classes', { 'is-active': 'content-["*/"]' })).toContain(
      '/** content-["*\\/"] */\n  "is-active": string',
    )
  })
})
