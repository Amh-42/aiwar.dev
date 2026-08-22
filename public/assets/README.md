# Assets

Drop real images here and swap out the dashed placeholders in `app/page.js`.

| File | Where it goes | Notes |
|---|---|---|
| `desk.png` | the "What it actually looks like" section | The one illustration slot. Transparent PNG or WebP works best against the paper. |

To swap a placeholder, replace the `<div className="ph">…</div>` with:

```jsx
<img src="/assets/desk.png" alt="Anwar's desk" style={{ width: '100%', height: 'auto' }} />
```

Anything you add here is served from `/assets/<filename>`.

Ideas for later, matching the reference board: a cut-out portrait to peek through the AIWAR
letterforms, scanned real sticky notes, a photo of actual handwriting.
