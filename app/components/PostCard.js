import Link from 'next/link';
import { formatDate } from '../../lib/browse';

export default function PostCard({ post }) {
  return (
    <article className="card rise">
      <span className="tape" aria-hidden="true" />
      <p className="card-meta">
        {formatDate(post.publishedAt)}
        {post.topics?.length ? ` · ${post.topics.map((t) => t.title).join(', ')}` : ''}
      </p>
      <h3>
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>
      <p>{post.excerpt}</p>
      <Link className="card-more" href={`/blog/${post.slug}`}>
        Read it →
      </Link>
    </article>
  );
}
