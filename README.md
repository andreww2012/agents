# AI guidelines [![npm](https://img.shields.io/npm/v/@andreww2012/ai-guidelines)](https://npmx.dev/@andreww2012/ai-guidelines)

Generic [guidelines](./.agents/guidelines.md) for AI coding agents: communication, code, workflow and tooling.

## Usage

There are two ways to use the guidelines in your project:

- **Copy the file** into your project and link it from `AGENTS.md`.
  You can change your copy as you like.
- **Link the file on GitHub** from `AGENTS.md`.
  The agent downloads the file itself, so it needs network access.
  The link has the package version, so its content stays the same.

### With the CLI

Run this in the root of your project (Node.js 24 or later is required):

```sh
pnpm dlx @andreww2012/ai-guidelines setup
```

With other package managers, use `npx`, `yarn dlx` or `bunx` instead of `pnpm dlx`. <!-- cspell:disable-line -->

It asks how to link the guidelines and where to save them, then adds the instructions to the beginning of `AGENTS.md` (or creates it).
If `AGENTS.md` already exists, it asks before changing it.

To update your copy to the latest version:

```sh
pnpm dlx @andreww2012/ai-guidelines update guidelines
```

If the file has uncommitted changes, it asks before overwriting them.
Pass `--path` if you saved the file outside of `.agents`.
Run the CLI with `--help` to see all commands and flags.

### In code

The package can do the same as the CLI, but it doesn't ask questions:

```ts
import {setupGuidelines, updateDocument} from '@andreww2012/ai-guidelines';

// Copies the guidelines into `.agents` and links them from `AGENTS.md`
await setupGuidelines();
// Links the file on GitHub instead
await setupGuidelines({link: 'remote'});
// Resolves to `false` if the copy is already up to date
await updateDocument('guidelines');
```

Unlike the CLI, `setupGuidelines` changes an existing `AGENTS.md` without asking, and `updateDocument` overwrites uncommitted changes.
Both take the `cwd` option, which is the current directory by default.

To build your own setup, use `getInstruction` (the text for `AGENTS.md`), `readDocument`, `getDocumentUrl` and other helpers.
`documentsCommitHash` is the hash of the last commit that changed the documents in this version of the package.

### Without the CLI

Replace `VERSION` below with the package version you want to use (for example, the latest one on npm).

#### Copy the file

1. Copy [`.agents/guidelines.md`](./.agents/guidelines.md) into your project, for example into the `.agents` directory.
2. Give credit by adding the source link right below the heading:

   ```md
   Source: <https://github.com/andreww2012/ai-guidelines/blob/@andreww2012/ai-guidelines@VERSION/.agents/guidelines.md>
   ```

3. Link the file from `AGENTS.md`:

   ```md
   Before your first response, you MUST read [the project guidelines](./.agents/guidelines.md) in full.
   Follow them in everything you do, even when you are only answering a question.
   ```

To get updates, compare your copy with the newer version and update the version in the source link.

#### Link to the file

Link the raw version of the file from `AGENTS.md`:

```md
Before your first response, you MUST read [the project guidelines](https://raw.githubusercontent.com/andreww2012/ai-guidelines/@andreww2012/ai-guidelines@VERSION/.agents/guidelines.md) in full.
Follow them in everything you do, even when you are only answering a question.
```

To get updates, change the version.

## Development

- `nr build` builds the CLI and the library into `dist`, `node dist/cli.mjs` runs the CLI
- `nr t` runs the tests
- `nr test` runs all checks and the tests
- `nr ch` adds a [changeset](https://github.com/changesets/changesets) for the next release

Links to the documents use the git tag that changesets creates on publish, like `@andreww2012/ai-guidelines@1.0.0`.
The hash of the last commit that changed `.agents` is saved at build time.
CI publishes the package to npm when a release pull request created by changesets is merged.
