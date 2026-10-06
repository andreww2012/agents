import {existsSync} from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import {getDocumentPath, getInstruction, readDocument} from './documents.ts';

export const AGENTS_FILE = 'AGENTS.md';

const toRelativeLink = (directory: string, filePath: string) => {
  const relativePath = path.relative(directory, filePath).replaceAll(path.sep, '/');
  return relativePath.startsWith('../') ? relativePath : `./${relativePath}`;
};

const readFileIfExists = async (filePath: string) =>
  existsSync(filePath) ? await fs.readFile(filePath, 'utf8') : undefined;

/**
 * Adds the instruction that links the guidelines to the beginning of `AGENTS.md`, or creates the file.
 * With the local link, also copies the guidelines into the project, and fails if the copy already exists
 */
export const setupGuidelines = async ({
  link = 'local',
  path: guidelinesPath = getDocumentPath('guidelines'),
  cwd = process.cwd(),
}: {
  /** `local` copies the guidelines into the project, `remote` links the file on GitHub */
  link?: 'local' | 'remote';
  /** Where to copy the guidelines, relative to `cwd`. Only used with the local link */
  path?: string;
  cwd?: string;
} = {}) => {
  const absoluteGuidelinesPath = path.resolve(cwd, guidelinesPath);
  if (link === 'local') {
    await fs.mkdir(path.dirname(absoluteGuidelinesPath), {recursive: true});
    await fs.writeFile(absoluteGuidelinesPath, await readDocument('guidelines'), {flag: 'wx'});
  }

  const instruction = getInstruction(
    link === 'local' ? toRelativeLink(cwd, absoluteGuidelinesPath) : undefined,
  );
  const agentsFilePath = path.join(cwd, AGENTS_FILE);
  const agentsFileContent = await readFileIfExists(agentsFilePath);
  await fs.writeFile(
    agentsFilePath,
    agentsFileContent == null ? instruction : `${instruction}\n${agentsFileContent}`,
  );
};
