import { freshClient } from '../lib/sanity/client';
import { postSlugsQuery, publishedIssuesQuery } from '../lib/queries';
import { SITE_URL } from '../lib/site';

export const revalidate = 3600;

export default async function sitemap() {
  let posts = [];
  let issues = [];
  try {
    [posts, issues] = await Promise.all([
      freshClient.fetch(postSlugsQuery),
      freshClient.fetch(publishedIssuesQuery),
    ]);
  } catch {
    // A CMS hiccup shouldn't take the sitemap down — ship the static routes.
  }

  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1 },
    { url: `${SITE_URL}/newsletter`, lastModified: now, priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, priority: 0.8 },
    ...(posts || []).map((slug) => ({ url: `${SITE_URL}/blog/${slug}`, lastModified: now })),
    ...(issues || [])
      .filter((i) => i.slug)
      .map((i) => ({ url: `${SITE_URL}/newsletter/${i.slug}`, lastModified: now })),
  ];
}
