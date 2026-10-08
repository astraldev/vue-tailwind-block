import { PackageConfig } from './package-config'

export interface TailwindBlockOptions {
  /** Name of the variable the compiled block is exposed as. Default: `classes` */
  variableName?: string
}

export function resolveOptions(options: TailwindBlockOptions = {}): Required<TailwindBlockOptions> {
  return { variableName: options.variableName ?? PackageConfig.defaultVariableName }
}
