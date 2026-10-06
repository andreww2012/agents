import path from 'node:path';
import {toForwardSlashes} from '@andreww2012/unutils';
import {exec} from '@andreww2012/unutils/server';

export {arrayIncludes, maybeCall} from '@andreww2012/unutils';
export {exec, readFileSafe} from '@andreww2012/unutils/server';

/** Relative link to the file that always starts with `./` or `../` */
export const toRelativeLink = (directory: string, filePath: string) => {
  const relativePath = toForwardSlashes(path.relative(directory, filePath));
  return relativePath.startsWith('../') ? relativePath : `./${relativePath}`;
};

export const hasUncommittedChanges = async (filePath: string) => {
  try {
    const {stdout} = await exec('git', ['status', '--porcelain', '--', filePath]);
    return stdout.trim().length > 0;
  } catch {
    // Not a git repository, or git is not installed
    return false;
  }
};
