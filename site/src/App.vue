<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import CodeSample from './components/CodeSample.vue'
import FeatureCard from './components/FeatureCard.vue'
import FooterSection from './components/FooterSection.vue'
import HeroSection from './components/HeroSection.vue'
import NavBar from './components/NavBar.vue'
import PricingTable from './components/PricingTable.vue'
import { yamlSampleCode, yamlSampleFileName } from './content/yamlSample'

const featureCards = [
  {
    title: 'Styles as data',
    description:
      'Name every slot and write its classes as a list. Each list is merged into one class string.',
  },
  {
    title: 'No quotes needed',
    description:
      'Write !flex, @md:flex or *:p-2 as they are. Entries are turned into strings before YAML parses them.',
  },
  {
    title: 'Groups that earn their place',
    description:
      'Always-on classes live in base. Add a group like variants or sizes only when a prop selects between its entries.',
  },
  {
    title: 'Typed slots',
    description:
      'The Volar plugin types the classes variable, so a misspelled group or slot fails in the editor.',
  },
  {
    title: 'Compiled before Vue',
    description:
      'The Vite plugin runs ahead of the Vue plugin and declares the classes variable for you.',
  },
  {
    title: 'One file per component',
    description:
      'Template, script and styling stay together. Nothing to import, nothing to declare.',
  },
]

const isDarkModeEnabled = ref(readSystemDarkModePreference())

function readSystemDarkModePreference() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function toggleDarkMode() {
  isDarkModeEnabled.value = !isDarkModeEnabled.value
}

function applyDarkModeToDocument() {
  document.documentElement.classList.toggle('dark', isDarkModeEnabled.value)
}

watchEffect(applyDarkModeToDocument)
</script>

<template>
  <div id="top" :class="[classes.base.root]">
    <NavBar :is-dark-mode-enabled="isDarkModeEnabled" @toggle-dark-mode="toggleDarkMode" />

    <main :class="[classes.base.main]">
      <HeroSection />

      <section id="features" :class="[classes.base.section]">
        <h2 :class="[classes.base.sectionTitle]">Why a tailwind block</h2>
        <p :class="[classes.base.sectionIntro]">
          Long class attributes bury the markup. A block of YAML keeps the structure readable.
        </p>
        <div :class="[classes.base.featureGrid]">
          <FeatureCard
            v-for="featureCard in featureCards"
            :key="featureCard.title"
            :title="featureCard.title"
            :description="featureCard.description"
          />
        </div>
      </section>

      <section id="usage" :class="[classes.base.section]">
        <h2 :class="[classes.base.sectionTitle]">One block, only the groups you need</h2>
        <p :class="[classes.base.sectionIntro]">
          A button keeps its shared classes in base and switches between variants and sizes by prop.
        </p>
        <CodeSample :file-name="yamlSampleFileName" :code="yamlSampleCode" />
      </section>

      <section id="pricing" :class="[classes.base.section]">
        <h2 :class="[classes.base.sectionTitle]">Pricing</h2>
        <p :class="[classes.base.sectionIntro]">
          Demo tiers that show data attributes, aria states and the shared Button and Badge.
        </p>
        <PricingTable />
      </section>
    </main>

    <FooterSection />
  </div>
</template>

<tailwind lang="yaml">
base:
  root:
    - min-h-screen bg-background font-sans text-foreground antialiased
  main:
    - mx-auto flex max-w-5xl flex-col gap-20 px-4 pb-24 md:px-6
  section:
    - flex scroll-mt-20 flex-col gap-4
  sectionTitle:
    - text-2xl font-semibold tracking-tight md:text-3xl
  sectionIntro:
    - max-w-2xl text-muted-foreground
  featureGrid:
    - grid gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-3
</tailwind>
