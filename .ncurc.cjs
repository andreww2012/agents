// @ts-check
const fs = require('node:fs');
const path = require('node:path');
const semver = require('semver');
const packageJson = require('./package.json');

const CACHE_DIRECTORY = path.join(__dirname, 'node_modules/.cache/npm-check-updates');
fs.mkdirSync(CACHE_DIRECTORY, {recursive: true});

/** @type {Set<string>} */
const IGNORED_PACKAGES = new Set();

/** @type {Set<string>} */
const IGNORED_MAJOR_VERSION_TRANSITIONS = new Set(['@types/node']);

/**
 * @type {Record<string, {packages: string[]; groupName?: string; icon?: string; priority?: number | null}>}
 */
const PACKAGE_GROUPS = Object.entries({
  'Package manager': {
    packages: ['pnpm'],
    icon: '📦',
    priority: 0,
  },
  '@eslint': {
    packages: ['eslint', 'eslint-config-un'],
    groupName: 'ESLint',
  },
  '@cspell': {
    packages: ['cspell'],
  },
  // '@commitlint': {packages: []},
}).reduce((result, [groupName, {packages: packagesInGroup, ...groupMeta}]) => {
  const isScopedGroup = groupName.startsWith('@');
  const groupInfo = {
    groupName: isScopedGroup ? groupName.slice(1) : groupName,
    ...groupMeta,
  };

  const packagesInCurrentGroup = Object.fromEntries([
    [isScopedGroup ? `${groupName}/*` : groupName, groupInfo],
    ...packagesInGroup.map((packageInGroup) => [packageInGroup, groupInfo]),
  ]);

  return Object.assign(result, packagesInCurrentGroup);
}, {});

/**
 * @type {import('npm-check-updates').RunOptions}
 */
module.exports = {
  cache: true,
  cacheExpiration: 30,
  cacheFile: path.join(CACHE_DIRECTORY, 'cache.json'),

  filterResults: (
    packageName,
    {currentVersion: currentVersionRaw, upgradedVersion: upgradedVersionRaw},
  ) => {
    // cspell:disable-next-line
    // eslint-disable-next-line sonarjs/no-empty-collection
    if (IGNORED_PACKAGES.has(packageName)) {
      return false;
    }

    const [currentVersion, upgradedVersion] = [currentVersionRaw, upgradedVersionRaw].map((v) =>
      v.split('@').at(-1),
    );
    const [currentVersionSemver, upgradedVersionSemver] = [currentVersion, upgradedVersion].map(
      (v) => semver.parse(v),
    );
    return !(
      IGNORED_MAJOR_VERSION_TRANSITIONS.has(packageName) &&
      currentVersionSemver?.major !== upgradedVersionSemver?.major
    );
  },

  format: ['group'],
  interactive: true,
  groupFunction: (fullName) => {
    const [nameScope] = fullName.split('/', 1);
    const knownGroup = PACKAGE_GROUPS[fullName] || PACKAGE_GROUPS[`${nameScope}/*`];

    if (knownGroup) {
      const {groupName, icon, priority} = knownGroup;
      return `${priority === null ? '' : `${priority ?? 3}. `}${icon || '📁'} ${groupName}`;
    }

    return fullName in packageJson.devDependencies
      ? '2. 🧑‍💻 Dev dependencies'
      : '1. 📦 Direct dependencies';
  },
};
