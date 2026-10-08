import { parseDocument } from 'yaml'
import type { YAMLError } from 'yaml'

export interface YamlProblem {
  message: string
  /** 1-based line of the problem. */
  line: number
}

/** Warnings count as problems too, so an ambiguous block never compiles silently. */
export function parseYaml(source: string): { value: unknown; problems: YamlProblem[] } {
  const parsedDocument = parseDocument(source)
  const problems = [...parsedDocument.errors, ...parsedDocument.warnings].map(toYamlProblem)

  return { value: problems.length > 0 ? undefined : parsedDocument.toJS(), problems }
}

function toYamlProblem(yamlError: YAMLError): YamlProblem {
  return { message: yamlError.message, line: yamlError.linePos?.[0].line ?? 1 }
}
