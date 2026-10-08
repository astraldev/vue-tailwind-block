export interface YamlErrorInfo {
  message: string
  line: number
  column: number
}

export class YamlParseError extends Error {
  readonly errors: YamlErrorInfo[]

  constructor(errors: YamlErrorInfo[]) {
    super(errors.map((e) => `${e.message} (${e.line}:${e.column})`).join('\n'))
    this.name = 'YamlParseError'
    this.errors = errors
  }
}
