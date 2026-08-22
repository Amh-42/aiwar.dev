import Link from 'next/link';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import SearchInput from '../components/SearchInput';
import SiteNav from '../components/SiteNav';
import { PAGE_SIZE, pageCount, parsePage, sliceRange, toMatchQuery } from '../../lib/browse';
import { allTopicsQuery, postsPageQuery, searchPostsQuery, topicBySlugQuery } from '../../lib/queries';
import { sanityFetch } from '../../lib/sanity/fetch';

// Search depends on user input, so each query URL renders per-request and is
// then edge-cached for `revalidate` seconds — repeat searches cost nothing.
export const revalidate = 60;

export const metadata = {
  title: 'Blog — aiwar.dev',
  description:
    'Longer write-ups: payments backends, human-state AI research, faceless YouTube pipelines, and the tools that survived contact with real work.',
};

export default async function BlogPage({ searchParams }) {
  const sp = await searchParams;
  const q = (sp?.q ?? '').trim();
  const topicSlug = (sp?.topic ?? '').trim();
  const page = parsePage(sp?.page);
  const match = toMatchQuery(q);

  const topics = await sanityFetch({ query: allTopicsQuery, tags: ['content'] });

  let topicId = null;
  let topicDoc = null;
  if (topicSlug) {
    topicDoc = await sanityFetch({
      query: topicBySlugQuery,
      params: { slug: topicSlug },
      tags: ['content'],
    });
    topicId = topicDoc?._id ?? null;
  }

  const { start, end } = sliceRange(page, PAGE_SIZE);
  const res = await sanityFetch({
    query: match ? searchPostsQuery : postsPageQuery,
    params: { q: match, topic: topicId, start, end },
    tags: ['content'],
  });

  const posts = res?.posts ?? [];
  const total = res?.total ?? 0;
  const pages = pageCount(total, PAGE_SIZE);

  const hrefFor = (opts) => {
    const usp = new URLSearchParams();
    if (q) usp.set('q', q);
    const t = opts.topic ?? topicSlug;
    if (t) usp.set('topic', t);
    if (opts.page && opts.page > 1) usp.set('page', String(opts.page));
    const s = usp.toString();
    return s ? `/blog?${s}` : '/blog';
  };

  return (
    <main>
      <SiteNav current="/blog" />

      <section className="page-head">
        <div className="wrap">
          <p className="eyebrow rise">taped to the left of the desk</p>
          <h1 className="h-hand rise">Blog</h1>
          <p className="note-text rise" style={{ maxWidth: '58ch' }}>
            The things that needed more than a Telegram post. Written after the work, not instead of
            it.
          </p>

          <div className="rise" style={{ marginTop: '1.6rem' }}>
            <SearchInput defaultValue={q} topic={topicSlug} />
          </div>

          {topics.length ? (
            <div className="chips rise">
              <Link className={`chip${topicSlug ? '' : ' chip--on'}`} href={hrefFor({ topic: '', page: 1 })}>
                Everything
              </Link>
              {topics.map((t) => (
                <Link
                  key={t.slug}
                  className={`chip${topicSlug === t.slug ? ' chip--on' : ''}`}
                  href={hrefFor({ topic: t.slug, page: 1 })}
                >
                  {t.title} <span>{t.count}</span>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <div className="tear" aria-hidden="true" />

      <section>
        <div className="wrap">
          {q || topicDoc ? (
            <p className="result-line">
              {total} {total === 1 ? 'post' : 'posts'}
              {q ? ` matching “${q}”` : ''}
              {topicDoc ? ` in ${topicDoc.title}` : ''}
            </p>
          ) : null}

          {posts.length === 0 ? (
            <div className="ph">
              {q
                ? 'Nothing matched that. Try a shorter word — search matches title, excerpt and body.'
                : 'No posts yet. The first one is being written.'}
              <em>Posts are written in the Studio and appear here on publish.</em>
            </div>
          ) : (
            <div className="cards">
              {posts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          )}

          {pages > 1 ? (
            <nav className="pager" aria-label="Pagination">
              {page > 1 ? <Link href={hrefFor({ page: page - 1 })}>← Newer</Link> : <span />}
              <span className="pager-mid">
                Page {page} of {pages}
              </span>
              {page < pages ? <Link href={hrefFor({ page: page + 1 })}>Older →</Link> : <span />}
            </nav>
          ) : null}
        </div>
      </section>

      <Footer topics={topics} />
    </main>
  );
}
