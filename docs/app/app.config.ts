export default defineAppConfig({
  ui: {
    colors: {
      primary: 'sky',
      neutral: 'zinc',
    },
  },
  header: {
    title: 'vue-tailwind-block',
  },
  socials: {
    npm: 'https://www.npmjs.com/package/vue-tailwind-block',
  },
  toc: {
    title: 'On this page',
    bottom: {
      title: 'External guides',
      links: [
        { icon: 'i-simple-icons-tailwindcss', label: 'Tailwind CSS', to: 'https://tailwindcss.com/docs', target: '_blank' },
        { icon: 'i-simple-icons-vuedotjs', label: 'Vue SFC spec', to: 'https://vuejs.org/api/sfc-spec.html', target: '_blank' },
      ],
    },
  },
  github: {
    url: 'https://github.com/astraldev/vue-tailwind-block',
    branch: 'main',
    rootDir: 'docs',
  },
})
