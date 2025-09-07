import type {Config} from '@docusaurus/types';
import {themes as prismThemes} from 'prism-react-renderer';
import fs from 'fs';
import path from 'path';

function readMeta(section: 'core'|'template'|'plugins'|'services', key?: string){
  const baseDir =
    section === 'core'     ? 'docs-core' :
    section === 'template' ? 'docs-template' :
    section === 'plugins'  ? `docs-plugins/${key}` :
                             `docs-services/${key}`;
  const pEdit = path.join(__dirname, baseDir, '.editbase');
  const pRepo = path.join(__dirname, baseDir, '.repo');
  const editbase = fs.existsSync(pEdit) ? fs.readFileSync(pEdit,'utf8').trim() : 'docs';
  const repo = fs.existsSync(pRepo) ? fs.readFileSync(pRepo,'utf8').trim() : undefined;
  return {editbase, repo};
}

const config: Config = {
  title: 'BrainDrive',
  tagline: 'User-owned, plugin-based AI system',
  favicon: 'img/favicon.ico',
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
        // Guides (this site repo)
        docs: {
          routeBasePath: 'guides',
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl: 'https://github.com/BrainDriveAI/BrainDrive-Docs/edit/main/',
        },
        blog: false,
        theme: { customCss: require.resolve('./src/css/custom.css') },
      },
    ],
  ],

  // Multi-docs instances
  plugins: [
    // Core
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'core',
        path: 'docs-core',
        routeBasePath: 'core',
        sidebarPath: require.resolve('./sidebars.core.ts'),
        editUrl: ({docPath}) => {
          const {editbase, repo} = readMeta('core');
          const useRepo = repo || 'BrainDriveAI/BrainDrive-Core';
          const prefix = editbase === 'root' ? '' : 'docs/';
          // IMPORTANT: we return the full path; Docusaurus will NOT append versionDocsDirPath
          return `https://github.com/${useRepo}/edit/main/${prefix}${docPath}`;
        },
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
        editUrl: ({docPath}) => {
          const {editbase, repo} = readMeta('template');
          const useRepo = repo || 'BrainDriveAI/PluginTemplate';
          const prefix = editbase === 'root' ? '' : 'docs/';
          return `https://github.com/${useRepo}/edit/main/${prefix}${docPath}`;
        },
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
          const {editbase, repo} = readMeta('services', service);
          if (!repo) return undefined;
          const prefix = editbase === 'root' ? '' : 'docs/';
          return `https://github.com/${repo}/edit/main/${prefix}${rest.join('/')}`;
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
          const {editbase, repo} = readMeta('plugins', plugin);
          if (!repo) return undefined;
          const prefix = editbase === 'root' ? '' : 'docs/';
          return `https://github.com/${repo}/edit/main/${prefix}${rest.join('/')}`;
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'BrainDrive',
      items: [
        { to: '/guides/intro', label: 'Guides', position: 'left' },
        { to: '/core/intro', label: 'Core', position: 'left' },
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
