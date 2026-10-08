export default defineNuxtConfig({
  modules: ['vue-tailwind-block/nuxt'],
  css: ['~/assets/css/main.css'],
  site: {
    name: 'vue-tailwind-block',
  },
  mdc: {
    highlight: {
      noApiRoute: false,
    },
  },
})
