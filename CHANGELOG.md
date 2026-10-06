# @andreww2012/ai-guidelines

## 0.2.0

### Minor Changes

- [`40d6463`](https://github.com/andreww2012/ai-guidelines/commit/40d646335849279d3f9c471618a661853c16a1e8) - The package now has a programmatic API. `setupGuidelines` and `updateDocument` do the same as the CLI commands, but don't ask questions. Helpers like `readDocument` and `getDocumentUrl` are exported too, as well as `documentsCommitHash`, the hash of the last commit that changed the documents. Links to the documents now point to the git tag of the package version instead of a commit

- [`c0a3341`](https://github.com/andreww2012/ai-guidelines/commit/c0a3341b0688d1c75d5252b7df01a2caf12762ca) - `getInstruction` is now exported. It returns the text that links the guidelines from `AGENTS.md`: to the file on GitHub by default, or to your own link

### Patch Changes

- [`e4fcf62`](https://github.com/andreww2012/ai-guidelines/commit/e4fcf62a8517d86caedaef873b15dad628785bd7) - Guidelines: changesets should not use the imperative mood

## 0.1.0

### Minor Changes

- [`ee755d4`](https://github.com/andreww2012/ai-guidelines/commit/ee755d48ec4b1f4bf1ca197498c2eab48cc757d7) - First release: a CLI to set up the guidelines in your project. Run `pnpm dlx @andreww2012/ai-guidelines setup` in the project root to link them from `AGENTS.md`, and `pnpm dlx @andreww2012/ai-guidelines update guidelines` to update your copy
