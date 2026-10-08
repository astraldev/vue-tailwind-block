<script setup lang="ts">
definePageMeta({ header: false, footer: false })

const title = 'Tailwind CSS classes in a YAML block for Vue and Nuxt'
const description = 'Write the Tailwind classes of a Vue component in a <tailwind> block, and read them in the template as a typed classes object.'

useSeoMeta({ title, ogTitle: title, description, ogDescription: description })

const { github, socials } = useAppConfig()
const pageSourceUrl = `${github.url}/blob/${github.branch}/${github.rootDir}/app/pages/index.vue`

const installCode = [
  '::code-group',
  ...[
    ['pnpm', 'pnpm add -D vue-tailwind-block'],
    ['npm', 'npm install -D vue-tailwind-block'],
    ['yarn', 'yarn add -D vue-tailwind-block'],
    ['bun', 'bun add -D vue-tailwind-block'],
  ].map(([manager, command]) => `\`\`\`bash [${manager}]\n${command}\n\`\`\``),
  '::',
].join('\n')

const features = [
  {
    icon: 'i-simple-icons-nuxt',
    name: 'Nuxt module',
    description: 'One line in modules sets up the build and the editor types.',
    to: '/getting-started/installation',
  },
  {
    icon: 'i-simple-icons-vite',
    name: 'Vite plugin',
    description: 'Compiles each block into a plain object at build time. No YAML parser reaches the browser.',
    to: '/getting-started/installation',
  },
  {
    icon: 'i-simple-icons-vuedotjs',
    name: 'Volar plugin',
    description: 'The Vue extension and vue-tsc flag keys that are not in the block, and show a key\'s classes on hover.',
    to: '/guide/type-checking',
  },
  {
    icon: 'i-simple-icons-eslint',
    name: 'ESLint',
    description: 'The Tailwind ESLint plugin you already use checks the block and fixes it in place.',
    to: '/guide/linting',
  },
]
</script>

<template>
  <UContainer :class="classes.page">
    <div :class="classes.column">
      <p :class="classes.eyebrow">
        For Nuxt and Vite, with Tailwind CSS v3 and v4
      </p>

      <h1 :class="classes.title">
        Tailwind classes in a <span :class="classes.highlight">YAML block</span>
      </h1>

      <p :class="classes.lead">
        A <code>&lt;tailwind&gt;</code> block for Vue single file components. It keeps long class lists out
        of the template, gives them a typed <code>classes</code> object, and compiles away at build time.
      </p>

      <div :class="classes.actions">
        <UButton to="/getting-started/introduction" size="lg" trailing-icon="i-lucide-arrow-right">
          Get started
        </UButton>
        <UButton :to="github.url" target="_blank" size="lg" color="neutral" variant="subtle" icon="i-simple-icons-github">
          GitHub
        </UButton>
        <UButton :to="socials.npm" target="_blank" size="lg" color="neutral" variant="subtle" icon="i-simple-icons-npm">
          npm
        </UButton>
      </div>

      <MDC :value="installCode" :class="classes.install" />

      <ul :class="classes.features.grid">
        <li v-for="feature in features" :key="feature.name">
          <NuxtLink :to="feature.to" :class="classes.features.card">
            <UIcon :name="feature.icon" :class="classes.features.icon" />
            <p :class="classes.features.name">{{ feature.name }}</p>
            <p :class="classes.features.description">{{ feature.description }}</p>
          </NuxtLink>
        </li>
      </ul>

      <p :class="classes.source">
        This page is styled with a <code>&lt;tailwind&gt;</code> block.
        <ULink :to="pageSourceUrl" target="_blank" :class="classes.sourceLink">See it on GitHub</ULink>
      </p>
    </div>
  </UContainer>
</template>

<tailwind lang="yaml">
page: flex min-h-dvh flex-col justify-center py-12
column: w-full lg:max-w-[60%]

eyebrow: text-sm font-medium text-primary
title:
  - mt-3 text-4xl font-bold tracking-tight text-pretty text-highlighted
  - sm:text-5xl
highlight: text-primary
lead: mt-6 text-lg text-pretty text-muted
actions: mt-8 flex flex-wrap items-center gap-3

install: mt-6 max-w-md

features:
  grid: mt-10 grid gap-4 sm:grid-cols-2
  card:
    - group flex h-full flex-col rounded-lg border border-default p-5
    - transition-colors hover:border-primary/50 hover:bg-elevated/50
  icon: size-6 text-muted group-hover:text-primary
  name: mt-4 font-medium text-highlighted
  description: mt-1 text-sm text-muted

source: mt-8 text-sm text-muted
sourceLink: text-primary hover:underline
</tailwind>
