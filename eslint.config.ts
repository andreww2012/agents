import {eslintConfig} from 'eslint-config-un';
import {
  GLOB_JS_TS_X_EXTENSION,
  GLOB_MARKDOWN,
  GLOB_YML_YAML_EXTENSION,
} from 'eslint-config-un/globs';
import oxfmtConfig from './oxfmt.config.js';

export default eslintConfig({
  ignores: ['CHANGELOG.md'],
  mode: 'lib',
  // typeInfoRules: {
  //   allowDefaultProject: ['*.config.*ts'],
  // },
  defaultConfigsStatus: 'misc-enabled',
  configs: {
    fileProgress: true,
    format: {
      files: [
        // TODO replace with `GLOB_MARKDOWN_SUPPORTED_CODE_BLOCKS` from eslint-config-un
        // once it's exported
        `${GLOB_MARKDOWN}/**/*.{${GLOB_JS_TS_X_EXTENSION},json,jsonc,json5,${GLOB_YML_YAML_EXTENSION}}`,
      ],
      formatter: [
        'oxfmt',
        {
          bracketSpacing: oxfmtConfig.bracketSpacing,
          printWidth: oxfmtConfig.printWidth,
          singleQuote: oxfmtConfig.singleQuote,
        },
      ],
    },
    markdown: {
      configSentencesPerLine: {
        // Putting every sentence on its own line causes line wraps in the changelog
        ignores: ['.changeset/**/*.md'],
      },
    },

    // False positives:
    zod: false,
  },
  extraConfigs: [],
});
