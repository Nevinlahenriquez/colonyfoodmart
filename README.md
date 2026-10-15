# Colony Food Market website

A static website for Colony Food Market (Seroe Colorado 1525, Aruba), exported from Claude Design.

- `index.html`: the main site (ENG / ESP / NED)
- `how-to-find-us.html`: the animated route video on its own page
- `assets/`: photos, logo, promo video
- `support.js`, `image-slot.js`: the page runtime
- `vendor/`: React 18.3.1, served from the site itself (no CDN dependency)
- `animations-v3.js`, `route-video.js`, `route-film.js`: the route animation, precompiled from `src/*.jsx`
- `.image-slots.state.json`: empty on purpose (photos are set with `src=` in the HTML)
- SEO: `robots.txt`, `sitemap.xml`, `site.webmanifest`, icons, Open Graph image (`assets/og-image.jpg`), JSON-LD store data in `index.html`
- `CLIENT-GUIDE.md`: hand-over notes for the store owner

The site URL `https://colonyfoodmart.vercel.app` is used in `index.html`, `how-to-find-us.html`, `robots.txt` and `sitemap.xml`. Replace it everywhere if the domain changes.

## Rebuilding the route animation

After editing a file in `src/`, recompile it (no install needed):

```sh
npm pack @babel/standalone@7.29.0 && tar xzf babel-standalone-7.29.0.tgz
node -e 'const B=require("./package/babel.min.js"),fs=require("fs");for(const f of ["animations-v3","route-video","route-film"]){fs.writeFileSync(f+".js","// Precompiled from src/"+f+".jsx (edit that file, then rebuild: see README)\n"+B.transform(fs.readFileSync("src/"+f+".jsx","utf8"),{filename:f+".jsx",presets:["react","typescript"]}).code+"\n")}'
rm -rf package babel-standalone-7.29.0.tgz
```

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

Plain static files, no build step. `vercel.json` sets clean URLs, caching and security headers.

1. In Vercel, click **Add New → Project** and import `Nevinlahenriquez/colonyfoodmart`.
2. Framework preset: **Other**. Leave the build command and output directory empty. Root directory: `./`.
3. Click **Deploy**.

The route video page is served at `/how-to-find-us`.
