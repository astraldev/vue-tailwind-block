import { defineConfig } from 'tsdown'

// types of these ship their own CommonJS .d.ts that cannot be bundled
const neverBundle = [/^(vite|vue|@vue|@volar|typescript|postcss|rollup|rolldown|esbuild|webpack|@rspack|unplugin)(\/|$)/]

export default defineConfig([
  {
    entry: {
      index: 'src/core/index.ts',
      vite: 'src/vite/index.ts',
      nuxt: 'src/nuxt/index.ts',
    },
    format: 'esm',
    dts: true,
    clean: true,
    deps: { neverBundle },
    exports: {
      // volar is built below as CommonJS, because Vue's language tools `require` it
      customExports: (generatedExports) => ({
        ...generatedExports,
        './volar': { types: './dist/volar.d.cts', default: './dist/volar.cjs' },
      }),
    },
  },
  {
    entry: { volar: 'src/volar/index.ts' },
    format: 'cjs',
    dts: true,
    clean: false,
    deps: { neverBundle },
  },
])
