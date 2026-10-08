import { fileURLToPath } from 'node:url'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'
import { ESLint } from 'eslint'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import { describe, expect, it } from 'vitest'
import { compileBlockOrThrow } from '~/core'
import tailwindBlock from '~/eslint'

const fixtureDirectory = fileURLToPath(new URL('../fixtures/eslint', import.meta.url))

const unsortedFile = [
  '<template><div /></template>',
  '',
  '<tailwind lang="yaml">',
  'base:',
  '  root:',
  '    - p-4 flex bg-white',
  '    - "@md:flex underline"',
  '</tailwind>',
  '',
].join('\n')

/** Only installs the sorting plugin next to ours, exactly like a user would. */
function createEslint(options: { fix: boolean }) {
  return new ESLint({
    cwd: fixtureDirectory,
    overrideConfigFile: true,
    fix: options.fix,
    overrideConfig: [
      { files: ['**/*.vue'], languageOptions: { parser: vueParser } },
      ...tailwindBlock.configs.recommended,
      { ...betterTailwindcss.configs['stylistic'], settings: { 'better-tailwindcss': { entryPoint: 'style.css' } } },
    ],
  })
}

async function lint(sourceText: string, options = { fix: false }) {
  const [result] = await createEslint(options).lintText(sourceText, { filePath: `${fixtureDirectory}/Button.vue` })
  return result
}

describe('tailwind block processor with eslint-plugin-better-tailwindcss', () => {
  it('reports unsorted classes on the yaml line they are written on', async () => {
    const { messages } = await lint(unsortedFile)

    const orderMessage = messages.find((message) => message.ruleId === 'better-tailwindcss/enforce-consistent-class-order')

    expect(orderMessage).toMatchObject({ line: 6 })
  })

  it('autofixes the order inside the yaml, splitting variant groups onto their own entries', async () => {
    const { output } = await lint(unsortedFile, { fix: true })

    expect(output).toBe(
      unsortedFile
        .replace('p-4 flex bg-white', 'flex bg-white p-4')
        .replace('    - "@md:flex underline"', '    - "underline"\n    - "@md:flex"'),
    )
  })

  it('does nothing for a file without a tailwind block', async () => {
    const { messages } = await lint('<template><div /></template>\n')

    expect(messages).toEqual([])
  })

  it('keeps eslint-plugin-vue working when its config comes first', async () => {
    const eslint = new ESLint({
      cwd: fixtureDirectory,
      overrideConfigFile: true,
      overrideConfig: [
        ...pluginVue.configs['flat/essential'],
        ...tailwindBlock.configs.recommended,
        { ...betterTailwindcss.configs['stylistic'], settings: { 'better-tailwindcss': { entryPoint: 'style.css' } } },
      ],
    })

    const [{ messages }] = await eslint.lintText(unsortedFile, { filePath: `${fixtureDirectory}/Button.vue` })
    const ruleIds = messages.map((message) => message.ruleId)

    expect(ruleIds).toContain('better-tailwindcss/enforce-consistent-class-order')
    expect(ruleIds).not.toContain('vue/comment-directive')
  })
})

const longClasses = 'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all'

const longEntriesFile = [
  '<template><div /></template>',
  '',
  '<tailwind lang="yaml">',
  'base:',
  '  root:',
  `    - ${longClasses}`,
  `    - "${longClasses}"`,
  `  title: ${longClasses}`,
  '</tailwind>',
  '',
].join('\n')

/** The classes each slot ends up with, whatever order and line layout the yaml uses. */
function compileSlots(sfcSource: string): Record<string, string[]> {
  const yamlSource = sfcSource.slice(sfcSource.indexOf('<tailwind lang="yaml">') + 22, sfcSource.indexOf('</tailwind>'))
  const { base } = compileBlockOrThrow(yamlSource) as Record<string, Record<string, string>>

  return Object.fromEntries(Object.entries(base).map(([slot, classes]) => [slot, classes.split(' ').sort()]))
}

describe('line wrapping autofix', () => {
  it('splits a long entry into several list entries without changing the classes', async () => {
    const { output } = await lint(longEntriesFile, { fix: true })

    const yamlLines = output!.split('\n').filter((line) => line.startsWith('    - '))
    const longestLine = Math.max(...yamlLines.map((line) => line.length))

    expect(yamlLines.length).toBeGreaterThan(3)
    expect(longestLine).toBeLessThan(90)
    expect(compileSlots(output!)).toEqual(compileSlots(longEntriesFile))
  })

  it('turns a long `key: classes` line into a list under the key', async () => {
    const { output } = await lint(longEntriesFile, { fix: true })

    expect(output).toMatch(/\n {2}title:\n {4}- /)
  })
})

describe('which rules report on a block', () => {
  const styleRules = { files: ['**/*.js'], rules: { quotes: ['warn', 'single'] as ['warn', 'single'] } }

  async function ruleIdsWith(tailwindBlockConfig: typeof tailwindBlock.configs.recommended) {
    const eslint = new ESLint({
      cwd: fixtureDirectory,
      overrideConfigFile: true,
      overrideConfig: [{ files: ['**/*.vue'], languageOptions: { parser: vueParser } }, ...tailwindBlockConfig, styleRules],
    })
    const [{ messages }] = await eslint.lintText(unsortedFile, { filePath: `${fixtureDirectory}/Button.vue` })

    return messages.map((message) => message.ruleId)
  }

  it('ignores rules that are not about tailwind by default', async () => {
    expect(await ruleIdsWith(tailwindBlock.createConfig())).not.toContain('quotes')
  })

  it('reports the rules the user lists', async () => {
    expect(await ruleIdsWith(tailwindBlock.createConfig({ rules: [/tailwind/, 'quotes'] }))).toContain('quotes')
  })
})
