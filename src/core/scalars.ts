const LIST_ITEM_LINE = /^(\s*-\s+)(.*)$/
const MAPPING_VALUE_LINE = /^(\s*(?:"[^"]*"|'[^']*'|[^\s"'#:-][^:]*?):\s+)(.*)$/
const BLOCK_SCALAR_INDICATOR = /^[|>][+-]?\d*[+-]?(\s+#.*)?$/
const QUOTED_SCALAR = /^(["'])(.*?)\1(?:\s+#.*)?$/
const COMMENT_START = /(^|\s)#/

export interface ScalarLine {
  /** Zero based index of the line in the yaml source. */
  lineIndex: number
  /** Everything before the scalar: indentation, list dash or key. */
  prefix: string
  rawScalar: string
}

/**
 * Wraps every list entry and mapping value in double quotes before the text reaches a
 * yaml parser, so characters yaml treats as syntax (`!`, `@`, `*`, `[`, `&`, `: `) stay
 * part of the string. Only ` #` still starts a comment.
 */
export function normalizeScalarsToStrings(yamlSource: string): string {
  const scalarLinesByIndex = new Map(findScalarLines(yamlSource).map((scalarLine) => [scalarLine.lineIndex, scalarLine]))

  return splitLines(yamlSource)
    .map((line, lineIndex) => {
      const scalarLine = scalarLinesByIndex.get(lineIndex)
      return scalarLine === undefined ? line : scalarLine.prefix + quoteScalar(scalarLine.rawScalar)
    })
    .join('\n')
}

/** List entries and mapping values, skipping the content and indicator lines of block scalars. */
export function findScalarLines(yamlSource: string): ScalarLine[] {
  const scalarLines: ScalarLine[] = []
  let blockScalarParentIndent: number | null = null

  splitLines(yamlSource).forEach((line, lineIndex) => {
    if (blockScalarParentIndent !== null && isInsideBlockScalar(line, blockScalarParentIndent)) {
      return
    }

    const scalarLine = splitScalarLine(line)
    const startsBlockScalar = scalarLine !== null && BLOCK_SCALAR_INDICATOR.test(scalarLine.rawScalar)

    blockScalarParentIndent = startsBlockScalar ? indentationOf(line) : null

    if (scalarLine !== null && !startsBlockScalar) {
      scalarLines.push({ lineIndex, ...scalarLine })
    }
  })

  return scalarLines
}

/** The class text of a scalar without its quotes and trailing comment, and where it starts inside the scalar. */
export function locateEntryText(rawScalar: string): { text: string; offset: number } | undefined {
  const quotedScalar = QUOTED_SCALAR.exec(rawScalar)

  if (quotedScalar !== null) {
    return { text: quotedScalar[2], offset: 1 }
  }

  const { valueText } = splitTrailingComment(rawScalar)

  if (isQuoted(rawScalar) || valueText === '') {
    return undefined
  }

  return { text: valueText, offset: 0 }
}

function splitLines(yamlSource: string): string[] {
  return yamlSource.split(/\r?\n/)
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

function isInsideBlockScalar(line: string, parentIndent: number): boolean {
  return line.trim() === '' || indentationOf(line) > parentIndent
}

function isQuoted(rawScalar: string): boolean {
  return rawScalar.startsWith('"') || rawScalar.startsWith("'")
}

function indentationOf(line: string): number {
  return line.length - line.trimStart().length
}
