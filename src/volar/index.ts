import type { VueLanguagePlugin } from '@vue/language-core'
import { findTailwindBlocks } from '~/core/blocks'
import { PackageConfig } from '~/core/package-config'
import type { TailwindBlockOptions } from '~/core/options'
import { injectTailwindBlock } from './inject'

const TYPESCRIPT_SERVICE_SCRIPT = /^script_(?:ts|tsx)$/
const SERVICE_SCRIPT = /^script_(?:js|jsx|ts|tsx)$/

// Volar `require`s this entry and expects `module.exports` to be the plugin itself, so the
// default export must stay the only runtime export. Language tools older than 3.2 reject plugin
// objects with options or use another plugin API.
/**
 * Types the variable a `<tailwind>` block compiles to, in the editor and in `vue-tsc`, with the
 * exact keys and class strings of the block. Problems in the block are reported on it.
 * Needs Vue language tools (`vue-tsc` or the Vue extension) 3.2 or newer.
 * @example
 * // tsconfig.json
 * { "vueCompilerOptions": { "plugins": [{ "name": "vue-tailwind-block/volar" }] } }
 */
const tailwindBlockPlugin: VueLanguagePlugin<TailwindBlockOptions> = ({ config }) => ({
  version: 2.2,
  name: PackageConfig.name,
  resolveEmbeddedCode(_fileName, ir, embeddedFile) {
    const [tailwindBlock] = findTailwindBlocks(ir.customBlocks)

    if (tailwindBlock === undefined || !SERVICE_SCRIPT.test(embeddedFile.id)) {
      return
    }

    injectTailwindBlock({
      generatedCode: embeddedFile.content,
      tailwindBlock,
      isTypeScript: TYPESCRIPT_SERVICE_SCRIPT.test(embeddedFile.id),
      options: config,
    })
  },
})

export default tailwindBlockPlugin
export type { TailwindBlockOptions } from '~/core/options'
