import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import tailwindBlock from 'vue-tailwind-block/vite'

export default defineConfig({
  // tailwindBlock must run before vue() so the block is compiled before Vue sees the file
  plugins: [tailwindBlock({ variableName: 'classes' }), vue(), tailwindcss()],
})
