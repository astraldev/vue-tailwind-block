import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const fixtureDirectory = fileURLToPath(new URL('../../../test-fixtures/volar', import.meta.url))

/** Runs the real vue-tsc against dist, so `pnpm build` must have run (the pretest script does). */
function typecheckFixture(tsconfigName: string): { exitCode: number | null; output: string } {
  const result = spawnSync('pnpm', ['exec', 'vue-tsc', '--noEmit', '-p', tsconfigName], {
    cwd: fixtureDirectory,
    encoding: 'utf8',
  })

  return { exitCode: result.status, output: result.stdout + result.stderr }
}

describe('volar plugin through vue-tsc', () => {
  it('types the variable in script and template with no errors', () => {
    expect(typecheckFixture('tsconfig.json')).toMatchObject({ exitCode: 0 })
  })

  it('honours a custom variable name', () => {
    expect(typecheckFixture('tsconfig.styles.json')).toMatchObject({ exitCode: 0 })
  })

  it('flags misspelled slots and underlines a broken block on its yaml line, but not a plain script', () => {
    const { output } = typecheckFixture('tsconfig.negative.json')

    expect(output).toContain("Property 'nope' does not exist")
    expect(output).toContain("Property 'nothing' does not exist")
    expect(output).toContain('Broken.vue(11,1)')
    expect(output).not.toContain('NoScriptSetup.vue')
  })
}, 120_000)
