import type {CSpellSettings} from 'cspell';

const GLOBALLY_IGNORED_WORDS: Record<string, string[]> = {
  names: ['andreww', 'cleye', 'unutils', 'verkit', 'worktrees'],
  misc: ['knipignore'],
  englishIshWords: [],
};

export default {
  useGitignore: true,
  enableGlobDot: true,
  ignorePaths: ['**/.gitignore', '**/.git/**', '**/pnpm-lock.yaml', 'patches/**'],
  dictionaries: ['npm', 'node', 'typescript', 'fullstack'],
  words: Object.values(GLOBALLY_IGNORED_WORDS).flat(),
  overrides: [
    {
      filename: ['.agents/guidelines.md', 'cspell.config.ts'],
      words: ['behaviour', 'organisation', 'nstall', 'lockfiles', 'coeff'],
    },
  ],
} satisfies CSpellSettings;
