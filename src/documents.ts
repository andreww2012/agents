import fs from 'node:fs/promises';
import path from 'node:path';
import packageJson from '../package.json' with {type: 'json'};

const GIT_EXTENSION_REGEX = /\.git$/;

const HEADING_REGEX = /^# .+/;

// Like `andreww2012/ai-guidelines`
const repository = new URL(packageJson.repository.url).pathname
  .slice(1)
  .replace(GIT_EXTENSION_REGEX, '');

// Set at build time, so that links point to the same content as the published files
const commitHash = process.env.DOCUMENTS_COMMIT_HASH || 'main';

export const DOCUMENTS = ['guidelines'] as const;

export type DocumentName = (typeof DOCUMENTS)[number];

export const getDocumentPath = (document: DocumentName) => `.agents/${document}.md`;

const getDocumentUrl = (document: DocumentName, {raw = false} = {}) =>
  raw
    ? `https://raw.githubusercontent.com/${repository}/${commitHash}/${getDocumentPath(document)}`
    : `https://github.com/${repository}/blob/${commitHash}/${getDocumentPath(document)}`;

/** Text for `AGENTS.md` that links the guidelines, by default the published version on GitHub */
export const getInstruction = (link = getDocumentUrl('guidelines', {raw: true})) =>
  `Before your first response, you MUST read [the project guidelines](${link}) in full.
Follow them in everything you do, even when you are only answering a question.
`;

/** Reads the document shipped with the package and adds the source link below its heading */
export const readDocument = async (document: DocumentName) => {
  const content = await fs.readFile(
    path.join(import.meta.dirname, '..', getDocumentPath(document)),
    'utf8',
  );
  return content.replace(
    HEADING_REGEX,
    (heading) => `${heading}\n\nSource: <${getDocumentUrl(document)}>`,
  );
};
