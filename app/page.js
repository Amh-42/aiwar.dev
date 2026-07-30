import Reveal from './Reveal';

/* Hand-drawn arrow, reused at four angles around the hero. */
function Arrow({ d }) {
  return (
    <svg viewBox="0 0 74 46" aria-hidden="true">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const VENTURES = [
  {
    tone: '',
    pin: '',
    title: 'Chapa',
    role: 'payments backend',
    body:
      'Go, mostly. Card-to-card, gift cards, and a webhook dispatcher that has to be right every single time. Money is unforgiving code. Nobody notices it working.',
    meta: 'day job · addis ababa',
  },
  {
    tone: 'note--blue',
    pin: 'pin--blue',
    title: 'Synheart',
    role: 'AI research + system design',
    body:
      'Teaching machines to read human state from a heartbeat. Half research, half wrestling sensors into telling the truth. The wrestling is most of it.',
    meta: 'the other day job',
  },
  {
    tone: 'note--white',
    pin: '',
    title: 'Anipreneur',
    role: 'faceless youtube',
    body:
      'Self-improvement ideas explained through anime characters. No face, no camera. The whole pipeline is code, which is the only reason I can run it alone.',
    meta: 'my own thing',
  },
  {
    tone: '',
    pin: 'pin--blue',
    title: 'Inlinkai',
    role: 'AI agency',
    body:
      'Support automation for B2B SaaS. Started as "I can build that", turned into an actual offer. Currently the most business-shaped of everything here.',
    meta: 'the agency',
  },
];

const SIDE = [
  { title: 'aiwar.dev', body: 'A bot that reads AI news so I do not have to, summarises it, and posts it. Named before I had a website.' },
  { title: 'fact.et / forbes.et', body: 'Two Ethiopian business publications. Editorial systems, not just a blog with a nice header.' },
  { title: 'medco', body: 'A fraud-scoring API for health insurance claims. Naive Bayes, unglamorous, works.' },
  { title: 'a second brain', body: 'A wiki that documents itself. Every session writes what changed. Slightly cursed, extremely useful.' },
];

export default function Page() {
  return (
    <>
      <Reveal />

      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <div className="hero-inner">
          <div className="annot annot--tl">
            <b>Payments</b>
            Go backends, webhooks, the boring reliable kind
            <Arrow d="M66 40 C 44 34, 22 26, 6 6 M6 6 L 20 10 M6 6 L 9 21" />
          </div>

          <div className="annot annot--tr">
            <b>Research</b>
            human state, heart signals, stubborn sensors
            <Arrow d="M8 40 C 30 34, 52 26, 68 6 M68 6 L 54 10 M68 6 L 65 21" />
          </div>

          <h1 className="lockup">
            <span className="lockup-l1">AI</span>
            <span className="lockup-l2">WAR</span>
            <span className="dot" aria-hidden="true" />
          </h1>

          <p className="hero-sub">
            Anwar Misbah. I build in four directions at once and I am working on that.
          </p>

          <div className="annot annot--bl">
            <Arrow d="M8 6 C 26 14, 46 22, 66 40 M66 40 L 52 37 M66 40 L 62 26" />
            <b>Anime, sort of</b>
            a youtube channel with no face in it
          </div>

          <div className="annot annot--br">
            <Arrow d="M66 6 C 48 14, 28 22, 8 40 M8 40 L 22 37 M8 40 L 12 26" />
            <b>Agency</b>
            AI support that answers before I wake up
          </div>

          {/* Two notes pinned to the wall, each on its own thread. The signature. */}
          <aside className="hero-note hero-note--a">
            <svg className="string" viewBox="0 0 96 78" aria-hidden="true">
              <path d="M4 8 C 34 4, 62 26, 92 66" />
            </svg>
            <span className="pin" aria-hidden="true" />
            <h2>Two jobs</h2>
            <p>One moves money. One reads heartbeats. Same week, same laptop.</p>
          </aside>

          <aside className="hero-note hero-note--b">
            <svg className="string" viewBox="0 0 96 78" aria-hidden="true">
              <path d="M4 8 C 34 4, 62 26, 92 66" />
            </svg>
            <span className="pin pin--blue" aria-hidden="true" />
            <h2>Two of my own</h2>
            <p>A channel with no face in it, and an agency that runs while I sleep.</p>
          </aside>

          <a className="hero-scroll" href="#ventures">
            the whole board
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <div className="tear" aria-hidden="true" />

      {/* ---------------- VENTURES ---------------- */}
      <section id="ventures">
        <div className="wrap">
          <p className="eyebrow rise">pinned to the wall</p>
          <h2 className="h-hand rise">Four things at once</h2>
          <p className="note-text rise" style={{ maxWidth: '58ch', fontSize: '1.1rem' }}>
            Two jobs and two of my own. People keep asking how they connect. They connect more than
            they should, which is the red string.
          </p>

          <div className="board">
            {/* thread between the cards */}
            <svg className="thread-layer" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
              <path d="M125 42 C 300 130, 420 -10, 620 60" />
              <path d="M620 60 C 760 120, 830 20, 875 46" />
            </svg>

            {VENTURES.map((v) => (
              <article className={`note rise ${v.tone}`} key={v.title}>
                <span className={`pin ${v.pin}`} aria-hidden="true" />
                <h3>{v.title}</h3>
                <p>{v.body}</p>
                <span className="meta">{v.role} — {v.meta}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="tear" aria-hidden="true" />

      {/* ---------------- ILLUSTRATION SLOT ---------------- */}
      <section id="desk">
        <div className="wrap">
          <p className="eyebrow rise">the desk, roughly</p>
          <h2 className="h-hand rise">What it actually looks like</h2>

          <div className="rise" style={{ marginTop: '2rem' }}>
            <div className="ph">
              Drop the desk illustration here
              <em>public/assets/desk.png — replace the .ph div in app/page.js with an &lt;img&gt;</em>
            </div>
          </div>
        </div>
      </section>

      <div className="tear" aria-hidden="true" />

      {/* ---------------- SIDE PROJECTS ---------------- */}
      <section id="side">
        <div className="wrap">
          <p className="eyebrow rise">taped up next to it</p>
          <h2 className="h-hand rise">And the rest of it</h2>
          <p className="note-text rise" style={{ maxWidth: '56ch', fontSize: '1.1rem' }}>
            Smaller things. Some earn money, some earned a lesson, all of them shipped.
          </p>

          <div className="cards">
            {SIDE.map((s) => (
              <article className="card rise" key={s.title}>
                <span className="tape" aria-hidden="true" />
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="tear" aria-hidden="true" />

      {/* ---------------- CHANNEL ---------------- */}
      <section id="channel">
        <div className="wrap">
          <div className="channel rise">
            <span className="pin pin--l" aria-hidden="true" />
            <span className="pin pin--r pin--blue" aria-hidden="true" />
            <h2>Saved Messages, out loud</h2>
            <p>
              I spent years sending every half-thought to Saved Messages. Thousands of messages,
              zero replies, very healthy. Now they go on a Telegram channel instead, four or five
              times a day, mostly about whatever broke that morning.
            </p>
            <a className="btn" href="https://t.me/aiwar_dev" target="_blank" rel="noopener noreferrer">
              Read @aiwar_dev
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer>
        <div className="wrap">
          <nav className="links">
            <a href="https://t.me/aiwar_dev" target="_blank" rel="noopener noreferrer">Telegram</a>
            <a href="https://github.com/Amh-42" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="mailto:anwarandalus@gmail.com">Email</a>
          </nav>
          <p className="sig">— Anwar</p>
          <p className="colophon">
            aiwar.dev · built on a wall of sticky notes · Addis Ababa
          </p>
        </div>
      </footer>
    </>
  );
}
