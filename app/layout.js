import { Anton, Caveat, Architects_Daughter, Courier_Prime } from 'next/font/google';
import Reveal from './Reveal';
import './globals.css';

// Display — heavy condensed grotesque, gets an ink-texture mask in CSS.
const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--f-display',
  display: 'swap',
});

// The main hand. Headings, pull quotes, anything "written on the wall".
const caveat = Caveat({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--f-hand',
  display: 'swap',
});

// The second hand — a drafting pen. Annotations, arrow labels, margin notes.
const architects = Architects_Daughter({
  weight: '400',
  subsets: ['latin'],
  variable: '--f-note',
  display: 'swap',
});

// Typewriter. Body copy and labels — the "typed on paper" register.
const courier = Courier_Prime({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--f-type',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://aiwar.dev'),
  title: 'Anwar Misbah — aiwar.dev',
  description:
    'Payments backend at Chapa, human-state AI research at Synheart, a faceless YouTube channel, and an AI agency. One person, several ventures, too many tabs.',
  openGraph: {
    title: 'Anwar Misbah — aiwar.dev',
    description:
      'Payments backend, human-state AI research, a faceless YouTube channel, and an AI agency. One person, several ventures.',
    url: 'https://aiwar.dev',
    siteName: 'aiwar.dev',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport = {
  themeColor: '#c9c6c0',
};

export default function RootLayout({ children }) {
  const cls = [anton.variable, caveat.variable, architects.variable, courier.variable].join(' ');

  return (
    <html lang="en" className={cls}>
      <body>
        {/* Paper grain + spotlight + vignette. Fixed so the whole scroll keeps the same wall. */}
        <div className="wall" aria-hidden="true">
          <div className="wall-grid" />
          <div className="wall-light" />
          <div className="wall-grain" />
          <div className="wall-vignette" />
        </div>
        <Reveal />
        {children}
      </body>
    </html>
  );
}
