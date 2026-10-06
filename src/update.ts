import fs from 'node:fs/promises';
import path from 'node:path';
import {type DocumentName, getDocumentPath, readDocument} from './documents.ts';

/** Resolves to the content to update the copy of the document with, or `undefined` if it's up to date */
export const getNewContent = async (document: DocumentName, filePath: string) => {
  const [currentContent, newContent] = await Promise.all([
    fs.readFile(filePath, 'utf8'),
    readDocument(document),
  ]);
  return currentContent.trim() === newContent.trim() ? undefined : newContent;
};

/**
 * Updates the copy of the document in the project to the version from this package.
 * Resolves to `false` if the copy is already up to date
 */
// eslint-disable-next-line unicorn/consistent-boolean-name -- it's an action, the result only tells if it changed anything
export const updateDocument = async (
  document: DocumentName,
  {
    path: filePath = getDocumentPath(document),
    cwd = process.cwd(),
  }: {
    /** Path to the copy, relative to `cwd` */
    path?: string;
    cwd?: string;
  } = {},
) => {
  const absolutePath = path.resolve(cwd, filePath);
  const newContent = await getNewContent(document, absolutePath);
  if (newContent == null) {
    return false;
  }

  await fs.writeFile(absolutePath, newContent);
  return true;
};
