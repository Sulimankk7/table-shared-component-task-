import { defineConfig } from 'vitest/config'
import { UniversalReporter, writeHtmlReport } from 'universal-backend-testing-framework'

const universalReporter = new UniversalReporter({
  projectName: 'Shared Table Backend',
  report: (results, reportOptions) => writeHtmlReport(results, {
    ...reportOptions,
    outputPath: process.env.UBTF_HTML_REPORT_PATH || 'reports/test-report.html',
  }),
})

export default defineConfig({
  test: {
    reporters: ['default', universalReporter],
  },
})
