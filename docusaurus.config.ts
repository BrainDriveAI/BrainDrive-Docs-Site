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
  tagline: 'The User-Owned, Modular AI System',
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
          `https://github.com/BrainDriveAI/BrainDrive-Core/edit/main/${docPath}`,
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
          return repo
            ? `https://github.com/${repo}/edit/main/${rest.join('/')}`
            : undefined;
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
          return repo
            ? `https://github.com/${repo}/edit/main/${rest.join('/')}`
            : undefined;
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'BrainDrive',
      items: [
        { to: '/core/', label: 'Core', position: 'left' },
        { to: '/plugins/intro', label: 'Plugins', position: 'left' },
        { to: '/services/intro', label: 'Services', position: 'left' },
        { to: '/template/intro', label: 'Plugin Template', position: 'left' },
        { href: 'https://github.com/BrainDriveAI', label: 'GitHub', position: 'right' },
      ],
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  },
};

export default config;
