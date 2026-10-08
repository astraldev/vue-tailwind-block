<script setup lang="ts">
const props = withDefaults(defineProps<{ variant?: 'a' | 'b' }>(), { variant: 'a' })
console.log(props.variant, classes.base.root)
</script>

<template>
  <button :class="[classes.base.root, classes.variants[variant]]"><slot /></button>
</template>

<tailwind lang="yaml">
base:
  root: x
variants:
  a: y
  b: z
</tailwind>
