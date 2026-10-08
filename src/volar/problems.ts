import { parseYaml, YamlParseError } from '~/core'
import { buildClassTree, normalizeScalarsToStrings } from '~/_utils'

export interface BlockProblem {
  message: string
  /** Offsets into the block content the problem should be reported on. */
  start: number
  end: number
}

/** Yaml syntax errors (on their line) and invalid class values (on the whole block). */
export function findBlockProblems(blockContent: string): BlockProblem[] {
  try {
    const stringOnlyYaml = normalizeScalarsToStrings(blockContent)
    buildClassTree(parseYaml(stringOnlyYaml, { strict: true }))
    return []
  } catch (thrownError) {
    return toBlockProblems(thrownError, blockContent)
  }
}

function toBlockProblems(thrownError: unknown, blockContent: string): BlockProblem[] {
  if (thrownError instanceof YamlParseError) {
    return thrownError.errors.map((yamlError) => ({
      message: yamlError.message,
      ...findLineRange(blockContent, yamlError.line),
    }))
  }

  if (thrownError instanceof Error) {
    return [{ message: thrownError.message, start: 0, end: blockContent.length }]
  }

  throw thrownError
}

/** Line numbers are 1-based. The range excludes the line break. */
function findLineRange(blockContent: string, lineNumber: number): { start: number; end: number } {
  const linesBeforeTarget = blockContent.split('\n').slice(0, lineNumber - 1)
  const start = linesBeforeTarget.reduce((offset, line) => offset + line.length + 1, 0)
  const lineBreakIndex = blockContent.indexOf('\n', start)
  const lineEnd = lineBreakIndex === -1 ? blockContent.length : lineBreakIndex

  return { start, end: blockContent.slice(start, lineEnd).replace(/\r$/, '').length + start }
}
