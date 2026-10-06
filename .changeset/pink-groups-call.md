---
'@andreww2012/ai-guidelines': minor
---

The package now has a programmatic API. `setupGuidelines` and `updateDocument` do the same as the CLI commands, but don't ask questions. Helpers like `readDocument` and `getDocumentUrl` are exported too, as well as `documentsCommitHash`, the hash of the last commit that changed the documents. Links to the documents now point to the git tag of the package version instead of a commit
