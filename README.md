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

## Layout

- Phones (under 860px wide): the original mobile design with a sticky Directions / WhatsApp bar.
- Desktop and large tablets (860px and up): full-width sections, top nav, two-column hero, wider product grids.

## Deploy to Vercel

Plain static files, no build step. `vercel.json` is included.

1. In Vercel, click **Add New → Project** and import `Nevinlahenriquez/colonyfoodmart`.
2. Framework preset: **Other**. Leave the build command and output directory empty. Root directory: `./`.
3. Click **Deploy**.

The route video page is served at `/how-to-find-us`.
