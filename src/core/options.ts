import { PackageConfig } from './package-config'

/** Options shared by the Vite plugin, the Nuxt module and the Volar plugin. */
export interface TailwindBlockOptions {
  /**
   * Name of the variable the template and `<script setup>` read the compiled block from. Set the
   * same name in the Vite plugin and the Volar plugin, or the editor types a variable the build
   * never declares. The Nuxt module passes it to both.
   * @default 'classes'
   */
  variableName?: string
}

export function resolveOptions(options: TailwindBlockOptions = {}): Required<TailwindBlockOptions> {
  return { variableName: options.variableName ?? PackageConfig.defaultVariableName }
}
