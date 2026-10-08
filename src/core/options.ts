import { DEFAULT_VARIABLE_NAME } from './constants'

export interface TailwindBlockOptions {
  /** Name of the variable the compiled block is exposed as. Default: `classes` */
  variableName?: string
}

export function resolveOptions(options: TailwindBlockOptions = {}): Required<TailwindBlockOptions> {
  return { variableName: options.variableName ?? DEFAULT_VARIABLE_NAME }
}
