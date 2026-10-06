import fs from 'node:fs/promises';
import path from 'node:path';
import packageJson from '../package.json' with {type: 'json'};

const commitHashFromBuild = process.env.DOCUMENTS_COMMIT_HASH;
if (!commitHashFromBuild) {
  throw new Error('DOCUMENTS_COMMIT_HASH was not set during the build');
}

const GIT_EXTENSION_REGEX = /\.git$/;

const HEADING_REGEX = /^# .+/;

// `<owner>/<repo>`
const repository = new URL(packageJson.repository.url).pathname
  .slice(1)
  .replace(GIT_EXTENSION_REGEX, '');

// Changesets creates it on publish
const tag = `${packageJson.name}@${packageJson.version}`;

/**
 * Hash of the last commit that changed the documents shipped with this version of the package.
 * Unlike a tag, a commit can't be moved, so it's useful for links that must never change
 */
export const documentsCommitHash = commitHashFromBuild;

/** Names of the documents shipped with the package */
export const DOCUMENTS = ['guidelines'] as const;

export type DocumentName = (typeof DOCUMENTS)[number];

/** Default path to the copy of the document in a project */
export const getDocumentPath = (document: DocumentName) => `.agents/${document}.md`;

/** Link to the document on GitHub, at the git tag of this version of the package */
export const getDocumentUrl = (document: DocumentName, {raw = false} = {}) =>
  raw
    ? `https://raw.githubusercontent.com/${repository}/${tag}/${getDocumentPath(document)}`
    : `https://github.com/${repository}/blob/${tag}/${getDocumentPath(document)}`;

/** Text for `AGENTS.md` that links the guidelines, by default the raw file on GitHub */
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
