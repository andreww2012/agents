# Agents

Generic [guidelines](./.agents/guidelines.md) for AI coding agents: communication, code, workflow and tooling.

## Usage

There are two ways to use the guidelines in your project.
In both cases, replace `COMMIT_HASH` with the hash of the commit you want to use (for example, the latest one on `main`).

### Copy the file

1. Copy [`.agents/guidelines.md`](./.agents/guidelines.md) into your project, for example into the `.agents` directory.
2. Give credit by adding the source link right below the heading:

   ```md
   Source: <https://github.com/andreww2012/agents/blob/COMMIT_HASH/.agents/guidelines.md>
   ```

3. Link the file from `AGENTS.md`:

   ```md
   Before your first response, you MUST read [the project guidelines](./.agents/guidelines.md) in full.
   Follow them in everything you do, even when you are only answering a question.
   ```

You can change your copy as you like.
To get updates, compare your copy with the newer version and update the hash in the source link.

### Link to the file

Instead of copying the file, link its raw version from `AGENTS.md`:

```md
Before your first response, you MUST read [the project guidelines](https://raw.githubusercontent.com/andreww2012/agents/COMMIT_HASH/.agents/guidelines.md) in full.
Follow them in everything you do, even when you are only answering a question.
```

The agent downloads the file itself, so it needs network access.
Since the link has a commit hash, its content never changes.
To get updates, change the hash.
