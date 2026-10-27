## Unit Testing

### Overview

The shared `DataTable` component is tested using **Vitest**, **Vue Test Utils**, and **jsdom**.

The tests verify the component's rendering, search and filtering behavior, sorting logic, empty states, and actions slot functionality.

### Testing Tools

- **Vitest** — test runner and assertion framework.
- **Vue Test Utils** — mounts Vue components and simulates user interactions.
- **jsdom** — provides a DOM environment for component tests.
- **@vitest/coverage-v8** — collects code coverage using V8.

### Running Tests

Run tests in watch mode:

```bash
npm run test
```

Run tests once:

```bash
npm run test -- --run
```

Run tests once and generate a coverage report:

```bash
npm run test -- --run --coverage
```

### Test Coverage

The current test suite contains **20 tests** covering:

- **Rendering:** verifies table columns and provided data.
- **Search and filtering:** tests text search, selected-column filtering, case-insensitive matching, whitespace trimming, and null or undefined values.
- **Sorting:** tests ascending and descending order, numeric values, empty values, and resetting sorting.
- **Actions slot:** verifies conditional rendering and the correct `colspan` with and without the actions slot.

The latest coverage report shows:

| Metric | Coverage |
|---|---:|
| Statements | 100% |
| Branches | 100% |
| Functions | 100% |
| Lines | 100% |

### Coverage Report

The HTML coverage report is generated in the `coverage` directory.

Open `coverage/index.html` in a browser to inspect coverage details for individual files.

### Notes

- Tests should remain independent and focus on observable component behavior.
- Coverage percentages indicate which code paths were executed; they do not guarantee the absence of defects.
- Generated coverage output should generally not be committed to version control.
