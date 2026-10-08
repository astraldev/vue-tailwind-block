/** Compiled `<tailwind>` block: groups of slots, each slot a merged class string. */
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

export class InvalidClassValueError extends Error {
  constructor(pathToValue: string[], value: unknown) {
    const location = pathToValue.length > 0 ? pathToValue.join('.') : 'the top level'
    super(`Expected a class string, list or group at ${location}, got ${JSON.stringify(value)}`)
    this.name = 'InvalidClassValueError'
  }
}
