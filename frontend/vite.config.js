
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { UniversalReporter, writeHtmlReport } from 'universal-backend-testing-framework'

const universalReporter = new UniversalReporter({
  projectName: 'Shared Table Frontend',
  report: (results, reportOptions) => writeHtmlReport(results, {
    ...reportOptions,
    outputPath: process.env.UBTF_HTML_REPORT_PATH || 'reports/test-report.html',
  }),
})

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },  
test: {
  environment: 'jsdom',
  include: ['tests/**/*.test.js'],
  clearMocks: true,
  reporters: ['default', universalReporter],

  coverage: {
    reporter: ['text', 'html'],
  },
},
})
