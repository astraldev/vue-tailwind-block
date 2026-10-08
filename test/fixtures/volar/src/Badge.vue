<script setup lang="ts">
const tone: 'neutral' | 'danger' = 'neutral'
</script>

<template>
  <span :class="[classes.root, classes.tones[tone]]"><slot /></span>
</template>

<tailwind lang="yaml">
root: rounded px-2
tones:
  neutral: bg-gray-100
  danger: bg-red-100
</tailwind>
