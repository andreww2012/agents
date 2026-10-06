import {existsSync} from 'node:fs';
import * as prompts from '@clack/prompts';
import {getDocumentPath} from '../documents.ts';
import {AGENTS_FILE, setupGuidelines} from '../setup.ts';
import {AbortError, confirmProjectRoot, handleCancel} from './utils.ts';

const DEFAULT_GUIDELINES_PATH = getDocumentPath('guidelines');

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

  const link = handleCancel(
    await prompts.select<'local' | 'remote'>({
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
    link === 'local'
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

  // The files could have been created while the user was answering
  if (!hadAgentsFile && existsSync(AGENTS_FILE)) {
    await confirmPrepending();
  }
  if (guidelinesPath && existsSync(guidelinesPath)) {
    throw new AbortError(`${guidelinesPath} already exists`);
  }

  await setupGuidelines({link, path: guidelinesPath});

  prompts.outro(
    guidelinesPath ? `Saved ${guidelinesPath} and linked it from ${AGENTS_FILE}` : 'Done',
  );
};
