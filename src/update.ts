import {execFileSync} from 'node:child_process';
import fs from 'node:fs/promises';
import * as prompts from '@clack/prompts';
import {DOCUMENTS, type DocumentName, getDocumentPath, readDocument} from './documents.ts';
import {AbortError, confirmProjectRoot, handleCancel, readFileIfExists} from './utils.ts';

const isDocumentName = (value: string): value is DocumentName =>
  DOCUMENTS.some((document) => document === value);

const hasUncommittedChanges = (filePath: string) => {
  try {
    // eslint-disable-next-line sonar/no-os-command-from-path -- git of the user is expected here
    const status = execFileSync('git', ['status', '--porcelain', '--', filePath], {
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return status.trim() !== '';
  } catch {
    // Not a git repository, or git is not installed
    return false;
  }
};

const updateDocument = async (
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

  const [currentContent, newContent] = await Promise.all([
    readFileIfExists(filePath),
    readDocument(document),
  ]);
  if (currentContent == null) {
    throw new AbortError(`${filePath} doesn't exist`);
  }

  if (currentContent.trim() === newContent.trim()) {
    prompts.outro(`${filePath} is already up to date, nothing was updated`);
    return;
  }

  const shouldOverwrite =
    !hasUncommittedChanges(filePath) ||
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
    await updateDocument(undefined, customPath);
  }
};

export const update = async (document: string | undefined, customPath: string | undefined) => {
  prompts.intro('Update a document');

  if (document != null && !isDocumentName(document)) {
    throw new AbortError(
      `Unknown document: ${document}. Available documents: ${DOCUMENTS.join(', ')}`,
    );
  }

  await confirmProjectRoot();
  await updateDocument(document, customPath);
};
