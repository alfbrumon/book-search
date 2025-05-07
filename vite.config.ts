import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/book-search/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    testTimeout: 10000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'src/main.tsx',
        'src/types/**',
        'node_modules/**',
        'dist/**',
        'eslint.config.js',
        'vite.config.ts',
        'src/vite-env.d.ts'
      ],
    },
  }
})
