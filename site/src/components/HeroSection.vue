<script setup lang="ts">
import Button from './ui/Button.vue'

const announcementText = 'New: typed slots with the Volar plugin'
const installCommand = 'pnpm add vue-tailwind-block'
</script>

<template>
  <section :class="[classes.base.root]">
    <a href="#features" :class="[classes.base.announcement]">{{ announcementText }} &rarr;</a>

    <h1 :class="[classes.base.title]">Build your styles as structured data</h1>

    <p :class="[classes.base.subtitle]">
      Write Tailwind classes as YAML inside your Vue files. Name every slot, read it back as
      <code :class="[classes.base.inlineCode]">classes.base.root</code>, and keep long class
      attributes out of your markup.
    </p>

    <div :class="[classes.base.actions]">
      <Button as="a" href="#usage" size="lg">Get started</Button>
      <Button as="a" href="#pricing" variant="outline" size="lg">View pricing</Button>
    </div>

    <code :class="[classes.base.command]">{{ installCommand }}</code>
  </section>
</template>

<tailwind lang="yaml">
base:
  root:
    - flex flex-col items-center gap-3 py-12 text-center md:py-20
  announcement:
    - inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm font-medium
    - transition-colors hover:bg-accent
  title:
    - max-w-3xl text-4xl leading-tight font-bold tracking-tighter text-balance md:text-5xl lg:text-6xl
  subtitle:
    - max-w-2xl text-lg text-balance text-muted-foreground sm:text-xl
  inlineCode:
    - rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground
  actions:
    - flex flex-wrap justify-center gap-2 pt-2
  command:
    - mt-4 rounded-md border bg-muted/50 px-3 py-1.5 font-mono text-sm text-muted-foreground
</tailwind>
