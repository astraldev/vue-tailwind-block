<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from './ui/Button.vue'

const props = defineProps<{
  fileName: string
  code: string
}>()

const copiedFeedbackDurationMs = 1500

const isCopied = ref(false)

const copyButtonLabel = computed(() => (isCopied.value ? 'Copied' : 'Copy'))

async function copyCodeToClipboard() {
  await navigator.clipboard.writeText(props.code)
  isCopied.value = true
  setTimeout(resetCopiedState, copiedFeedbackDurationMs)
}

function resetCopiedState() {
  isCopied.value = false
}
</script>

<template>
  <figure :class="[classes.base.root]">
    <figcaption :class="[classes.base.header]">
      <span :class="[classes.base.fileName]">{{ fileName }}</span>
      <Button variant="ghost" size="sm" @click="copyCodeToClipboard">{{ copyButtonLabel }}</Button>
    </figcaption>
    <pre :class="[classes.base.pre]"><code :class="[classes.base.code]">{{ code }}</code></pre>
  </figure>
</template>

<tailwind lang="yaml">
base:
  root:
    - overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm
  header:
    - flex items-center justify-between border-b py-1.5 pr-2 pl-4
  fileName:
    - font-mono text-xs text-muted-foreground
  pre:
    - overflow-x-auto p-4 text-xs md:text-sm
  code:
    - font-mono
</tailwind>
