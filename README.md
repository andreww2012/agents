# AI guidelines [![npm](https://img.shields.io/npm/v/@andreww2012/ai-guidelines)](https://npmx.dev/@andreww2012/ai-guidelines)

Generic [guidelines](./.agents/guidelines.md) for AI coding agents: communication, code, workflow and tooling.

## Usage

There are two ways to use the guidelines in your project:

- **Copy the file** into your project and link it from `AGENTS.md`.
  You can change your copy as you like.
- **Link the file on GitHub** from `AGENTS.md`.
  The agent downloads the file itself, so it needs network access.
  The link has a commit hash, so its content never changes.

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

### Without the CLI

Replace `COMMIT_HASH` below with the hash of the commit you want to use (for example, the latest one on `main`).

#### Copy the file

1. Copy [`.agents/guidelines.md`](./.agents/guidelines.md) into your project, for example into the `.agents` directory.
2. Give credit by adding the source link right below the heading:

   ```md
   Source: <https://github.com/andreww2012/ai-guidelines/blob/COMMIT_HASH/.agents/guidelines.md>
   ```

3. Link the file from `AGENTS.md`:

   ```md
   Before your first response, you MUST read [the project guidelines](./.agents/guidelines.md) in full.
   Follow them in everything you do, even when you are only answering a question.
   ```

To get updates, compare your copy with the newer version and update the hash in the source link.

#### Link to the file

Link the raw version of the file from `AGENTS.md`:

```md
Before your first response, you MUST read [the project guidelines](https://raw.githubusercontent.com/andreww2012/ai-guidelines/COMMIT_HASH/.agents/guidelines.md) in full.
Follow them in everything you do, even when you are only answering a question.
```

To get updates, change the hash.

## Development

- `nr build` builds the CLI into `dist`, `node dist/cli.mjs` runs it
- `nr t` runs the tests
- `nr test` runs all checks and the tests
- `nr ch` adds a [changeset](https://github.com/changesets/changesets) for the next release

The CLI links the guidelines at the last commit that changed `.agents`, which is saved at build time.
CI publishes the package to npm when a release pull request created by changesets is merged.
