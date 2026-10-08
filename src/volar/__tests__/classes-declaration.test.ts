import { describe, expect, it } from 'vitest'
import { buildClassesDeclaration } from '~/volar/classes-declaration'

describe('buildClassesDeclaration', () => {
  it('declares classes as a const with the exact shape and values of the block', () => {
    const classTree = { base: { root: 'h-5 w-5' } }

    expect(buildClassesDeclaration(classTree)).toBe(
      'const classes = {"base":{"root":"h-5 w-5"}} as const;',
    )
  })

  it('uses the configured variable name instead of classes', () => {
    const classTree = { base: { root: 'h-5 w-5' } }

    expect(buildClassesDeclaration(classTree, { variableName: 'styles' })).toBe(
      'const styles = {"base":{"root":"h-5 w-5"}} as const;',
    )
  })
})
