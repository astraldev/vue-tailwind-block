import { describe, expect, it } from 'vitest'
import { declareClasses } from '~/core/declaration'

const classTree = { base: { root: 'h-5 w-5' } }

describe('declareClasses', () => {
  it('declares the variable with the compiled block', () => {
    expect(declareClasses('styles', classTree)).toBe('const styles = {"base":{"root":"h-5 w-5"}};')
  })

  it('keeps the exact shape and values in the type with asConst', () => {
    expect(declareClasses('classes', classTree, { asConst: true })).toBe(
      'const classes = {"base":{"root":"h-5 w-5"}} as const;',
    )
  })
})
