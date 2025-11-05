import fs from 'node:fs';
import path from 'node:path';

import type {Config} from '@docusaurus/types';
import {themes as prismThemes} from 'prism-react-renderer';

type EditUrlOverrides = Record<string, string>;

type EditUrlPayload =
  | string
  | {
      docPath?: string;
      versionDocsDirPath?: string;
      source?: string;
    };

function normalizeDocPath(input: EditUrlPayload): string | null {
  if (typeof input === 'string') return input;
  if (!input) return null;
  if (input.docPath) return input.docPath;
  if (input.source) {
    const match = input.source.match(/@site\/[^/]+\/(.*)$/);
    if (match) return match[1];
  }
  return null;
}

function makeGitHubEditUrlResolver(
  repo: string,
  options: {branch?: string; pathPrefix?: string; overrides?: EditUrlOverrides} = {},
): (payload: EditUrlPayload) => string {
  const branch = options.branch ?? 'main';
  const prefix = options.pathPrefix ? options.pathPrefix.replace(/\/?$/, '/') : '';
  const overrides = options.overrides ?? {};

  return (payload: EditUrlPayload) => {
    const docPath = normalizeDocPath(payload);
    if (!docPath) {
      throw new Error(`Unable to determine docPath for edit URL payload: ${JSON.stringify(payload)}`);
    }
    const mappedPath = overrides[docPath] ?? `${prefix}${docPath}`;
    return `https://github.com/${repo}/edit/${branch}/${mappedPath}`;
  };
}

type SyncedDocRepoConfig = {
  repo: string;
  editBase: string;
};

function loadSyncedDocRepoConfigs(baseDir: string): Record<string, SyncedDocRepoConfig> {
  const result: Record<string, SyncedDocRepoConfig> = {};
  if (!fs.existsSync(baseDir)) return result;

  for (const entry of fs.readdirSync(baseDir)) {
    const entryPath = path.join(baseDir, entry);
    let stat: fs.Stats;
    try {
      stat = fs.statSync(entryPath);
    } catch {
      continue;
    }

    if (!stat.isDirectory()) continue;

    const repoFile = path.join(entryPath, '.repo');
    if (!fs.existsSync(repoFile)) continue;
    const repo = fs.readFileSync(repoFile, 'utf8').trim();
    if (!repo) continue;

    let editBase = 'root';
    const editBaseFile = path.join(entryPath, '.editbase');
    if (fs.existsSync(editBaseFile)) {
      const value = fs.readFileSync(editBaseFile, 'utf8').trim();
      if (value) {
        editBase = value.replace(/^\/+|\/+$/g, '');
      }
    }

    result[entry] = {repo, editBase};
  }

  return result;
}

const serviceRepoMap: Record<string, string> = {
  // "doc-service": "BrainDriveAI/DocService",
};
const pluginRepoMap = loadSyncedDocRepoConfigs(path.join(__dirname, 'docs-plugins'));

const docsCoreDir = path.join(__dirname, 'docs-core');

function coreDocPathCandidates(docId: string): string[] {
  const segments = docId.split('/');
  const fileName = segments.pop();
  if (!fileName) return [];
  const baseDir = path.join(docsCoreDir, ...segments);
  return [
    path.join(baseDir, `${fileName}.md`),
    path.join(baseDir, `${fileName}.mdx`),
    path.join(baseDir, fileName, 'index.md'),
    path.join(baseDir, fileName, 'index.mdx'),
  ];
}

function coreDocExists(docId: string): boolean {
  return coreDocPathCandidates(docId).some((candidate) => fs.existsSync(candidate));
}

function coreDocRoute(docId: string): string | null {
  return coreDocExists(docId) ? `/core/${docId}` : null;
}

function compact<T>(items: Array<T | null | undefined>): T[] {
  return items.filter((item): item is T => item != null);
}

function pickExistingCoreDocPath(candidates: string[], fallback: string): string {
  for (const candidate of candidates) {
    if (fs.existsSync(path.join(docsCoreDir, candidate))) {
      return candidate;
    }
  }
  return fallback;
}

const coreInstallDocPath = pickExistingCoreDocPath(
  [
    'getting-started/install.md',
    'getting-started/install.mdx',
    'docs/getting-started/install.md',
    'docs/getting-started/install.mdx',
  ],
  'getting-started/install.md',
);

const coreDocEditUrlResolver = makeGitHubEditUrlResolver('BrainDriveAI/BrainDrive-Core', {
  pathPrefix: 'docs',
  overrides: {
    // Local shim proxies to the install guide inside the core repo.
    'INSTALL.mdx': coreInstallDocPath,
    'ROADMAP.mdx': 'ROADMAP.md',
    'CONTRIBUTING.mdx': 'CONTRIBUTING.md',
  },
});

const resolveCoreDocEditUrl = (payload: EditUrlPayload): string => {
  const docPath = normalizeDocPath(payload);
  if (!docPath) {
    throw new Error(`Unable to determine docPath for edit URL payload: ${JSON.stringify(payload)}`);
  }

  return coreDocEditUrlResolver(payload);
};

const ownerManualRoute = coreDocRoute('how-to/use-braindrive');
const installRoute = coreDocRoute('INSTALL');
const pluginQuickstartRoute = coreDocRoute('getting-started/plugin-developer-quickstart');
const roadmapRoute = coreDocRoute('ROADMAP');
const contributingRoute = coreDocRoute('CONTRIBUTING');

const navbarPrimaryItems = compact([
  ownerManualRoute ? {to: ownerManualRoute, label: "Owner's Manual", position: 'left' as const} : null,
  installRoute ? {to: installRoute, label: 'Install', position: 'left' as const} : null,
  {to: '/plugins/intro', label: 'Use Plugins', position: 'left' as const},
  pluginQuickstartRoute
    ? {to: pluginQuickstartRoute, label: 'Build Plugins', position: 'left' as const}
    : null,
]);

const resourcesDropdownItems = compact([
  roadmapRoute ? {to: roadmapRoute, label: 'Roadmap'} : null,
  contributingRoute ? {to: contributingRoute, label: 'Contributing'} : null,
  {href: 'https://community.braindrive.ai', label: 'Community'},
  {href: 'https://github.com/BrainDriveAI', label: 'GitHub'},
]);

const navbarItems = [
  ...navbarPrimaryItems,
  ...(resourcesDropdownItems.length > 0
    ? [{label: 'Resources', position: 'left' as const, items: resourcesDropdownItems}]
    : []),
];

const config: Config = {
  title: 'BrainDrive',
  tagline: 'Your Self-Hosted, Modular AI System',
  favicon: 'Icon-Logo-Dark-Mode.svg',

  url: 'https://docs.braindrive.ai',
  baseUrl: '/',

  organizationName: 'BrainDriveAI',
  projectName: 'BrainDrive-Docs-Site',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: { defaultLocale: 'en', locales: ['en'] },

  presets: [
    [
      'classic',
      {
        // Temporarily disable generic Guides until we have BrainDrive-focused content
        docs: false,
        blog: false,
        theme: { customCss: require.resolve('./src/css/custom.css') },
      },
    ],
  ],

  plugins: [
    // Provide the debug theme modules that the build is trying to load
    ['@docusaurus/plugin-debug', { id: 'debug-extra' }],

    // Core
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'core',
        path: 'docs-core',
        routeBasePath: 'core',
        sidebarPath: require.resolve('./sidebars.core.ts'),
        exclude: ['**/_includes/**'],
        editUrl: resolveCoreDocEditUrl,
      },
    ],
    // Plugin Template
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'template',
        path: 'docs-template',
        routeBasePath: 'template',
        sidebarPath: require.resolve('./sidebars.template.ts'),
        editUrl: makeGitHubEditUrlResolver('BrainDriveAI/PluginTemplate', {
          pathPrefix: 'docs',
        }),
      },
    ],
    // Services
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'services',
        path: 'docs-services',
        routeBasePath: 'services',
        sidebarPath: require.resolve('./sidebars.services.ts'),
        editUrl: ({docPath}) => {
          const [service, ...rest] = docPath.split('/');
          const repo = serviceRepoMap[service];
          if (repo) {
            const servicePath = rest.join('/');
            return `https://github.com/${repo}/edit/main/${servicePath}`;
          }

          // Fallback lets contributors edit docs that live inside BrainDrive-Docs-Site.
          return `https://github.com/BrainDriveAI/BrainDrive-Docs-Site/edit/main/docs-services/${docPath}`;
        },
      },
    ],
    // Plugins
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'plugins',
        path: 'docs-plugins',
        routeBasePath: 'plugins',
        sidebarPath: require.resolve('./sidebars.plugins.ts'),
        editUrl: (payload) => {
          const docPath = normalizeDocPath(payload);
          if (!docPath) {
            throw new Error(`Unable to determine docPath for plugin edit URL payload: ${JSON.stringify(payload)}`);
          }

          const [plugin, ...rest] = docPath.split('/');
          const config = pluginRepoMap[plugin];

          if (config) {
            const pluginPath = rest.join('/');
            const prefix =
              config.editBase && config.editBase !== 'root'
                ? `${config.editBase.replace(/\/?$/, '/')}`
                : '';
            const repoRelativePath =
              pluginPath && prefix && !pluginPath.startsWith(prefix)
                ? `${prefix}${pluginPath}`
                : pluginPath;

            if (repoRelativePath) {
              return `https://github.com/${config.repo}/edit/main/${repoRelativePath.replace(/^\/+/, '')}`;
            }

            const treePath =
              config.editBase && config.editBase !== 'root'
                ? config.editBase.replace(/^\/+|\/+$/g, '')
                : '';
            return treePath
              ? `https://github.com/${config.repo}/tree/main/${treePath}`
              : `https://github.com/${config.repo}/tree/main`;
          }

          // Fallback to editing the doc within the BrainDrive-Docs-Site repository when
          // no dedicated plugin repository is registered.
          return `https://github.com/BrainDriveAI/BrainDrive-Docs-Site/edit/main/docs-plugins/${docPath}`;
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: '',
      logo: {
        alt: 'BrainDrive logo',
        src: 'img/braindrive-logo.png',
      },
      items: navbarItems,
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    prism: { theme: prismThemes.dracula, darkTheme: prismThemes.dracula },
  },
};

export default config;
