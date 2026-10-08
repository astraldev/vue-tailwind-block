import { describe, expect, it } from 'vitest'
import { parseYaml, YamlParseError } from '~/core'

const yamlWithWarning = '%FOO\n---\nbar: 1'

describe('parseYaml', () => {
  it('converts yaml into a plain js value, resolving merge keys', () => {
    const source = 'base: &base { retries: 3 }\nservice:\n  <<: *base\n  tags: [a, b]'

    expect(parseYaml(source)).toEqual({
      base: { retries: 3 },
      service: { retries: 3, tags: ['a', 'b'] },
    })
  })

  it('throws YamlParseError carrying 1-based line and column of each problem', () => {
    const parseInvalidYaml = () => parseYaml('ok: 1\nok: 2')

    expect(parseInvalidYaml).toThrow(YamlParseError)

    try {
      parseInvalidYaml()
    } catch (thrownError) {
      const { errors, message } = thrownError as YamlParseError
      expect(errors[0]).toMatchObject({ line: 2, column: 1 })
      expect(message).toContain('(2:1)')
    }
  })

  it('ignores warnings by default', () => {
    expect(parseYaml(yamlWithWarning)).toEqual({ bar: 1 })
  })

  it('throws on warnings when strict is enabled', () => {
    expect(() => parseYaml(yamlWithWarning, { strict: true })).toThrow(YamlParseError)
  })
})
