import type {KnipConfig} from 'knip';

export default {
  entry: ['.ncurc.cjs'], // cspell:disable-line
  tags: ['-knipignore'],
  treatConfigHintsAsErrors: true,
} satisfies KnipConfig;
