import {execFileSync} from 'node:child_process';
import fs from 'node:fs/promises';
import * as prompts from '@clack/prompts';
import {readDocument} from '../src/documents.ts';
import {update} from '../src/update.ts';
import {enterTemporaryDirectory, leaveTemporaryDirectory, runWithAnswers} from './helpers.ts';

// eslint-disable-next-line vitest/prefer-import-in-mock -- the mock doesn't follow the module types
vi.mock('@clack/prompts', async () => (await import('./helpers.ts')).promptsMock);

const GUIDELINES_PATH = '.agents/guidelines.md';

const OUTDATED_GUIDELINES = '# Guidelines\n\nOld guidelines\n';

const CHANGED_GUIDELINES = '# Guidelines\n\nMy guidelines\n';

// eslint-disable-next-line sonar/no-os-command-from-path -- git of the user is expected here
const git = (...parameters: string[]) => execFileSync('git', parameters, {stdio: 'ignore'});

const readFile = (filePath: string) => fs.readFile(filePath, 'utf8');

const updateGuidelines = () => update('guidelines', undefined);

describe('update', () => {
  beforeEach(async () => {
    await enterTemporaryDirectory();
    await fs.mkdir('.agents');
    await fs.writeFile(GUIDELINES_PATH, OUTDATED_GUIDELINES);
    git('init');
    git('add', '.');
    git(
      '-c',
      'user.name=Test',
      '-c',
      'user.email=test@example.com',
      '-c',
      'commit.gpgsign=false', // cspell:disable-line
      'commit',
      '--message=Initial commit',
    );
  });

  afterEach(leaveTemporaryDirectory);

  it('updates the document', async () => {
    await runWithAnswers(updateGuidelines, []);

    await expect(readFile(GUIDELINES_PATH)).resolves.toBe(await readDocument('guidelines'));
  });

  it('asks for the document if it is not passed', async () => {
    await runWithAnswers(() => update(undefined, undefined), [['Which document', 'guidelines']]);

    await expect(readFile(GUIDELINES_PATH)).resolves.toBe(await readDocument('guidelines'));
  });

  it('does nothing if the document is up to date, ignoring surrounding whitespace', async () => {
    const content = `\n${await readDocument('guidelines')}\n\n`;
    await fs.writeFile(GUIDELINES_PATH, content);

    await runWithAnswers(updateGuidelines, []);

    await expect(readFile(GUIDELINES_PATH)).resolves.toBe(content);
    expect(prompts.outro).toHaveBeenLastCalledWith(
      `${GUIDELINES_PATH} is already up to date, nothing was updated`,
    );
  });

  it('overwrites uncommitted changes if the user agrees', async () => {
    await fs.writeFile(GUIDELINES_PATH, CHANGED_GUIDELINES);

    await runWithAnswers(updateGuidelines, [['uncommitted changes', true]]);

    await expect(readFile(GUIDELINES_PATH)).resolves.toBe(await readDocument('guidelines'));
  });

  it('aborts if the user keeps uncommitted changes of the passed document', async () => {
    await fs.writeFile(GUIDELINES_PATH, CHANGED_GUIDELINES);

    await expect(
      runWithAnswers(updateGuidelines, [['uncommitted changes', false]]),
    ).rejects.toThrow('Aborted');

    await expect(readFile(GUIDELINES_PATH)).resolves.toBe(CHANGED_GUIDELINES);
  });

  it('asks for the document again if the user keeps uncommitted changes of the chosen one', async () => {
    await fs.writeFile(GUIDELINES_PATH, CHANGED_GUIDELINES);

    await runWithAnswers(
      () => update(undefined, undefined),
      [
        ['Which document', 'guidelines'],
        ['uncommitted changes', false],
        ['Which document', 'guidelines'],
        ['uncommitted changes', true],
      ],
    );

    await expect(readFile(GUIDELINES_PATH)).resolves.toBe(await readDocument('guidelines'));
  });

  it('updates the document at a custom path, treating untracked files as changed', async () => {
    await fs.writeFile('guidelines.md', OUTDATED_GUIDELINES);

    await runWithAnswers(
      () => update('guidelines', 'guidelines.md'),
      [['uncommitted changes', true]],
    );

    await expect(readFile('guidelines.md')).resolves.toBe(await readDocument('guidelines'));
    await expect(readFile(GUIDELINES_PATH)).resolves.toBe(OUTDATED_GUIDELINES);
  });

  it('does not check for uncommitted changes outside of a git repository', async () => {
    await fs.rm('.git', {recursive: true});
    await fs.writeFile(GUIDELINES_PATH, CHANGED_GUIDELINES);

    await runWithAnswers(updateGuidelines, [['not the project root', true]]);

    await expect(readFile(GUIDELINES_PATH)).resolves.toBe(await readDocument('guidelines'));
  });

  it('aborts if the document does not exist', async () => {
    await fs.rm(GUIDELINES_PATH);

    await expect(runWithAnswers(updateGuidelines, [])).rejects.toThrow(
      `${GUIDELINES_PATH} doesn't exist`,
    );
  });

  it('aborts on an unknown document', async () => {
    await expect(runWithAnswers(() => update('unknown', undefined), [])).rejects.toThrow(
      'Unknown document: unknown',
    );
  });
});
