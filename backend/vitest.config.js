import { defineConfig } from 'vitest/config'
import { UniversalReporter, writeHtmlReport } from 'universal-backend-testing-framework'

const universalReporter = new UniversalReporter({
  report: (results, reportOptions) => writeHtmlReport(results, reportOptions),
})

export default defineConfig({
  test: {
    reporters: ['default', universalReporter],
  },
})
