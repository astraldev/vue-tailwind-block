import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from '@nuxt/kit'
import { PACKAGE_NAME } from '~/core/constants'
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

export default defineNuxtModule<TailwindBlockOptions>({
  meta: {
    name: PACKAGE_NAME,
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
