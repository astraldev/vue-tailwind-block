import { PACKAGE_NAME } from '~/core/constants'
import type { TailwindBlockOptions } from '~/core/options'

/** The slice of the generated tsconfig that holds Vue language tools options. */
interface TsConfigWithVueOptions {
  vueCompilerOptions?: { plugins?: unknown[] }
}

const VOLAR_PLUGIN_NAME = `${PACKAGE_NAME}/volar`

/** Registers the Volar plugin in the tsconfig Nuxt generates, so templates get a typed variable. */
export function addVolarPlugin(tsConfig: TsConfigWithVueOptions, options: TailwindBlockOptions): void {
  const vueCompilerOptions = (tsConfig.vueCompilerOptions ??= {})
  const plugins = (vueCompilerOptions.plugins ??= [])

  plugins.push({ name: VOLAR_PLUGIN_NAME, ...options })
}
