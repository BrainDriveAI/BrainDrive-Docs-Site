import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  defaultSidebar: [
    {type: 'doc', id: 'intro', label: 'Overview'},
    {type: 'doc', id: 'INSTALL', label: 'Install'},
    {type: 'doc', id: 'OWNER_USER_GUIDE', label: 'Use'},
    {type: 'doc', id: 'PLUGIN_DEVELOPER_QUICKSTART', label: 'Plugin Dev Quick Start'},
    {type: 'doc', id: 'ROADMAP', label: 'Roadmap'},
    {type: 'doc', id: 'CONTRIBUTING', label: 'Contribute'},
  ],
};

export default sidebars;
