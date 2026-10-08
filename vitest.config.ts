import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const alias = { '~': fileURLToPath(new URL('./src', import.meta.url)) }

export default defineConfig({
  test: {
    projects: [
      {
        resolve: { alias },
        test: {
          name: 'unit',
          include: ['test/unit/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        resolve: { alias },
        test: {
          // runs real ESLint and vue-tsc, the latter against dist, so build first
          name: 'integration',
          include: ['test/integration/**/*.test.ts'],
          environment: 'node',
          testTimeout: 120_000,
        },
      },
    ],
  },
})
