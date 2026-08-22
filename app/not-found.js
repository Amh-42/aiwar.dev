import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="hero">
      <div className="hero-inner" style={{ textAlign: 'center' }}>
        <h1 className="lockup">
          <span className="lockup-l1">404</span>
        </h1>
        <p className="hero-sub">
          Nothing pinned here. Somebody took the note down.
        </p>
        <p style={{ marginTop: '2rem' }}>
          <Link className="btn" href="/">
            Back to the wall
          </Link>
        </p>
      </div>
    </section>
  );
}
