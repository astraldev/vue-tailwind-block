// Kept outside any .vue file so the sample's tailwind tag is plain text and never parsed as a real block
export const yamlSampleFileName = 'Button.vue'

export const yamlSampleCode = `<script setup lang="ts">
withDefaults(
  defineProps<{ variant?: 'default' | 'outline'; size?: 'default' | 'sm' }>(),
  { variant: 'default', size: 'default' },
)
</script>

<template>
  <button :class="[classes.base.root, classes.variants[variant], classes.sizes[size]]">
    <slot />
  </button>
</template>

<tailwind lang="yaml">
base:
  root:
    - inline-flex items-center justify-center rounded-md text-sm font-medium
    - focus-visible:ring-[3px] focus-visible:ring-ring/50
    - disabled:pointer-events-none disabled:opacity-50

variants:
  default:
    - bg-primary text-primary-foreground hover:bg-primary/90
  outline:
    - border bg-background hover:bg-accent hover:text-accent-foreground

sizes:
  default:
    - h-9 px-4 py-2
  sm:
    - h-8 px-3
</tailwind>
`
