import {eslintConfig} from 'eslint-config-un';

export default eslintConfig({
  defaultConfigsStatus: 'misc-enabled',
  configs: {
    markdown: {
      configSentencesPerLine: true,
    },
    unicorn: {
      ignores: [
        '**/*.json', // Fixes "The following rules do not support the language "jsonc/x""
      ],
    },

    // False positives:
    zod: false,
  },
  extraConfigs: [
    // Fixes "The following rules do not support the language "jsonc/x""
    {
      files: ['**/*.json'],
      rules: {
        'unicorn/no-process-exit': 0,
        'unicorn/prefer-import-meta-properties': 0,
      },
    },
  ],
});
