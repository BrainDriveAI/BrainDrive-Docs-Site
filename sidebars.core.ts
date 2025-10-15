import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  defaultSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        {type: 'doc', id: 'INSTALL', label: 'Install'},
        {type: 'doc', id: 'getting-started/plugin-developer-quickstart', label: 'Plugin Dev Quick Start'},
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      items: [{type: 'doc', id: 'concepts/plugins', label: 'Plugins'}],
    },
    {
      type: 'category',
      label: 'How-To Guides',
      items: [
        {type: 'doc', id: 'how-to/use-braindrive', label: 'Use BrainDrive'},
        {type: 'doc', id: 'how-to/use-plugins', label: 'Use Plugins'},
        {type: 'doc', id: 'how-to/use-service-bridges', label: 'Use Service Bridges'},
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [{type: 'doc', id: 'reference/API', label: 'API'}],
    },
    {
      type: 'category',
      label: 'Resources',
      items: [
        {type: 'doc', id: 'ROADMAP', label: 'Roadmap'},
        {type: 'doc', id: 'CONTRIBUTING', label: 'Contributing'},
      ],
    },
  ],
};

export default sidebars;
