import type { Code, IRCustomBlock } from '@vue/language-core'
import { describe, expect, it } from 'vitest'
import { injectTailwindBlock } from '~/volar/inject'

const tailwindBlock = { name: 'customBlock_0', type: 'tailwind', content: 'base:\n  root: x\n' } as IRCustomBlock

function toText(generatedCode: Code[]): string {
  return generatedCode.map((code) => (typeof code === 'string' ? code : code[0])).join('')
}

function inject(generatedCode: Code[]): string {
  injectTailwindBlock({ generatedCode, tailwindBlock, isTypeScript: true, options: { variableName: 'styles' } })
  return toText(generatedCode)
}

describe('injectTailwindBlock', () => {
  it('declares the variable and wraps the template context with it', () => {
    const generated = inject(['const __VLS_ctx = ', '{} as Instance', ';\n'])

    expect(generated).toContain('const styles = {"base":{"root":"x"}} as const;')
    expect(generated).toContain('const __VLS_ctx = __tailwindBlockContext({} as Instance, { styles });')
  })

  it('reports an error on the block when the generated code has no template context to wrap', () => {
    const generated = inject(['export default {}\n'])

    expect(generated).toContain('could not expose \\"styles\\" to the template')
  })
})
