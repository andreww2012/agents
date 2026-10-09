# @andreww2012/ai-guidelines

## 0.2.2

### Patch Changes

- [`a97e3d0`](https://github.com/andreww2012/ai-guidelines/commit/a97e3d0d4666fd87fee8b4381f72d425d14b2b43) - Guidelines: commit messages are now checked with the project's commit linter, one-off binaries are run through the project's package manager, and checks are limited to changed files

- [`d5bbd58`](https://github.com/andreww2012/ai-guidelines/commit/d5bbd582d02d1c70342e921b6f2641a368a53a98) - Guidelines: added a rule against whitespace at the start and end of element text in Vue templates

- [`b54cba1`](https://github.com/andreww2012/ai-guidelines/commit/b54cba168490cbdc3624cf3af7111efa37f4a833) - Guidelines: added rules for type annotations, `forEach`, conditional spreads and query parameter names; reworked the CONSTANT_CASE rule

## 0.2.1

### Patch Changes

- [`9b21d84`](https://github.com/andreww2012/ai-guidelines/commit/9b21d845df42de25af39def79787ff0705399668) - Guidelines: added new rules for frontend URLs, npm links, package patches, changesets and more

## 0.2.0

### Minor Changes

- [`40d6463`](https://github.com/andreww2012/ai-guidelines/commit/40d646335849279d3f9c471618a661853c16a1e8) - The package now has a programmatic API. `setupGuidelines` and `updateDocument` do the same as the CLI commands, but don't ask questions. Helpers like `readDocument` and `getDocumentUrl` are exported too, as well as `documentsCommitHash`, the hash of the last commit that changed the documents. Links to the documents now point to the git tag of the package version instead of a commit

- [`c0a3341`](https://github.com/andreww2012/ai-guidelines/commit/c0a3341b0688d1c75d5252b7df01a2caf12762ca) - `getInstruction` is now exported. It returns the text that links the guidelines from `AGENTS.md`: to the file on GitHub by default, or to your own link

### Patch Changes

- [`e4fcf62`](https://github.com/andreww2012/ai-guidelines/commit/e4fcf62a8517d86caedaef873b15dad628785bd7) - Guidelines: changesets should not use the imperative mood

## 0.1.0

### Minor Changes

- [`ee755d4`](https://github.com/andreww2012/ai-guidelines/commit/ee755d48ec4b1f4bf1ca197498c2eab48cc757d7) - First release: a CLI to set up the guidelines in your project. Run `pnpm dlx @andreww2012/ai-guidelines setup` in the project root to link them from `AGENTS.md`, and `pnpm dlx @andreww2012/ai-guidelines update guidelines` to update your copy
