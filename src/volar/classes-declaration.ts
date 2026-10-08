import { DEFAULT_VARIABLE_NAME } from '~/_utils'
import type { ClassTree, TailwindBlockOptions } from '~/_utils'

/** TS statement injected into the component so the variable is typed as the exact block shape. */
export function buildClassesDeclaration(
  classTree: ClassTree,
  options: TailwindBlockOptions = {},
): string {
  const variableName = options.variableName ?? DEFAULT_VARIABLE_NAME

  return `const ${variableName} = ${JSON.stringify(classTree)} as const;`
}
