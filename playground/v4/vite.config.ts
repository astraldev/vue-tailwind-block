import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import tailwindBlock from 'vue-tailwind-block/vite'

export default defineConfig({
  plugins: [tailwindBlock(), vue(), tailwindcss()],
})
