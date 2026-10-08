import { describe, expect, it } from 'vitest'
import { addVolarPlugin } from '~/nuxt/volar-config'

describe('addVolarPlugin', () => {
  it('registers the volar plugin with the options, creating the vue compiler options', () => {
    const tsConfig = {}

    addVolarPlugin(tsConfig, { binding: 'styles' })

    expect(tsConfig).toEqual({
      vueCompilerOptions: { plugins: [{ name: 'vue-tailwind-block/volar', binding: 'styles' }] },
    })
  })

  it('keeps the plugins that were already registered', () => {
    const tsConfig = { vueCompilerOptions: { plugins: ['other-plugin'] } }

    addVolarPlugin(tsConfig, {})

    expect(tsConfig.vueCompilerOptions.plugins).toEqual(['other-plugin', { name: 'vue-tailwind-block/volar' }])
  })
})
