import {existsSync} from 'node:fs';
import * as prompts from '@clack/prompts';

export class AbortError extends Error {
  constructor(message = 'Aborted', options?: ErrorOptions) {
    super(message, options);
    this.name = 'AbortError';
  }
}

export const handleCancel = <T>(value: T | typeof prompts.CANCEL_SYMBOL) => {
  if (prompts.isCancel(value)) {
    throw new AbortError();
  }

  return value;
};

export const confirmProjectRoot = async () => {
  if (existsSync('.git')) {
    return;
  }

  const shouldContinue = handleCancel(
    await prompts.confirm({
      message:
        "The current directory has no .git, so it's probably not the project root. Continue anyway?",
      initialValue: false,
    }),
  );
  if (!shouldContinue) {
    throw new AbortError();
  }
};
