import {defineConfig} from 'tsdown';
import {exec} from './src/utils.ts';

const documentsCommitHash = (
  await exec('git', ['log', '-1', '--format=%H', '--', '.agents'])
).stdout.trim();
if (!documentsCommitHash) {
  throw new Error('Could not find the last commit that changed the documents');
}

export default defineConfig({
  entry: ['src/cli.ts', 'src/index.ts'],
  env: {DOCUMENTS_COMMIT_HASH: documentsCommitHash},
  treeshake: {
    // It doesn't declare `"sideEffects": false`, so all its modules would be bundled
    moduleSideEffects: [{test: /\/@andreww2012\/unutils\//, sideEffects: false}],
  },
});
