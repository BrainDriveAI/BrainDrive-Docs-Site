import React from 'react';
import type {ComponentProps} from 'react';
import MDXComponents from '@theme-original/MDXComponents';

const INTERNAL_HOSTNAMES = new Set(['docs.braindrive.ai', 'localhost', '127.0.0.1']);
const INTERNAL_PATH_PREFIXES = ['/core', '/plugins', '/services', '/template'];

const DefaultLink = MDXComponents.a as React.ComponentType<ComponentProps<'a'>>;

const isAllowedInternalPath = (pathname: string): boolean => {
  if (!pathname || pathname === '/') return true;
  return INTERNAL_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
};

const normalizeInternalHref = (href: string): string => {
  if (!href) return href;
  if (href.startsWith('http://') || href.startsWith('https://')) {
    try {
      const url = new URL(href);
      if (INTERNAL_HOSTNAMES.has(url.hostname) && isAllowedInternalPath(url.pathname)) {
        return `${url.pathname}${url.search}${url.hash}`;
      }
    } catch {
      return href;
    }
  }
  return href;
};

const isInternalHref = (href?: string): boolean => {
  if (!href) return false;
  if (href.startsWith('#')) return true;
  if (href.startsWith('/')) {
    return isAllowedInternalPath(href);
  }
  if (href.startsWith('http://') || href.startsWith('https://')) {
    try {
      const url = new URL(href);
      return INTERNAL_HOSTNAMES.has(url.hostname) && isAllowedInternalPath(url.pathname);
    } catch {
      return false;
    }
  }
  return false;
};

const Anchor = (props: ComponentProps<'a'>) => {
  const {href, target, rel, ...rest} = props;

  if (href && isInternalHref(href)) {
    const normalizedHref = normalizeInternalHref(href);
    return <DefaultLink {...rest} href={normalizedHref} />;
  }

  return <DefaultLink {...props} target={target ?? '_blank'} rel={rel ?? 'noopener noreferrer'} />;
};

export default {
  ...MDXComponents,
  a: Anchor,
};
