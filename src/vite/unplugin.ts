import { createUnplugin } from 'unplugin'
import { PackageConfig } from '~/core/package-config'
import type { TailwindBlockOptions } from '~/core/options'
import { transformSfc } from './transform-sfc'

const VUE_FILE = /\.vue$/

export const unplugin = createUnplugin((options?: TailwindBlockOptions) => ({
  name: PackageConfig.name,
  enforce: 'pre',
  transformInclude: (moduleId) => VUE_FILE.test(moduleId),
  transform: (sfcSource) => transformSfc(sfcSource, options),
}))
