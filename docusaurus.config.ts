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

const serviceRepoMap: Record<string, string> = {
  // "doc-service": "BrainDriveAI/DocService",
};
const pluginRepoMap: Record<string, string> = {
  'brain-drive-chat-plugin': 'BrainDriveAI/BrainDrive-Chat-Plugin',
};
const coreDocEditUrlResolver = makeGitHubEditUrlResolver('BrainDriveAI/BrainDrive-Core', {
  pathPrefix: 'docs',
  overrides: {
    // Local shim proxies to the install guide inside the core repo.
    'INSTALL.mdx': 'docs/getting-started/install.md',
    'ROADMAP.md': 'ROADMAP.md',
    'CONTRIBUTING.md': 'CONTRIBUTING.md',
  },
});

const resolveCoreDocEditUrl = (payload: EditUrlPayload): string => {
  const docPath = normalizeDocPath(payload);
  if (!docPath) {
    throw new Error(`Unable to determine docPath for edit URL payload: ${JSON.stringify(payload)}`);
  }

  return coreDocEditUrlResolver(payload);
};

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
        editUrl: ({docPath}) => {
          const [plugin, ...rest] = docPath.split('/');
          const repo = pluginRepoMap[plugin];
          if (repo) {
            const pluginPath = rest.join('/');
            return `https://github.com/${repo}/edit/main/${pluginPath}`;
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
      items: [
        { to: '/core/how-to/use-braindrive', label: 'Owner\'s Manual', position: 'left' },
        { to: '/core/INSTALL', label: 'Install', position: 'left' },
        { to: '/plugins/intro', label: 'Use Plugins', position: 'left' },
        { to: '/core/getting-started/plugin-developer-quickstart', label: 'Build Plugins', position: 'left' },
        {
          label: 'Resources',
          position: 'left',
          items: [
            { to: '/core/ROADMAP', label: 'Roadmap' },
            { to: '/core/CONTRIBUTING', label: 'Contributing' },
            { href: 'https://community.braindrive.ai', label: 'Community' },
            { href: 'https://github.com/BrainDriveAI', label: 'GitHub' },
          ],
        },
      ],
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
