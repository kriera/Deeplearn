import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    exclude: ['e2e/**'],
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
