import fs from 'node:fs/promises';
import path from 'node:path';
import {getInstruction} from '../src/index.ts';

const LEADING_SPACES_REGEX = /^ +/gm;

const readProjectFile = (fileName: string) =>
  fs.readFile(path.join(import.meta.dirname, '..', fileName), 'utf8');

describe('getInstruction', () => {
  it('matches the instruction in AGENTS.md', async () => {
    await expect(readProjectFile('AGENTS.md')).resolves.toContain(
      getInstruction('./.agents/guidelines.md').trimEnd(),
    );
  });

  it('matches the examples in README.md', async () => {
    // Some examples are indented inside list items
    const readme = (await readProjectFile('README.md')).replaceAll(LEADING_SPACES_REGEX, '');

    expect(readme).toContain(getInstruction('./.agents/guidelines.md'));
    expect(readme).toContain(
      getInstruction(
        'https://raw.githubusercontent.com/andreww2012/ai-guidelines/@andreww2012/ai-guidelines@VERSION/.agents/guidelines.md',
      ),
    );
  });
});
