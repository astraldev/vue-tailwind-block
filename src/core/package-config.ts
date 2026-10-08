export const PackageConfig = {
  /** Name the plugins, the Nuxt module and the ESLint configs register under. */
  name: 'vue-tailwind-block',
  /** Tag of the custom block, as in `<tailwind lang="yaml">`. */
  blockType: 'tailwind',
  /** Values the block's `lang` attribute may take. A block without `lang` is read as yaml. */
  blockLangs: ['yaml', 'yml'],
  /** Name of the compiled variable when `variableName` is not set. */
  defaultVariableName: 'classes',
}
