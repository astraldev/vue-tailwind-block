<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <article :class="[classes.base.root]">
    <h3 :class="[classes.base.title]">{{ title }}</h3>
    <p :class="[classes.base.description]">{{ description }}</p>
  </article>
</template>

<tailwind lang="yaml">
base:
  root:
    - flex flex-col gap-2 rounded-xl border bg-card p-6 text-card-foreground shadow-sm
    - transition-colors hover:border-primary/50
  title:
    - leading-none font-semibold
  description:
    - text-sm/6 text-muted-foreground
</tailwind>
