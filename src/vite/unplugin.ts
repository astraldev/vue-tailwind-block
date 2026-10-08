import { createUnplugin } from 'unplugin'
import { PACKAGE_NAME } from '~/core/constants'
import type { TailwindBlockOptions } from '~/core/options'
import { transformSfc } from './transform-sfc'

const VUE_FILE = /\.vue$/

export const unplugin = createUnplugin((options?: TailwindBlockOptions) => ({
  name: PACKAGE_NAME,
  enforce: 'pre',
  transformInclude: (moduleId) => VUE_FILE.test(moduleId),
  transform: (sfcSource) => transformSfc(sfcSource, options),
}))
