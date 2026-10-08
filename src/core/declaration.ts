import type { ClassTree } from './class-tree'

/**
 * The statement that declares the compiled block. `asConst` keeps the exact shape and values in
 * the type, which the type checker wants and the runtime code does not need.
 */
export function declareClasses(variableName: string, classTree: ClassTree, { asConst = false } = {}): string {
  return `const ${variableName} = ${JSON.stringify(classTree)}${asConst ? ' as const' : ''};`
}
