import fs from 'node:fs';
import path from 'node:path';

import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

type DocSpec = {id: string; label: string};

const docsDir = path.resolve(__dirname, 'docs-core');

function docPathCandidates(docId: string): string[] {
  const segments = docId.split('/');
  const fileName = segments.pop();
  if (!fileName) return [];
  const baseDir = path.join(docsDir, ...segments);
  return [
    path.join(baseDir, `${fileName}.md`),
    path.join(baseDir, `${fileName}.mdx`),
    path.join(baseDir, fileName, 'index.md'),
    path.join(baseDir, fileName, 'index.mdx'),
  ];
}

function docExists(docId: string): boolean {
  return docPathCandidates(docId).some((candidate) => fs.existsSync(candidate));
}

function makeDoc({id, label}: DocSpec) {
  return docExists(id) ? {type: 'doc' as const, id, label} : null;
}

function makeCategory(label: string, specs: DocSpec[]) {
  const items = specs.map(makeDoc).filter((item): item is NonNullable<ReturnType<typeof makeDoc>> => item !== null);
  return items.length > 0 ? {type: 'category' as const, label, items} : null;
}

type SidebarItem =
  | NonNullable<ReturnType<typeof makeDoc>>
  | NonNullable<ReturnType<typeof makeCategory>>;

const defaultSidebar: SidebarItem[] = [
  makeDoc({id: 'README', label: 'Overview'}),
  makeCategory('Getting Started', [
    {id: 'INSTALL', label: 'Install'},
  ]),
  makeCategory('Plugin Development', [
    {id: 'plugin-development/quickstart', label: 'Quick Start'},
    {id: 'plugin-development/naming-conventions', label: 'Naming Conventions'},
    {id: 'plugin-development/theming-guide', label: 'Theming Guide'},
  ]),
  makeCategory('Concepts', [{id: 'concepts/plugins', label: 'Plugins'}]),
  makeCategory('How-To Guides', [
    {id: 'how-to/use-braindrive', label: 'Use BrainDrive'},
    {id: 'how-to/use-plugins', label: 'Use Plugins'},
    {id: 'how-to/use-service-bridges', label: 'Use Service Bridges'},
  ]),
  makeCategory('Reference', [{id: 'reference/API', label: 'API'}]),
  makeCategory('Backend', [
    {id: 'backend/README', label: 'Overview'},
    {id: 'backend/app/ai_providers/README', label: 'AI Providers'},
    {id: 'backend/app/core/user_initializer/README', label: 'User Initializer'},
    {id: 'backend/app/core/user_updater/README', label: 'User Updater'},
    {id: 'backend/app/plugins/UNIVERSAL_LIFECYCLE_GUIDE', label: 'Universal Lifecycle Guide'},
  ]),
  makeCategory('Frontend', [
    {id: 'frontend/README', label: 'Overview'},
    {id: 'frontend/src/features/plugin-installer/README', label: 'Plugin Installer'},
    {id: 'frontend/src/features/plugin-manager/README', label: 'Plugin Manager'},
    {
      id: 'frontend/src/features/unified-dynamic-page-renderer/components/display-controller/README',
      label: 'Display Controller',
    },
  ]),
].filter((item): item is SidebarItem => item !== null);

const sidebars: SidebarsConfig = {
  defaultSidebar,
};

export default sidebars;
