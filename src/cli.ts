#!/usr/bin/env node
import * as prompts from '@clack/prompts';
import {cli, command} from 'cleye';
import {consola} from 'consola';
import packageJson from '../package.json' with {type: 'json'};
import {DOCUMENTS} from './documents.ts';
import {setup} from './setup.ts';
import {update} from './update.ts';
import {AbortError} from './utils.ts';

const handleErrors = (promise: Promise<void>) =>
  promise.catch((error: unknown) => {
    if (error instanceof AbortError) {
      prompts.cancel(error.message);
    } else {
      consola.error(error);
    }

    process.exitCode = 1;
  });

await cli(
  {
    name: packageJson.name,
    version: packageJson.version,
    help: {description: packageJson.description},
    strictFlags: true,
    commands: [
      command(
        {
          name: 'setup',
          help: {
            description:
              'Link the guidelines from AGENTS.md. Run it in the project root, it asks everything it needs',
          },
        },
        () => handleErrors(setup()),
      ),
      command(
        {
          name: 'update',
          parameters: ['[document]'],
          flags: {
            path: {
              type: String,
              description: 'Path to the document in the project, if it is not in .agents',
              placeholder: '<path>',
            },
          },
          help: {
            description: `Update a document copied into the project to the version from this package (documents: ${DOCUMENTS.join(', ')})`,
          },
        },
        (argv) => handleErrors(update(argv._.document, argv.flags.path)),
      ),
    ],
  },
  (argv) => {
    if (argv._.length > 0) {
      consola.error(`Unknown command: ${argv._.join(' ')}`);
      process.exitCode = 1;
    }

    argv.showHelp();
  },
);
