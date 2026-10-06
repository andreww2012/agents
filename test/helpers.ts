import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {maybeCall} from '../src/utils.ts';

type AnswerValue = string | boolean;

/** Part of the expected prompt message and the answer, or a function to run while the prompt is shown */
type Answer = [message: string, answer: AnswerValue | (() => Promise<AnswerValue>)];

const pendingAnswers: Answer[] = [];

const initialDirectory = process.cwd();

const ask = async ({
  message,
  validate,
}: {
  message: string;
  validate?: (value: string) => string | Error | undefined;
}) => {
  const [expectedMessage, answerOrGetAnswer] = pendingAnswers.shift() || [];
  if (expectedMessage == null) {
    throw new Error(`Unexpected prompt: ${message}`);
  }
  expect(message).toContain(expectedMessage);

  const answer = await maybeCall(answerOrGetAnswer);
  const validationError = typeof answer === 'string' && validate?.(answer);
  if (validationError) {
    throw new Error(`Invalid answer: ${String(validationError)}`);
  }

  return answer;
};

export const promptsMock = {
  intro: vi.fn(),
  outro: vi.fn(),
  cancel: vi.fn(),
  isCancel: () => false,
  select: ask,
  confirm: ask,
  text: ask,
};

export const runWithAnswers = async (command: () => Promise<void>, answers: Answer[]) => {
  pendingAnswers.splice(0, pendingAnswers.length, ...answers);
  await command();
  expect(pendingAnswers, 'Some expected prompts were not shown').toStrictEqual([]);
};

export const enterTemporaryDirectory = async () => {
  process.chdir(await fs.mkdtemp(path.join(os.tmpdir(), 'ai-guidelines-')));
};

export const leaveTemporaryDirectory = async () => {
  const temporaryDirectory = process.cwd();
  process.chdir(initialDirectory);
  await fs.rm(temporaryDirectory, {recursive: true, force: true});
};
