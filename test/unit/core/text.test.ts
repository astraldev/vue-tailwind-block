import { describe, expect, it } from 'vitest'
import { findLineStarts, lineIndexAt, lineRange } from '~/core/text'

describe('text helpers', () => {
  it('finds the line an offset falls on', () => {
    const lineStarts = findLineStarts('ab\ncd\n')

    expect(lineStarts).toEqual([0, 3, 6])
    expect([0, 2, 3, 6].map((offset) => lineIndexAt(lineStarts, offset))).toEqual([0, 0, 1, 2])
  })

  it('gives the range of a line without its line break, for \\n and \\r\\n', () => {
    expect(lineRange('ab\ncd', 1)).toEqual({ start: 3, end: 5 })
    expect(lineRange('ab\r\ncd\r\nef', 1)).toEqual({ start: 4, end: 6 })
  })
})
