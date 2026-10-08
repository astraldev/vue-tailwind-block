import type { ESLint, Linter } from 'eslint'
import { PACKAGE_NAME } from '~/core/constants'
import { createProcessor, VIRTUAL_FILE_NAME } from './processor'
import type { TailwindBlockEslintOptions } from './processor'

const PLUGIN_NAME = 'tailwind-block'

/** eslint-plugin-vue is optional, but when it is installed its processor must keep running. */
async function loadVueProcessor(): Promise<Linter.Processor | undefined> {
  try {
    const vuePlugin = await import('eslint-plugin-vue')
    return (vuePlugin.default ?? vuePlugin).processors?.['.vue']
  } catch {
    return undefined
  }
}

const vueProcessor = await loadVueProcessor()

function createPlugin(options?: TailwindBlockEslintOptions): ESLint.Plugin {
  return {
    meta: { name: PACKAGE_NAME },
    processors: { [PLUGIN_NAME]: createProcessor(vueProcessor, options) },
  }
}

/**
 * Hands the yaml of every `<tailwind>` block to the class sorting rules as `clsx("...")` calls.
 * Add a sorting plugin such as eslint-plugin-better-tailwindcss after it. Its default callees
 * already include clsx, so its rules lint the blocks without any option.
 * Place it after eslint-plugin-vue's config, because the last processor set for .vue files wins.
 */
function createConfig(options?: TailwindBlockEslintOptions): Linter.Config[] {
  return [
    {
      name: `${PACKAGE_NAME}/processor`,
      files: ['**/*.vue'],
      plugins: { [PLUGIN_NAME]: createPlugin(options) },
      processor: `${PLUGIN_NAME}/${PLUGIN_NAME}`,
    },
    {
      name: `${PACKAGE_NAME}/virtual-files`,
      files: [`**/*.vue/*_${VIRTUAL_FILE_NAME}`],
      languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
  ]
}

interface TailwindBlockPlugin extends ESLint.Plugin {
  configs: { recommended: Linter.Config[] }
  createConfig: (options?: TailwindBlockEslintOptions) => Linter.Config[]
}

const plugin: TailwindBlockPlugin = {
  ...createPlugin(),
  configs: { recommended: createConfig() },
  createConfig,
}

export default plugin
export { createProcessor } from './processor'
export type { TailwindBlockEslintOptions } from './processor'
