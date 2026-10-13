# Colony Food Market website

A static website for Colony Food Market (Seroe Colorado 1525, Aruba), exported from Claude Design.

- `index.html`: the main site (ENG / ESP / NED)
- `how-to-find-us.html`: the animated route video on its own page
- `assets/`: photos, logo, promo video
- `support.js`, `image-slot.js`, `*.jsx`: the page runtime (loads React from unpkg.com at runtime)
- `.image-slots.state.json`: the photo choices and cropping for the image slots. Deploy it with the site.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Open the page over HTTP, not by double-clicking the file, so the scripts and photo data load.

## Hosting

It is plain static files with no build step. Any static host works (Vercel, Netlify, GitHub Pages, Cloudflare Pages). Point it at the repo root.
