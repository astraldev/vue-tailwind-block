import type { Plugin } from 'vite'
import type { TailwindBlockOptions } from '~/core/options'
import { unplugin } from './unplugin'

/**
 * Typed with the consumer's own vite instead of the copy unplugin bundles, because two vite type
 * versions in one config makes TypeScript fail.
 */
const tailwindBlockVitePlugin = unplugin.vite as unknown as (options?: TailwindBlockOptions) => Plugin

export default tailwindBlockVitePlugin
export { transformSfc } from './transform-sfc'
export type { TailwindBlockOptions } from '~/core/options'
