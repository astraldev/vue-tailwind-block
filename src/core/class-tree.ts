/**
 * A compiled `<tailwind>` block. Each key of the yaml becomes a key here: a list of class
 * strings becomes one space separated string, and a nested mapping becomes a nested object.
 * @example
 * // root: [flex, p-4] and sizes: { sm: h-8 } compile to
 * { root: 'flex p-4', sizes: { sm: 'h-8' } }
 */
export interface ClassTree {
  [name: string]: string | ClassTree
}

export function buildClassTree(parsedYaml: unknown): ClassTree {
  if (!isPlainObject(parsedYaml)) {
    throw new InvalidClassValueError([], parsedYaml)
  }

  return buildClassGroup(parsedYaml, [])
}

function buildClassGroup(
  yamlGroup: Record<string, unknown>,
  pathToGroup: string[],
): ClassTree {
  const classGroup: ClassTree = {}

  for (const [name, value] of Object.entries(yamlGroup)) {
    classGroup[name] = buildClassValue(value, [...pathToGroup, name])
  }

  return classGroup
}

function buildClassValue(value: unknown, pathToValue: string[]): string | ClassTree {
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value)) {
    return mergeClassList(value, pathToValue)
  }

  if (isPlainObject(value)) {
    return buildClassGroup(value, pathToValue)
  }

  throw new InvalidClassValueError(pathToValue, value)
}

function mergeClassList(classList: unknown[], pathToList: string[]): string {
  const classEntries = classList.map((entry) => {
    if (typeof entry !== 'string') {
      throw new InvalidClassValueError(pathToList, entry)
    }
    return entry.trim()
  })

  return classEntries.filter((entry) => entry.length > 0).join(' ')
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** A yaml value that is not a class string, a list of class strings or a mapping. */
export class InvalidClassValueError extends Error {
  constructor(pathToValue: string[], value: unknown) {
    const location = pathToValue.length > 0 ? pathToValue.join('.') : 'the top level'
    super(`Expected a class string, list or group at ${location}, got ${JSON.stringify(value)}`)
    this.name = 'InvalidClassValueError'
  }
}
