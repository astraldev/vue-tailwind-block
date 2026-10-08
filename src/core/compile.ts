import { buildClassTree, InvalidClassValueError } from './class-tree'
import type { ClassTree } from './class-tree'
import { TailwindBlockError } from './errors'
import type { BlockProblem } from './errors'
import { normalizeScalarsToStrings } from './scalars'
import { lineRange } from './text'
import { parseYaml } from './yaml'

export type CompileResult = { ok: true; classTree: ClassTree } | { ok: false; problems: BlockProblem[] }

/**
 * Compiles the yaml content of a `<tailwind>` block. Yaml problems are reported on their line,
 * invalid class values on the whole block.
 */
export function compileBlock(blockContent: string): CompileResult {
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

/** For build tools, where a broken block should fail the build. */
export function compileBlockOrThrow(blockContent: string): ClassTree {
  const result = compileBlock(blockContent)

  if (!result.ok) {
    throw new TailwindBlockError(result.problems)
  }

  return result.classTree
}
