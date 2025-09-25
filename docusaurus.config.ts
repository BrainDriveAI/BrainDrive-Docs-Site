import type {Config} from '@docusaurus/types';
import {themes as prismThemes} from 'prism-react-renderer';

const serviceRepoMap: Record<string, string> = {
  // "doc-service": "BrainDriveAI/DocService",
};
const pluginRepoMap: Record<string, string> = {
  "ai-chat": "DJJones66/BrainDriveChat",
};

const config: Config = {
  title: 'BrainDrive',
  tagline: 'The Self‑Hosted, Modular AI System You Own',
  favicon: 'img/favicon.ico',

  url: 'https://braindriveai.github.io',
  baseUrl: '/BrainDrive-Docs/',

  organizationName: 'BrainDriveAI',
  projectName: 'BrainDrive-Docs',

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
        editUrl: ({docPath}) =>
          `https://github.com/BrainDriveAI/BrainDrive-Docs/blob/main/docs-core/${docPath}`,
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
        editUrl: ({docPath}) =>
          `https://github.com/BrainDriveAI/PluginTemplate/edit/main/${docPath}`,
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

          // Fallback lets contributors edit docs that live inside BrainDrive-Docs.
          return `https://github.com/BrainDriveAI/BrainDrive-Docs/edit/main/docs-services/${docPath}`;
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

          // Fallback to editing the doc within the BrainDrive-Docs repository when
          // no dedicated plugin repository is registered.
          return `https://github.com/BrainDriveAI/BrainDrive-Docs/edit/main/docs-plugins/${docPath}`;
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'BrainDrive',
      items: [
        { to: '/core/OWNER_USER_GUIDE', label: 'System Overview', position: 'left' },
        { to: '/core/INSTALL', label: 'Install', position: 'left' },
        { to: '/plugins/intro', label: 'Plugins', position: 'left' },
        {
          label: 'Plugin Development',
          position: 'left',
          items: [
            { to: '/core/PLUGIN_DEVELOPER_QUICKSTART', label: 'Dev Quickstart' },
            { to: '/template/intro', label: 'Plugin Template' },
            { to: '/services/intro', label: 'Service Bridges' },
          ],
        },
        {
          label: 'Resources',
          position: 'left',
          items: [
            { to: '/core/ROADMAP', label: 'Roadmap' },
            { to: '/core/CONTRIBUTING', label: 'Contribute' },
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
