// Every link the site knows about, in one place. The footer renders all of it;
// the nav renders a slice. Adding something here puts it everywhere at once.

export const SOCIALS = [
  { label: 'Telegram — @aiwar_dev', href: 'https://t.me/aiwar_dev', note: '4–5 posts a day' },
  { label: 'GitHub — Amh-42', href: 'https://github.com/Amh-42', note: 'the repos' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/anwar-misbah/', note: 'the professional face' },
  { label: 'YouTube — Anipreneur', href: 'https://www.youtube.com/@anipreneur', note: 'no face in it' },
  { label: 'Email', href: 'mailto:anwarandalus@gmail.com', note: 'replies land here' },
];

export const VENTURES = [
  { label: 'Chapa', href: 'https://chapa.co', note: 'payments backend · Go' },
  { label: 'Synheart', href: 'https://synheart.com', note: 'human-state AI research' },
  { label: 'Anipreneur', href: 'https://www.youtube.com/@anipreneur', note: 'faceless YouTube' },
  { label: 'Inlink AI', href: 'https://inlink.ai', note: 'AI support agency' },
];

export const SHIPPED = [
  { label: 'fact.et', href: 'https://fact.et', note: 'Ethiopian news, editorial system' },
  { label: 'forbes.et', href: 'https://forbes.et', note: 'Ethiopian business publication' },
  { label: 'aiwar bot', href: 'https://t.me/aiwar_dev', note: 'reads AI news so I do not' },
  { label: 'LifeUp', href: 'https://github.com/Amh-42', note: 'habit engine, half-finished' },
  { label: 'work.et', href: 'https://github.com/Amh-42', note: 'jobs, Ethiopian market' },
  { label: 'tgmoji', href: 'https://github.com/Amh-42', note: 'small, silly, useful' },
];

export const NEWSLETTER_LINKS = [
  { label: 'What you get', href: '/newsletter#what', note: 'the fixed format' },
  { label: 'Past issues', href: '/newsletter', note: 'read before you join' },
  { label: 'Why weekly', href: '/newsletter#why', note: 'and why not daily' },
];

export const WRITING_LINKS = [
  { label: 'All posts', href: '/blog', note: 'longer than a Telegram post' },
  { label: 'Search the archive', href: '/blog?q=', note: 'title, excerpt, body' },
];

export const NAV = [
  { label: 'Newsletter', href: '/newsletter' },
  { label: 'Blog', href: '/blog' },
  { label: 'Work', href: '/#ventures' },
  { label: 'Telegram', href: 'https://t.me/aiwar_dev' },
];

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aiwar.dev';
