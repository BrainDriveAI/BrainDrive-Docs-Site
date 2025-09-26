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
      <div className={styles.heroButtonWrap}>
        <Link
          className={clsx('button button--secondary button--lg', styles.heroOutlineButton)}
          to="/core/OWNER_USER_GUIDE">
          Owner's Manual
        </Link>
      </div>
    </div>
  );
}

function GetStarted(): ReactNode {
  const steps = [
    {
      title: 'Install BrainDrive-Core',
      desc: 'Set up the core locally in minutes.',
      to: '/core/INSTALL',
      cta: 'Install',
    },
    {
      title: 'Use Existing Plugins',
      desc: 'Explore and enable plugins from the ecosystem.',
      to: '/plugins/intro',
      cta: 'Use Plugins',
    },
    {
      title: 'Build Your Own Plugins',
      desc: 'Start developing plugins with the quickstart.',
      to: '/core/PLUGIN_DEVELOPER_QUICKSTART',
      cta: 'Start Building',
    },
  ];
  return (
    <section className={styles.getStartedSection}>
      <div className="container">
        <Heading as="h2" className={styles.getStartedTitle}>
          Get Started
        </Heading>
        <div className="row">
          {steps.map((s, i) => (
            <div key={s.title} className="col col--4 margin-bottom--lg">
              <div className={clsx('card', styles.quickCard, styles.getStartedCard)}>
                <div className={styles.stepNumberTop} aria-hidden="true">
                  <span className={styles.stepNumber}>{i + 1}</span>
                </div>
                <div className="card__header">
                  <Heading as="h3">{s.title}</Heading>
                </div>
                {/* Removed descriptive sentence under the title */}
                <div className={clsx('card__footer', styles.centerFooter)}>
                  <Link className={clsx('button button--primary', styles.blueButton, styles.stepButton)} to={s.to}>
                    {s.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickLinks() {
  const links = [
    {label: 'Core', desc: 'Front & back-end runtime', to: '/core/'},
    {label: 'Plugins', desc: 'Add functionality to Core', to: '/plugins/intro'},
    {label: 'Service Bridges', desc: 'Decoupled Core <-> Plugin communication', to: '/services/intro'},
    {label: 'PluginTemplate', desc: 'Boilerplate + lifecycle installer/updater', to: '/template/intro'},
    {label: 'GitHub', desc: 'Source & issues', href: 'https://github.com/BrainDriveAI'},
    {label: 'Community', desc: 'Discussions & Support', href: 'https://community.braindrive.ai'},
  ];
  return (
    <div className="container margin-vert--lg">
      <div className="row">
        {links.map((l) => (
          <div key={l.label} className="col col--4 margin-bottom--lg">
            <div className={clsx('card', styles.quickCard)}>
              <div className="card__header">
                <Heading as="h3">{l.label}</Heading>
              </div>
              <div className="card__body">
                <p>{l.desc}</p>
              </div>
              <div className="card__footer">
                {l.to ? (
                  <Link className={clsx('button button--primary', styles.blueButton)} to={l.to}>
                    Open
                  </Link>
                ) : (
                  <Link className={clsx('button button--primary', styles.blueButton)} href={l.href!}>
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
        <GetStarted />
        <div className="container">
          <Heading as="h2" className={styles.sectionTitle}>
            Explore the BrainDrive Ecosystem
          </Heading>
        </div>
        <QuickLinks />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
