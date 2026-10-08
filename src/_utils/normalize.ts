const LIST_ITEM_LINE = /^(\s*-\s+)(.*)$/
const MAPPING_VALUE_LINE = /^(\s*(?:"[^"]*"|'[^']*'|[^\s"'#:-][^:]*?):\s+)(.*)$/
const BLOCK_SCALAR_INDICATOR = /^[|>][+-]?\d*[+-]?(\s+#.*)?$/
const COMMENT_START = /(^|\s)#/

/**
 * Wraps every list entry and mapping value in double quotes before the text reaches a
 * yaml parser, so characters yaml treats as syntax (`!`, `@`, `*`, `[`, `&`, `: `) stay
 * part of the string. Only ` #` still starts a comment.
 */
export function normalizeScalarsToStrings(yamlSource: string): string {
  const normalizedLines: string[] = []
  let blockScalarParentIndent: number | null = null

  for (const line of yamlSource.split(/\r?\n/)) {
    if (blockScalarParentIndent !== null && isInsideBlockScalar(line, blockScalarParentIndent)) {
      normalizedLines.push(line)
      continue
    }

    blockScalarParentIndent = startsBlockScalar(line) ? indentationOf(line) : null
    normalizedLines.push(normalizeLine(line))
  }

  return normalizedLines.join('\n')
}

function normalizeLine(line: string): string {
  const scalarLine = splitScalarLine(line)

  if (scalarLine === null) {
    return line
  }

  return scalarLine.prefix + quoteScalar(scalarLine.rawScalar)
}

function splitScalarLine(line: string): { prefix: string; rawScalar: string } | null {
  const match = LIST_ITEM_LINE.exec(line) ?? MAPPING_VALUE_LINE.exec(line)

  if (match === null) {
    return null
  }

  const [, prefix, rawScalar] = match
  return { prefix, rawScalar }
}

function quoteScalar(rawScalar: string): string {
  if (isQuoted(rawScalar) || BLOCK_SCALAR_INDICATOR.test(rawScalar)) {
    return rawScalar
  }

  const { valueText, trailingComment } = splitTrailingComment(rawScalar)

  if (valueText === '') {
    return rawScalar
  }

  return JSON.stringify(valueText) + trailingComment
}

function splitTrailingComment(rawScalar: string): { valueText: string; trailingComment: string } {
  const commentStart = rawScalar.search(COMMENT_START)

  if (commentStart === -1) {
    return { valueText: rawScalar.trimEnd(), trailingComment: '' }
  }

  return {
    valueText: rawScalar.slice(0, commentStart).trimEnd(),
    trailingComment: ' ' + rawScalar.slice(commentStart).trimStart(),
  }
}

function startsBlockScalar(line: string): boolean {
  const scalarLine = splitScalarLine(line)
  return scalarLine !== null && BLOCK_SCALAR_INDICATOR.test(scalarLine.rawScalar)
}

function isInsideBlockScalar(line: string, parentIndent: number): boolean {
  return line.trim() === '' || indentationOf(line) > parentIndent
}

function isQuoted(rawScalar: string): boolean {
  return rawScalar.startsWith('"') || rawScalar.startsWith("'")
}

function indentationOf(line: string): number {
  return line.length - line.trimStart().length
}
