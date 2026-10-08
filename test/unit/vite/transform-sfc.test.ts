import { describe, expect, it } from 'vitest'
import { transformSfc } from '~/vite/transform-sfc'

const tailwindBlock = '<tailwind lang="yaml">\nbase:\n  root:\n    - h-5 w-5\n    - "@md:flex"\n</tailwind>'
const compiledClasses = 'const classes = {"base":{"root":"h-5 w-5 @md:flex"}};'

describe('transformSfc', () => {
  it('returns undefined when the file has no tailwind block', () => {
    expect(transformSfc('<template><div /></template>')).toBeUndefined()
  })

  it('removes the block and declares the variable first in an existing script setup', () => {
    const source = `${tailwindBlock}\n<script setup>\nconst count = 1\n</script>`

    const transformed = transformSfc(source)?.code

    expect(transformed).not.toContain('<tailwind')
    expect(transformed).toContain(`<script setup>\n${compiledClasses}\nconst count = 1`)
  })

  it('creates a script setup matching the existing script lang when there is none', () => {
    const source = `${tailwindBlock}\n<script lang="ts">\nexport default {}\n</script>`

    expect(transformSfc(source)?.code).toContain(`<script setup lang="ts">\n${compiledClasses}\n</script>`)
  })

  it('uses the configured variable name', () => {
    const transformed = transformSfc(tailwindBlock, { binding: 'styles' })?.code

    expect(transformed).toContain('const styles = {"base"')
  })

  it('returns a source map for the transformed code', () => {
    const source = `${tailwindBlock}\n<script setup>\nconst count = 1\n</script>`

    const { map } = transformSfc(source)!

    expect(map.mappings.length).toBeGreaterThan(0)
  })

  it('compiles a block written with lang="yml"', () => {
    const transformed = transformSfc(tailwindBlock.replace('lang="yaml"', 'lang="yml"'))?.code

    expect(transformed).toContain(compiledClasses)
  })

  it('throws on a block in a lang other than yaml', () => {
    expect(() => transformSfc(tailwindBlock.replace('lang="yaml"', 'lang="json"'))).toThrow('got "json"')
  })

  it('throws when the file has more than one tailwind block', () => {
    const source = `${tailwindBlock}\n${tailwindBlock}`

    expect(() => transformSfc(source)).toThrow('found 2')
  })
})
