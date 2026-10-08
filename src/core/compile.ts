import { isSupportedBlockLang } from './blocks'
import { buildClassTree, InvalidClassValueError } from './class-tree'
import type { ClassTree } from './class-tree'
import { TailwindBlockError } from './errors'
import type { BlockProblem } from './errors'
import { normalizeScalarsToStrings } from './scalars'
import { PackageConfig } from './package-config'
import { lineRange } from './text'
import { parseYaml } from './yaml'

export interface CompileOptions {
  /**
   * The block's `lang` attribute. `'yaml'`, `'yml'` and `undefined` (no attribute) compile. Any
   * other lang is reported as a problem covering the whole block.
   * @default undefined
   */
  lang?: string
}

/** Either the compiled block, or every problem that stopped it from compiling. Check `ok` first. */
export type CompileResult = { ok: true; classTree: ClassTree } | { ok: false; problems: BlockProblem[] }

/**
 * Compiles the content of a `<tailwind>` block, the text between its tags, into a class tree.
 * Yaml syntax errors and warnings are reported on the line they occur on. A value that is not a
 * class string, list or mapping is reported on the whole block, with its key path in the message.
 * @example
 * const result = compileBlock('root:\n  - flex\n  - p-4', { lang: 'yaml' })
 * if (result.ok) result.classTree.root // 'flex p-4'
 */
export function compileBlock(blockContent: string, options: CompileOptions = {}): CompileResult {
  if (!isSupportedBlockLang(options.lang)) {
    return { ok: false, problems: [{ message: describeUnsupportedLang(options.lang), start: 0, end: blockContent.length }] }
  }

  // normalizing keeps every line where it was, so yaml line numbers hold for the block content
  const { value, problems } = parseYaml(normalizeScalarsToStrings(blockContent))

  if (problems.length > 0) {
    return {
      ok: false,
      problems: problems.map((problem) => ({ message: problem.message, ...lineRange(blockContent, problem.line - 1) })),
    }
  }

  try {
    return { ok: true, classTree: buildClassTree(value) }
  } catch (thrownError) {
    if (thrownError instanceof InvalidClassValueError) {
      return { ok: false, problems: [{ message: thrownError.message, start: 0, end: blockContent.length }] }
    }

    throw thrownError
  }
}

/**
 * Same as `compileBlock`, for code where a broken block should stop the work, like a build.
 * @throws {TailwindBlockError} when the block does not compile, carrying every problem.
 */
export function compileBlockOrThrow(blockContent: string, options: CompileOptions = {}): ClassTree {
  const result = compileBlock(blockContent, options)

  if (!result.ok) {
    throw new TailwindBlockError(result.problems)
  }

  return result.classTree
}

function describeUnsupportedLang(lang: string | undefined): string {
  const accepted = PackageConfig.blockLangs.map((blockLang) => `"${blockLang}"`).join(', ')
  return `The lang of a <${PackageConfig.blockType}> block must be ${accepted} or left out, got "${lang}"`
}
