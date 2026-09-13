import { SITE_URL } from '../lib/site';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/day'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
