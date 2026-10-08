import type { Plugin } from 'vite'
import type { TailwindBlockOptions } from '~/core/options'
import { unplugin } from './unplugin'

// typed with the consumer's own vite instead of the copy unplugin bundles, because two vite type
// versions in one config make TypeScript fail
/**
 * Compiles the `<tailwind>` block of each `.vue` file into a variable declared at the top of
 * `<script setup>`. Register it before `vue()`, because the Vue plugin does not know the block
 * and must receive the file without it.
 * @example
 * import vue from '@vitejs/plugin-vue'
 * import tailwindBlock from 'vue-tailwind-block/vite'
 *
 * export default defineConfig({ plugins: [tailwindBlock(), vue()] })
 */
const tailwindBlockVitePlugin = unplugin.vite as unknown as (options?: TailwindBlockOptions) => Plugin

export default tailwindBlockVitePlugin
export { transformSfc } from './transform-sfc'
export type { TailwindBlockOptions } from '~/core/options'
