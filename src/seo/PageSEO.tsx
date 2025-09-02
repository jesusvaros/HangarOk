import { useEffect } from 'react';

type Props = {
  title?: string;
  description?: string;
  canonicalPath?: string; // defaults to current pathname
  noindex?: boolean;
};

function ensureMeta(name: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  return el;
}

function ensureLink(rel: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  return el;
}

export default function PageSEO({ title, description, canonicalPath, noindex }: Props) {
  useEffect(() => {
    if (title) {
      document.title = title;
      // Mirror to OG/Twitter when possible (Google renders JS; social scrapers may not)
      ensureMeta('og:title', 'property').setAttribute('content', title);
      ensureMeta('twitter:title').setAttribute('content', title);
    }
    if (description) {
      ensureMeta('description').setAttribute('content', description);
      ensureMeta('og:description', 'property').setAttribute('content', description);
      ensureMeta('twitter:description').setAttribute('content', description);
    }

    const url = (() => {
      const { origin, pathname } = window.location;
      const path = canonicalPath ?? pathname;
      return origin + path;
    })();
    // Canonical and og:url
    ensureLink('canonical').setAttribute('href', url);
    ensureMeta('og:url', 'property').setAttribute('content', url);

    // Robots handling for noindex pages
    const robotsContent = noindex ? 'noindex,nofollow' : 'index,follow';
    ensureMeta('robots').setAttribute('content', robotsContent);
  }, [title, description, canonicalPath, noindex]);

  return null;
}

