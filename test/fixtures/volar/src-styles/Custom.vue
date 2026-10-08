<script setup lang="ts">
const label = styles.base.root
</script>

<template>
  <div :class="[styles.base.root]" :title="label" />
</template>

<tailwind lang="yaml">
base:
  root: x
</tailwind>
