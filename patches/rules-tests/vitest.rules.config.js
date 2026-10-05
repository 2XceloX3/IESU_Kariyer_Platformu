import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['patches/rules-tests/**/*.test.mjs'],
    fileParallelism: false,
    testTimeout: 60000,
  },
});
