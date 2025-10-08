declare module '@theme/Heading' {
  import type {ComponentType, ReactNode} from 'react';

  export interface HeadingProps {
    readonly as?: `h${1 | 2 | 3 | 4 | 5 | 6}`;
    readonly id?: string;
    readonly className?: string;
    readonly children?: ReactNode;
  }

  const Heading: ComponentType<HeadingProps>;
  export default Heading;
}

declare module '@theme/Layout' {
  import type {ReactNode} from 'react';

  export interface LayoutProps {
    readonly children?: ReactNode;

    /**
     * Optional page metadata helpers kept for backwards compatibility.
     */
    readonly title?: string;
    readonly description?: string;
    readonly keywords?: string[];
    readonly noFooter?: boolean;
    readonly wrapperClassName?: string;
  }

  export default function Layout(props: LayoutProps): ReactNode;
}
