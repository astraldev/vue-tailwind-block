import type { ClassTree } from './class-tree'

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/

/** The statement the build puts at the top of `<script setup>`. */
export function declareClasses(variableName: string, classTree: ClassTree): string {
  return `const ${variableName} = ${JSON.stringify(classTree)};`
}

/**
 * The statement the editor sees instead. Values are typed `string` so a hover over the variable
 * shows only its keys, and each key carries its classes as JSDoc, which a hover over that key
 * shows. The keys stay exact, so a misspelled one is still an error.
 */
export function declareClassesType(variableName: string, classTree: ClassTree): string {
  return `const ${variableName} = {} as ${buildTypeLiteral(classTree, '')};`
}

function buildTypeLiteral(classTree: ClassTree, indentation: string): string {
  const memberIndentation = `${indentation}  `
  const members = Object.entries(classTree).map(([key, value]) => {
    const propertyName = IDENTIFIER.test(key) ? key : JSON.stringify(key)

    if (typeof value !== 'string') {
      return `${memberIndentation}${propertyName}: ${buildTypeLiteral(value, memberIndentation)}`
    }

    const classDoc = value === '' ? '' : `${memberIndentation}/** ${value.replaceAll('*/', '*\\/')} */\n`
    return `${classDoc}${memberIndentation}${propertyName}: string`
  })

  return `{\n${members.join('\n')}\n${indentation}}`
}
