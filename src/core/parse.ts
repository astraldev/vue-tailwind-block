import { parseDocument } from 'yaml'
import type { YAMLError } from 'yaml'
import { YamlParseError } from '~/_utils/errors'
import type { ParseOptions, YamlErrorInfo, YamlValue } from './types'

export function parseYaml(source: string, options: ParseOptions = {}): YamlValue {
  const parsedDocument = parseDocument(source, { merge: true })

  const problemsToReport = options.strict
    ? [...parsedDocument.errors, ...parsedDocument.warnings]
    : parsedDocument.errors

  if (problemsToReport.length > 0) {
    throw new YamlParseError(problemsToReport.map(toErrorInfo))
  }

  return parsedDocument.toJS()
}

function toErrorInfo(yamlProblem: YAMLError): YamlErrorInfo {
  const [startPosition] = yamlProblem.linePos ?? []

  return {
    message: yamlProblem.message,
    line: startPosition?.line ?? 1,
    column: startPosition?.col ?? 1,
  }
}
