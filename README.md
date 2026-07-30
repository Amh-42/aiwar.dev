# aiwar.dev

Anwar Misbah's personal site. A studio wall: paper, pins, red thread, handwriting.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site into out/
```

`output: 'export'` — the build is plain HTML/CSS/JS in `out/`. No server, no runtime cost.
Deploy `out/` to GitHub Pages, Vercel, Netlify, anywhere.

## Deliberately minimal

Only `next`, `react`, `react-dom`. No Tailwind, no animation library, no UI kit.

- **Texture is generated, not downloaded.** Paper grain, ink texture, and the torn dividers are
  SVG `feTurbulence` inlined in CSS. No image files for the surface, nothing to optimise.
- **One client component** (`app/Reveal.js`) — a single IntersectionObserver for scroll reveals.
  Everything else is static HTML.
- **~103 kB** first load, most of which is React itself.

## Files

```
app/
  layout.js      fonts, metadata, the fixed wall (grid + spotlight + grain + vignette)
  page.js        all page content and copy
  globals.css    the whole design system
  Reveal.js      scroll reveal
  not-found.js   404
public/assets/   drop images here — see the README in there
_legacy/         the previous single-file site, kept for reference
```

## Type

Four faces, each with one job:

- **Anton** — the AIWAR lockup, with an ink texture masked through it
- **Caveat** — the main hand. Headings, note titles
- **Architects Daughter** — the second hand. Annotations and margin notes
- **Courier Prime** — typewriter. Body copy and small labels

## Editing copy

All of it is in `app/page.js` — the `VENTURES` and `SIDE` arrays, plus the hero and section
text. No CMS, no markdown pipeline. Change the strings.

## Accessibility

Keyboard focus is visible, `prefers-reduced-motion` disables reveals and the bobbing arrow,
decorative pins/threads/arrows are `aria-hidden`.
