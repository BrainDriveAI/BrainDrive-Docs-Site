import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import OwnSvg from '@site/static/img/home-own.svg';
import ModifySvg from '@site/static/img/home-modify.svg';
import MonetizeSvg from '@site/static/img/home-monetize.svg';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Own',
    Svg: OwnSvg,
    description: (
      <>MIT Licensed &amp; Self-Hosted</>
    ),
  },
  {
    title: 'Modify',
    Svg: ModifySvg,
    description: (
      <>Modular &amp; Easy to Customize</>
    ),
  },
  {
    title: 'Monetize',
    Svg: MonetizeSvg,
    description: (
      <>On Your Terms, not Big Tech&apos;s</>
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
        <Heading
          as="h2"
          className={clsx('text--center margin-bottom--lg', styles.sectionHeading)}>
          Your AI. Your Rules.
        </Heading>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
