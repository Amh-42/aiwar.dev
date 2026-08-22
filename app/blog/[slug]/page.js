import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '../../components/Footer';
import PostCard from '../../components/PostCard';
import Prose from '../../components/Prose';
import SiteNav from '../../components/SiteNav';
import SubscribeForm from '../../components/SubscribeForm';
import { formatDate } from '../../../lib/browse';
import { allTopicsQuery, postBySlugQuery, postSlugsQuery } from '../../../lib/queries';
import { sanityFetch } from '../../../lib/sanity/fetch';
import { freshClient } from '../../../lib/sanity/client';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await freshClient.fetch(postSlugsQuery);
  return (slugs || []).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await sanityFetch({ query: postBySlugQuery, params: { slug }, tags: ['content'] });
  if (!post) return {};
  return {
    title: `${post.title} — aiwar.dev`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: 'article' },
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const [post, topics] = await Promise.all([
    sanityFetch({ query: postBySlugQuery, params: { slug }, tags: ['content'] }),
    sanityFetch({ query: allTopicsQuery, tags: ['content'] }),
  ]);

  if (!post) notFound();

  return (
    <main>
      <SiteNav current="/blog" />

      <article className="page-head">
        <div className="wrap wrap--read">
          <p className="eyebrow rise">
            <Link href="/blog">← all posts</Link>
          </p>
          <h1 className="h-hand rise">{post.title}</h1>
          <p className="post-meta rise">
            {formatDate(post.publishedAt)}
            {post.topics?.length ? ' · ' : ''}
            {post.topics?.map((t, i) => (
              <span key={t.slug}>
                {i > 0 ? ', ' : ''}
                <Link href={`/blog?topic=${t.slug}`}>{t.title}</Link>
              </span>
            ))}
          </p>
          <p className="post-excerpt rise">{post.excerpt}</p>

          <div className="rise">
            <Prose value={post.body} />
          </div>
        </div>
      </article>

      <div className="tear" aria-hidden="true" />

      <section>
        <div className="wrap wrap--read">
          <div className="inline-sub">
            <span className="pin pin--blue" aria-hidden="true" />
            <h2>Get the weekly one</h2>
            <p>
              Five things I actually used, one deep cut, one thing to skip. Same register as this
              post, one email a week.
            </p>
            <SubscribeForm source="blog-post" cta="Join" compact />
          </div>
        </div>
      </section>

      {post.related?.length ? (
        <>
          <div className="tear" aria-hidden="true" />
          <section>
            <div className="wrap">
              <p className="eyebrow rise">next to it on the wall</p>
              <h2 className="h-hand rise">Related</h2>
              <div className="cards">
                {post.related.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          </section>
        </>
      ) : null}

      <Footer topics={topics} />
    </main>
  );
}
