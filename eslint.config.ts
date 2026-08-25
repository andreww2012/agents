import {eslintConfig} from 'eslint-config-un';

export default eslintConfig({
  defaultConfigsStatus: 'misc-enabled',
  configs: {
    markdown: {
      configSentencesPerLine: true,
    },

    // False positives:
    zod: false,
  },
});
