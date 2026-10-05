import type {KnipConfig} from 'knip';

export default {
  entry: ['.ncurc.js'], // cspell:disable-line
  ignoreDependencies: [
    // Not used yet, but handy for scripts
    'cross-env',
  ],
  tags: ['-knipignore'],
  treatConfigHintsAsErrors: true,
} satisfies KnipConfig;
