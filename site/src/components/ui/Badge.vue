<script setup lang="ts">
type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

withDefaults(defineProps<{ variant?: BadgeVariant }>(), { variant: 'default' })
</script>

<template>
  <span :class="[classes.base.root, classes.variants[variant]]">
    <slot />
  </span>
</template>

<tailwind lang="yaml">
base:
  root:
    - inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium
    - transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50

variants:
  default:
    - border-transparent bg-primary text-primary-foreground
  secondary:
    - border-transparent bg-secondary text-secondary-foreground
  destructive:
    - border-transparent bg-destructive text-white
  outline:
    - text-foreground
</tailwind>
