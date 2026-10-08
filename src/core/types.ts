export type YamlValue =
  | string
  | number
  | boolean
  | null
  | YamlValue[]
  | { [key: string]: YamlValue }

export interface ParseOptions {
  /** Throw on warnings as well as errors. Default: false */
  strict?: boolean
}

export type { YamlErrorInfo } from '~/_utils/errors'
