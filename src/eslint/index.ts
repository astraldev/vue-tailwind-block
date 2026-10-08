import type { ESLint, Linter } from 'eslint'
import { PackageConfig } from '~/core/package-config'
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
    meta: { name: PackageConfig.name },
    processors: { [PLUGIN_NAME]: createProcessor(vueProcessor, options) },
  }
}

/**
 * Flat config that lets Tailwind lint rules check `<tailwind>` blocks: each yaml entry is linted
 * as a `clsx("...")` call, and reports and fixes land back on the yaml. Pair it with a Tailwind
 * rule plugin such as eslint-plugin-better-tailwindcss, whose default callees include `clsx`.
 * Spread it after eslint-plugin-vue's config, because the last processor set for `.vue` wins.
 * @example
 * export default [
 *   ...pluginVue.configs['flat/essential'],
 *   ...tailwindBlock.createConfig({ rules: [/tailwind/, 'quotes'] }),
 *   betterTailwindcss.configs.stylistic,
 * ]
 */
function createConfig(options?: TailwindBlockEslintOptions): Linter.Config[] {
  return [
    {
      name: `${PackageConfig.name}/processor`,
      files: ['**/*.vue'],
      plugins: { [PLUGIN_NAME]: createPlugin(options) },
      processor: `${PLUGIN_NAME}/${PLUGIN_NAME}`,
    },
    {
      name: `${PackageConfig.name}/virtual-files`,
      files: [`**/*.vue/*_${VIRTUAL_FILE_NAME}`],
      languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
  ]
}

interface TailwindBlockPlugin extends ESLint.Plugin {
  configs: {
    /** `createConfig()` with the default options. */
    recommended: Linter.Config[]
  }
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
