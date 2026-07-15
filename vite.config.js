import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Code-splitting (DT-007): vendors pesados en chunks propios y cacheables
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'sentry', test: /node_modules[\\/]@sentry/ },
            { name: 'motion', test: /node_modules[\\/]framer-motion/ },
            { name: 'react-vendor', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
          ],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    exclude: [...configDefaults.exclude, 'e2e/**'],
    coverage: {
      provider: 'v8',
      thresholds: {
        // Core business logic: 100%
        './src/domain/**': { lines: 100, functions: 100, branches: 100, statements: 100 },
        // Application layer: 100%
        './src/application/**': { lines: 100, functions: 100, branches: 100, statements: 100 },
        // UI components: 80%
        './src/ui/**': { lines: 80, functions: 80, branches: 80, statements: 80 },
        // Infrastructure: no threshold (auto-validable)
      },
    },
  },
})
