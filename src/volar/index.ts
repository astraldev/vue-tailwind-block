import type { VueLanguagePlugin } from '@vue/language-core'
import type { TailwindBlockOptions } from '~/_utils'
import { injectTailwindBlock } from './inject'

const TAILWIND_BLOCK_TYPE = 'tailwind'
const TYPESCRIPT_SERVICE_SCRIPT = /^script_(?:ts|tsx)$/
const SERVICE_SCRIPT = /^script_(?:js|jsx|ts|tsx)$/

/**
 * Volar `require`s this entry and expects `module.exports` to be the plugin itself, so the
 * default export must stay the only runtime export.
 * Needs Vue language tools (vue-tsc or the Vue extension) 3.2 or newer: older ones reject plugin
 * objects with options or use another plugin API. Works with vue 3.3 to 3.6.
 * Configured in tsconfig: `"vueCompilerOptions": { "plugins": [{ "name": "<pkg>/volar", "variableName": "styles" }] }`
 */
const tailwindBlockPlugin: VueLanguagePlugin<TailwindBlockOptions> = ({ config }) => ({
  version: 2.2,
  name: 'vue-tailwind-block',
  resolveEmbeddedCode(_fileName, ir, embeddedFile) {
    const tailwindBlock = ir.customBlocks.find((block) => block.type === TAILWIND_BLOCK_TYPE)

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
export type { TailwindBlockOptions } from '~/_utils'
