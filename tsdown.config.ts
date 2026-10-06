import {execFileSync} from 'node:child_process';
import {defineConfig} from 'tsdown';

// eslint-disable-next-line sonar/no-os-command-from-path -- git of the user is expected here
const documentsCommitHash = execFileSync('git', ['log', '-1', '--format=%H', '--', '.agents'], {
  encoding: 'utf8',
}).trim();
if (!documentsCommitHash) {
  throw new Error('Could not find the last commit that changed the documents');
}

export default defineConfig({
  entry: 'src/cli.ts',
  env: {DOCUMENTS_COMMIT_HASH: documentsCommitHash},
});
