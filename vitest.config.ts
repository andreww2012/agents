import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    // ESLint forbids importing them
    globals: true,
    // Set at build time in production
    env: {DOCUMENTS_COMMIT_HASH: 'test-commit-hash'},
  },
});
