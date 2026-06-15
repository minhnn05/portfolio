import { useEffect } from 'react';

/**
 * SEO component — cập nhật <title> và meta tags.
 * Không dùng thêm library vì Vite SPA đơn giản.
 */
export default function SEO({ title, description, image, url }) {
  const siteName = 'Minh Portfolio';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDesc = 'Full-stack developer — React, FastAPI, PostgreSQL.';
  const metaDesc = description ?? defaultDesc;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name, content, attr = 'name') => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', metaDesc);
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', metaDesc, 'property');
    setMeta('og:type', 'website', 'property');
    if (url) setMeta('og:url', url, 'property');
    if (image) setMeta('og:image', image, 'property');
  }, [fullTitle, metaDesc, url, image]);

  return null;
}
