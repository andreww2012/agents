import {eslintConfig} from 'eslint-config-un';

export default eslintConfig({
  defaultConfigsStatus: 'misc-enabled',
  configs: {
    fileProgress: true,
    markdown: {
      configSentencesPerLine: true,
    },

    // False positives:
    zod: false,
  },
});
