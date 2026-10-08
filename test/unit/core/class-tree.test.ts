import { describe, expect, it } from 'vitest'
import { buildClassTree } from '~/core/class-tree'

describe('buildClassTree', () => {
  it('merges each class list into a single space separated string', () => {
    const parsedYaml = { base: { root: ['h-5 w-5', '  rounded ', 'flex'] } }

    expect(buildClassTree(parsedYaml)).toEqual({
      base: { root: 'h-5 w-5 rounded flex' },
    })
  })

  it('keeps plain string values as they are', () => {
    const parsedYaml = { base: { root: 'h-5 w-5' } }

    expect(buildClassTree(parsedYaml)).toEqual({ base: { root: 'h-5 w-5' } })
  })

  it('throws naming the path of a value that is not a class string, list or group', () => {
    const parsedYaml = { base: { root: 5 } }

    expect(() => buildClassTree(parsedYaml)).toThrow('base.root')
  })
})
