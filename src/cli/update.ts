import {existsSync} from 'node:fs';
import fs from 'node:fs/promises';
import * as prompts from '@clack/prompts';
import {DOCUMENTS, type DocumentName, getDocumentPath} from '../documents.ts';
import {getNewContent} from '../update.ts';
import {arrayIncludes, hasUncommittedChanges} from '../utils.ts';
import {AbortError, confirmProjectRoot, handleCancel} from './utils.ts';

const updateInteractively = async (
  documentFromArguments: DocumentName | undefined,
  customPath: string | undefined,
) => {
  const document =
    documentFromArguments ||
    handleCancel(
      await prompts.select({
        message: 'Which document to update?',
        options: DOCUMENTS.map((name) => ({
          value: name,
          hint: customPath || getDocumentPath(name),
        })),
      }),
    );
  const filePath = customPath || getDocumentPath(document);

  if (!existsSync(filePath)) {
    throw new AbortError(`${filePath} doesn't exist`);
  }

  const newContent = await getNewContent(document, filePath);
  if (newContent == null) {
    prompts.outro(`${filePath} is already up to date, nothing was updated`);
    return;
  }

  const shouldOverwrite =
    !(await hasUncommittedChanges(filePath)) ||
    handleCancel(
      await prompts.confirm({
        message: `${filePath} has uncommitted changes. Overwrite them?`,
        initialValue: false,
      }),
    );
  if (shouldOverwrite) {
    await fs.writeFile(filePath, newContent);
    prompts.outro(`Updated ${filePath}`);
  } else if (documentFromArguments) {
    throw new AbortError();
  } else {
    await updateInteractively(undefined, customPath);
  }
};

export const update = async (document: string | undefined, customPath: string | undefined) => {
  prompts.intro('Update a document');

  if (document != null && !arrayIncludes(DOCUMENTS, document)) {
    throw new AbortError(
      `Unknown document: ${document}. Available documents: ${DOCUMENTS.join(', ')}`,
    );
  }

  await confirmProjectRoot();
  await updateInteractively(document, customPath);
};
