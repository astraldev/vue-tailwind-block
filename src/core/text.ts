/** Offset where each line of the text starts. */
export function findLineStarts(text: string): number[] {
  const lineStarts = [0]

  for (let index = 0; index < text.length; index++) {
    if (text[index] === '\n') {
      lineStarts.push(index + 1)
    }
  }

  return lineStarts
}

/** Zero based index of the line an offset falls on. */
export function lineIndexAt(lineStarts: number[], offset: number): number {
  for (let lineIndex = lineStarts.length - 1; lineIndex > 0; lineIndex--) {
    if (lineStarts[lineIndex] <= offset) {
      return lineIndex
    }
  }

  return 0
}

/** Offsets of a zero based line, without its line break. */
export function lineRange(text: string, lineIndex: number): { start: number; end: number } {
  const lineStarts = findLineStarts(text)
  const start = lineStarts[lineIndex] ?? text.length
  const nextLineStart = lineStarts[lineIndex + 1]
  const end = nextLineStart === undefined ? text.length : nextLineStart - 1

  return { start, end: text[end - 1] === '\r' && end > start ? end - 1 : end }
}
