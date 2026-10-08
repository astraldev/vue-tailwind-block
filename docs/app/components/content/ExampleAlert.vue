<script setup lang="ts">
defineProps<{ tone: 'info' | 'danger', title: string }>()
</script>

<template>
  <div role="alert" :class="[classes.root, classes.tones[tone].root]">
    <p :class="[classes.title, classes.tones[tone].title]">{{ title }}</p>
    <p :class="classes.body"><slot /></p>
  </div>
</template>

<tailwind lang="yaml">
root: flex flex-col gap-1 rounded-lg border px-4 py-3 text-sm
title: font-medium
body: opacity-80

# each tone colors the box and the title, the body stays neutral
tones:
  info:
    root: border-sky-500/30 bg-sky-500/10
    title: text-sky-500
  danger:
    root: border-red-500/30 bg-red-500/10
    title: text-red-500
</tailwind>
