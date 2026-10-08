import { describe, expect, it } from 'vitest'
import { findBlockProblems } from '~/volar/problems'

describe('findBlockProblems', () => {
  it('reports nothing for a valid block', () => {
    expect(findBlockProblems('base:\n  root: h-5 w-5\n')).toEqual([])
  })

  it('reports a yaml syntax error on the line it happens', () => {
    const duplicateKeyBlock = 'a: 1\na: 2'

    const [problem] = findBlockProblems(duplicateKeyBlock)

    expect(problem).toMatchObject({ start: 5, end: 9 })
  })

  it('reports an empty slot on the whole block, naming its path', () => {
    const emptySlotBlock = 'base:\n  root:'

    const [problem] = findBlockProblems(emptySlotBlock)

    expect(problem.message).toContain('base.root')
    expect(problem).toMatchObject({ start: 0, end: emptySlotBlock.length })
  })
})
