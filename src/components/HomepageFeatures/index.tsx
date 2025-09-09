import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Own Your Data',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Local‑first by design: your data stays with you while BrainDrive
        orchestrates AI workflows securely. <Link to="/core/intro">Learn more</Link>.
      </>
    ),
  },
  {
    title: 'Service Bridges',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Plugins communicate through standardized bridges (Events, Theme,
        Settings, Page Context, Plugin State, API) for clean, decoupled
        integrations. <Link to="/core/SERVICE_BRIDGE_EXAMPLES">See examples</Link>.
      </>
    ),
  },
  {
    title: 'Developer Velocity',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Ship fast with the <Link to="/template/intro">Plugin Template</Link> and
        <Link to="/core/PLUGIN_DEVELOPER_QUICKSTART"> Quickstart</Link>—React frontend,
        FastAPI backend, and clear docs.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
