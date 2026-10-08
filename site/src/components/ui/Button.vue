<script setup lang="ts">
type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    as?: 'button' | 'a'
  }>(),
  { variant: 'default', size: 'default', as: 'button' },
)
</script>

<template>
  <component :is="as" :class="[classes.base.root, classes.variants[variant], classes.sizes[size]]">
    <slot />
  </component>
</template>

<tailwind lang="yaml">
base:
  root:
    - inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all
    - disabled:pointer-events-none disabled:opacity-50
    - outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50
    - aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40

variants:
  default:
    - bg-primary text-primary-foreground shadow-xs hover:bg-primary/90
  destructive:
    - bg-destructive text-white shadow-xs hover:bg-destructive/90
    - focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40
  outline:
    - border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground
    - dark:border-input dark:bg-input/30 dark:hover:bg-input/50
  secondary:
    - bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80
  ghost:
    - hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50
  link:
    - text-primary underline-offset-4 hover:underline

sizes:
  default:
    - h-9 px-4 py-2
  sm:
    - h-8 gap-1.5 px-3
  lg:
    - h-10 px-6
  icon:
    - size-9
</tailwind>
