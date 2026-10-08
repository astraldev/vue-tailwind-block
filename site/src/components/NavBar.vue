<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from './ui/Button.vue'

const props = defineProps<{ isDarkModeEnabled: boolean }>()
const emit = defineEmits<{ 'toggle-dark-mode': [] }>()

const navigationLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Usage', href: '#usage' },
  { label: 'Pricing', href: '#pricing' },
]

const isMenuOpen = ref(false)

const menuState = computed(() => (isMenuOpen.value ? 'open' : 'closed'))
const themeToggleLabel = computed(() => (props.isDarkModeEnabled ? 'Light' : 'Dark'))

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function requestDarkModeToggle() {
  emit('toggle-dark-mode')
}
</script>

<template>
  <header :class="[classes.base.root]">
    <nav :class="[classes.base.bar]">
      <a href="#top" :class="[classes.base.brand]">vue-tailwind-block</a>

      <ul :class="[classes.base.linkList]" :data-state="menuState">
        <li v-for="navigationLink in navigationLinks" :key="navigationLink.href">
          <Button as="a" :href="navigationLink.href" variant="ghost" size="sm">
            {{ navigationLink.label }}
          </Button>
        </li>
      </ul>

      <div :class="[classes.base.actions]">
        <Button variant="outline" size="sm" @click="requestDarkModeToggle">
          {{ themeToggleLabel }}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          :class="[classes.base.menuButton]"
          :aria-expanded="isMenuOpen"
          @click="toggleMenu"
        >
          Menu
        </Button>
      </div>
    </nav>
  </header>
</template>

<tailwind lang="yaml">
base:
  root:
    - sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur
    - supports-[backdrop-filter]:bg-background/60
  bar:
    - mx-auto flex h-14 max-w-5xl items-center gap-4 px-4 md:px-6
  brand:
    - mr-2 text-sm font-semibold tracking-tight
  linkList:
    - absolute inset-x-0 top-14 hidden flex-col gap-1 border-b bg-background p-4
    - data-[state=open]:flex
    - md:static md:flex md:flex-row md:border-0 md:bg-transparent md:p-0
  actions:
    - ml-auto flex items-center gap-2
  menuButton:
    - md:hidden
</tailwind>
