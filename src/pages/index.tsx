import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function CTAButtons() {
  return (
    <div className={styles.buttons}>
      <Link className="button button--secondary button--lg" to="/core/PLUGIN_DEVELOPER_QUICKSTART">
        Plugin Dev QuickStart
      </Link>
    </div>
  );
}

function QuickLinks() {
  const links = [
    {label: 'Core', desc: 'Architecture, install, roadmap', to: '/core/intro'},
    {label: 'Plugins', desc: 'Build and integrate plugins', to: '/plugins/intro'},
    {label: 'Services', desc: 'Bridge-based integrations', to: '/services/intro'},
    {label: 'Plugin Template', desc: 'Jumpstart development', to: '/template/intro'},
    {label: 'GitHub', desc: 'Source & issues', href: 'https://github.com/BrainDriveAI'},
  ];
  return (
    <div className="container margin-vert--lg">
      <div className="row">
        {links.map((l) => (
          <div key={l.label} className="col col--4 margin-bottom--lg">
            <div className="card">
              <div className="card__header">
                <Heading as="h3">{l.label}</Heading>
              </div>
              <div className="card__body">
                <p>{l.desc}</p>
              </div>
              <div className="card__footer">
                {l.to ? (
                  <Link className="button button--primary" to={l.to}>
                    Open
                  </Link>
                ) : (
                  <Link className="button button--primary" href={l.href!}>
                    Open
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PopularDocs() {
  const docs = [
    {label: 'Install', desc: 'macOS, Windows, Linux setup', to: '/core/INSTALL'},
    {label: 'Roadmap', desc: 'What’s planned and in progress', to: '/core/ROADMAP'},
    {label: 'Contributing', desc: 'How to help and guidelines', to: '/core/CONTRIBUTING'},
  ];
  return (
    <div className="container margin-vert--lg">
      <Heading as="h2">Popular Docs</Heading>
      <div className="row">
        {docs.map((d) => (
          <div key={d.label} className="col col--4 margin-bottom--lg">
            <div className="card">
              <div className="card__header">
                <Heading as="h3">{d.label}</Heading>
              </div>
              <div className="card__body">
                <p>{d.desc}</p>
              </div>
              <div className="card__footer">
                <Link className="button button--primary" to={d.to}>
                  Open
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <CTAButtons />
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`BrainDrive Docs`}
      description="BrainDrive documentation for core, plugins, and services">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <QuickLinks />
        <PopularDocs />
      </main>
    </Layout>
  );
}
