<script setup lang="ts">
const currentYear = new Date().getFullYear()

const footerLinks = [
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'npm', href: 'https://www.npmjs.com' },
  { label: 'Tailwind CSS', href: 'https://tailwindcss.com' },
]
</script>

<template>
  <footer :class="[classes.base.root]">
    <div :class="[classes.base.inner]">
      <p :class="[classes.base.copyright]">&copy; {{ currentYear }} vue-tailwind-block</p>

      <ul :class="[classes.base.linkList]">
        <li v-for="footerLink in footerLinks" :key="footerLink.href">
          <a :href="footerLink.href" :class="[classes.base.link]">{{ footerLink.label }}</a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<tailwind lang="yaml">
base:
  root:
    - border-t py-8
  inner:
    - mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6
  copyright:
    - text-sm text-muted-foreground
  linkList:
    - flex gap-4
  link:
    - text-sm text-muted-foreground transition-colors hover:text-foreground
</tailwind>
