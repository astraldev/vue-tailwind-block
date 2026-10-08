import { createUnplugin } from 'unplugin'
import type { TailwindBlockOptions } from '~/_utils'
import { transformSfc } from './transform-sfc'

const VUE_FILE = /\.vue$/

export const unplugin = createUnplugin((options?: TailwindBlockOptions) => ({
  name: 'vue-tailwind-block',
  enforce: 'pre',
  transformInclude: (moduleId) => VUE_FILE.test(moduleId),
  transform: (sfcSource) => transformSfc(sfcSource, options),
}))
