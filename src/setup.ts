import {existsSync} from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import * as prompts from '@clack/prompts';
import {getDocumentPath, getInstruction, readDocument} from './documents.ts';
import {AbortError, confirmProjectRoot, handleCancel, readFileIfExists} from './utils.ts';

const AGENTS_FILE = 'AGENTS.md';

const DEFAULT_GUIDELINES_PATH = getDocumentPath('guidelines');

const toRelativeLink = (filePath: string) => {
  const relativePath = path.relative(process.cwd(), filePath).replaceAll(path.sep, '/');
  return relativePath.startsWith('../') ? relativePath : `./${relativePath}`;
};

const confirmPrepending = async () => {
  const shouldPrepend = handleCancel(
    await prompts.confirm({
      message: `${AGENTS_FILE} already exists. Add the instructions to its beginning? Otherwise, abort the setup`,
    }),
  );
  if (!shouldPrepend) {
    throw new AbortError();
  }
};

export const setup = async () => {
  prompts.intro('Set up the AI guidelines');
  await confirmProjectRoot();

  const linkType = handleCancel(
    await prompts.select({
      message: `How should ${AGENTS_FILE} link the guidelines?`,
      options: [
        {value: 'local', label: 'Local', hint: 'copy the guidelines into the project'},
        {value: 'remote', label: 'Remote', hint: 'link the file on GitHub'},
      ],
      initialValue: 'local',
    }),
  );

  const hadAgentsFile = existsSync(AGENTS_FILE);
  if (hadAgentsFile) {
    await confirmPrepending();
  }

  const guidelinesPath =
    linkType === 'local'
      ? handleCancel(
          await prompts.text({
            message: 'Where to save the guidelines?',
            placeholder: DEFAULT_GUIDELINES_PATH,
            defaultValue: DEFAULT_GUIDELINES_PATH,
            validate: (value) =>
              existsSync(value || DEFAULT_GUIDELINES_PATH)
                ? 'The file already exists. To update it, use the `update` command'
                : undefined,
          }),
        )
      : undefined;

  const agentsFileContent = await readFileIfExists(AGENTS_FILE);
  if (agentsFileContent != null && !hadAgentsFile) {
    await confirmPrepending();
  }

  if (guidelinesPath) {
    await fs.mkdir(path.dirname(guidelinesPath), {recursive: true});
    await fs
      .writeFile(guidelinesPath, await readDocument('guidelines'), {flag: 'wx'})
      .catch((error: unknown) => {
        throw error instanceof Error && 'code' in error && error.code === 'EEXIST'
          ? new AbortError(`${guidelinesPath} already exists`)
          : error;
      });
  }

  const instruction = getInstruction(guidelinesPath ? toRelativeLink(guidelinesPath) : undefined);
  await fs.writeFile(
    AGENTS_FILE,
    agentsFileContent == null ? instruction : `${instruction}\n${agentsFileContent}`,
  );

  prompts.outro(
    guidelinesPath ? `Saved ${guidelinesPath} and linked it from ${AGENTS_FILE}` : 'Done',
  );
};
