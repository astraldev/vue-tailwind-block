# vue-tailwind-block

Write the Tailwind classes of a Vue component as YAML in a
`<tailwind lang="yaml">` block, grouped by variant and commented where
needed. At build time the block becomes a `classes` object that the
template and the script read like any other variable.

```vue
<template>
  <button :class="[classes.root, classes.variants[variant]]">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{ variant: 'primary' | 'outline' }>()
</script>

<tailwind lang="yaml">
root:
  - inline-flex items-center rounded-md px-4 py-2
  - disabled:pointer-events-none disabled:opacity-50 # no clicks while disabled
variants:
  primary: bg-black text-white hover:bg-black/80
  outline: border hover:bg-gray-100
</tailwind>
```

## Install

```bash
pnpm add -D vue-tailwind-block
```

In Nuxt 3.10 or newer, add the module. It also sets up the editor types:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['vue-tailwind-block/nuxt'],
})
```

In Vite, add the plugin next to `vue()`, and the editor plugin to
`tsconfig.json`:

```ts
// vite.config.ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import tailwindBlock from 'vue-tailwind-block/vite'

export default defineConfig({
  plugins: [tailwindBlock(), vue()],
})
```

```json
{
  "vueCompilerOptions": {
    "plugins": [{ "name": "vue-tailwind-block/volar" }]
  }
}
```

Works with Tailwind CSS v3 and v4. With v3, include your `.vue` files in
`content` so Tailwind sees the classes in the block.

## Documentation

The docs live in [`docs/`](docs). Run `pnpm docs:dev` to read them
locally.

- [Introduction](docs/content/1.getting-started/1.introduction.md)
- [Installation](docs/content/1.getting-started/2.installation.md)
- [Configuration](docs/content/1.getting-started/3.configuration.md)
- [Writing blocks](docs/content/2.guide/1.writing-blocks.md)
- [Type checking](docs/content/2.guide/2.type-checking.md)
- [Linting](docs/content/2.guide/3.linting.md)
- [Core API](docs/content/3.api/1.core.md)
