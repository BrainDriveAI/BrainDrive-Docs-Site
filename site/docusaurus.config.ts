import type {Config} from '@docusaurus/types';
import {themes as prismThemes} from 'prism-react-renderer';

const config: Config = {
  title: 'BrainDrive Docs',
  tagline: 'Own, build, and benefit from your AI.',
  favicon: 'img/favicon.ico',

  // GitHub Pages (project site) settings:
  url: 'https://braindriveai.github.io',
  baseUrl: '/BrainDrive-Docs/',

  organizationName: 'BrainDriveAI',
  projectName: 'BrainDrive-Docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: { defaultLocale: 'en', locales: ['en'] },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl: 'https://github.com/BrainDriveAI/BrainDrive-Docs/edit/main/site/',
        },
        blog: false,
        theme: { customCss: require.resolve('./src/css/custom.css') },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'BrainDrive',
      items: [
        { to: '/docs', label: 'Docs', position: 'left' },
        { href: 'https://github.com/BrainDriveAI', label: 'GitHub', position: 'right' },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
