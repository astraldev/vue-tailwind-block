import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from '@nuxt/kit'
import { PackageConfig } from '~/core/package-config'
import type { TailwindBlockOptions } from '~/core/options'
import { unplugin } from '~/vite/unplugin'
import { addVolarPlugin } from './volar-config'

declare module '@nuxt/schema' {
  interface NuxtConfig {
    tailwindBlock?: TailwindBlockOptions
  }
  interface NuxtOptions {
    tailwindBlock?: TailwindBlockOptions
  }
}

/**
 * Compiles `<tailwind>` blocks in Vite and webpack builds, and registers the Volar plugin in the
 * tsconfig Nuxt generates, so the editor types the variable with no other setup. Options go
 * under `tailwindBlock` in `nuxt.config.ts`.
 * @example
 * export default defineNuxtConfig({
 *   modules: ['vue-tailwind-block/nuxt'],
 *   tailwindBlock: { variableName: 'styles' },
 * })
 */
export default defineNuxtModule<TailwindBlockOptions>({
  meta: {
    name: PackageConfig.name,
    configKey: 'tailwindBlock',
    compatibility: { nuxt: '>=3.10.0' },
  },
  defaults: {},
  setup(options, nuxt) {
    // prepended so the block is compiled before the vue plugin sees the file
    addVitePlugin(() => unplugin.vite(options), { prepend: true })
    addWebpackPlugin(() => unplugin.webpack(options), { prepend: true })

    nuxt.hook('prepare:types', ({ tsConfig }) => addVolarPlugin(tsConfig, options))
  },
})

export type { TailwindBlockOptions } from '~/core/options'
