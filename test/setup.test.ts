import {existsSync} from 'node:fs';
import fs from 'node:fs/promises';
import {getInstruction, readDocument} from '../src/documents.ts';
import {setup} from '../src/setup.ts';
import {enterTemporaryDirectory, leaveTemporaryDirectory, runWithAnswers} from './helpers.ts';

// eslint-disable-next-line vitest/prefer-import-in-mock -- the mock doesn't follow the module types
vi.mock('@clack/prompts', async () => (await import('./helpers.ts')).promptsMock);

const EXISTING_AGENTS_FILE_CONTENT = '# Project\n';

const readFile = (filePath: string) => fs.readFile(filePath, 'utf8');

describe('setup', () => {
  beforeEach(async () => {
    await enterTemporaryDirectory();
    await fs.mkdir('.git');
  });

  afterEach(leaveTemporaryDirectory);

  it('asks to confirm when run outside of the project root', async () => {
    await fs.rm('.git', {recursive: true});

    await runWithAnswers(setup, [
      ['not the project root', true],
      ['link the guidelines', 'remote'],
    ]);

    expect(existsSync('AGENTS.md')).toBe(true);
  });

  it('aborts outside of the project root if the user does not confirm', async () => {
    await fs.rm('.git', {recursive: true});

    await expect(runWithAnswers(setup, [['not the project root', false]])).rejects.toThrow(
      'Aborted',
    );

    expect(existsSync('AGENTS.md')).toBe(false);
  });

  it('copies the guidelines and links them from a new AGENTS.md', async () => {
    await runWithAnswers(setup, [
      ['link the guidelines', 'local'],
      ['Where to save', '.agents/guidelines.md'],
    ]);

    await expect(readFile('AGENTS.md')).resolves.toBe(getInstruction('./.agents/guidelines.md'));

    const guidelines = await readFile('.agents/guidelines.md');

    expect(guidelines).toBe(await readDocument('guidelines'));
    expect(guidelines.split('\n').slice(0, 4)).toStrictEqual([
      '# Guidelines',
      '',
      'Source: <https://github.com/andreww2012/ai-guidelines/blob/main/.agents/guidelines.md>',
      '',
    ]);
  });

  it('copies the guidelines to a custom path', async () => {
    await runWithAnswers(setup, [
      ['link the guidelines', 'local'],
      ['Where to save', 'docs/ai.md'],
    ]);

    await expect(readFile('AGENTS.md')).resolves.toBe(getInstruction('./docs/ai.md'));
    await expect(readFile('docs/ai.md')).resolves.toBe(await readDocument('guidelines'));
  });

  it('links the remote guidelines', async () => {
    await runWithAnswers(setup, [['link the guidelines', 'remote']]);

    await expect(readFile('AGENTS.md')).resolves.toBe(
      getInstruction(
        'https://raw.githubusercontent.com/andreww2012/ai-guidelines/main/.agents/guidelines.md',
      ),
    );
    expect(existsSync('.agents')).toBe(false);
  });

  it('adds the instructions to the beginning of the existing AGENTS.md', async () => {
    await fs.writeFile('AGENTS.md', EXISTING_AGENTS_FILE_CONTENT);

    await runWithAnswers(setup, [
      ['link the guidelines', 'local'],
      ['AGENTS.md already exists', true],
      ['Where to save', '.agents/guidelines.md'],
    ]);

    await expect(readFile('AGENTS.md')).resolves.toBe(
      `${getInstruction('./.agents/guidelines.md')}\n${EXISTING_AGENTS_FILE_CONTENT}`,
    );
    expect(existsSync('.agents/guidelines.md')).toBe(true);
  });

  it('aborts if the user does not want to change the existing AGENTS.md', async () => {
    await fs.writeFile('AGENTS.md', EXISTING_AGENTS_FILE_CONTENT);

    await expect(
      runWithAnswers(setup, [
        ['link the guidelines', 'local'],
        ['AGENTS.md already exists', false],
      ]),
    ).rejects.toThrow('Aborted');

    await expect(readFile('AGENTS.md')).resolves.toBe(EXISTING_AGENTS_FILE_CONTENT);
    expect(existsSync('.agents')).toBe(false);
  });

  it('asks about AGENTS.md again if it was created during the setup', async () => {
    await runWithAnswers(setup, [
      ['link the guidelines', 'local'],
      [
        'Where to save',
        async () => {
          await fs.writeFile('AGENTS.md', EXISTING_AGENTS_FILE_CONTENT);
          return '.agents/guidelines.md';
        },
      ],
      ['AGENTS.md already exists', true],
    ]);

    await expect(readFile('AGENTS.md')).resolves.toBe(
      `${getInstruction('./.agents/guidelines.md')}\n${EXISTING_AGENTS_FILE_CONTENT}`,
    );
  });

  it('aborts if AGENTS.md was created during the setup and the user does not want to change it', async () => {
    await expect(
      runWithAnswers(setup, [
        ['link the guidelines', 'local'],
        [
          'Where to save',
          async () => {
            await fs.writeFile('AGENTS.md', EXISTING_AGENTS_FILE_CONTENT);
            return '.agents/guidelines.md';
          },
        ],
        ['AGENTS.md already exists', false],
      ]),
    ).rejects.toThrow('Aborted');

    await expect(readFile('AGENTS.md')).resolves.toBe(EXISTING_AGENTS_FILE_CONTENT);
    expect(existsSync('.agents')).toBe(false);
  });

  it('does not accept a path to an existing file', async () => {
    await fs.mkdir('.agents');
    await fs.writeFile('.agents/guidelines.md', 'My guidelines');

    await expect(
      runWithAnswers(setup, [
        ['link the guidelines', 'local'],
        ['Where to save', '.agents/guidelines.md'],
      ]),
    ).rejects.toThrow('The file already exists');
  });

  it('aborts if the guidelines file was created during the setup', async () => {
    await expect(
      runWithAnswers(setup, [
        ['link the guidelines', 'local'],
        [
          'Where to save',
          async () => {
            await fs.writeFile('AGENTS.md', EXISTING_AGENTS_FILE_CONTENT);
            return 'guidelines.md';
          },
        ],
        [
          'AGENTS.md already exists',
          async () => {
            await fs.writeFile('guidelines.md', 'My guidelines');
            return true;
          },
        ],
      ]),
    ).rejects.toThrow('guidelines.md already exists');

    await expect(readFile('guidelines.md')).resolves.toBe('My guidelines');
    await expect(readFile('AGENTS.md')).resolves.toBe(EXISTING_AGENTS_FILE_CONTENT);
  });
});
