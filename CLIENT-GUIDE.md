# Colony Food Market website: owner's guide

Your website is live on Vercel. This guide covers the few things you may want to do yourself.

## 1. Your web address

The site is set up for **https://colonyfoodmart.vercel.app**.

If Vercel gave the project a different address, or you add your own domain (for example `colonyfoodmart.com`):

1. In Vercel, open the project, then **Settings → Domains**, add the domain and follow the DNS steps shown.
2. Ask your developer to replace `https://colonyfoodmart.vercel.app` with the new address in these files (a simple find-and-replace):
   `index.html`, `how-to-find-us.html`, `robots.txt`, `sitemap.xml`.

This matters for Google and for the preview shown when the link is shared on WhatsApp and Facebook.

## 2. Get found on Google (do this once, about 15 minutes)

1. **Google Business Profile** (the most important step for a local shop): go to https://business.google.com, claim or create "Colony Food Market", and set:
   - Address: Seroe Colorado 1525, San Nicolas, Aruba
   - Hours: Monday to Sunday, 11:00 to 20:00
   - Phone: +297 748 3926
   - Website: your site address
   - Add photos of the sign, shelves and fridges.
2. **Google Search Console**: go to https://search.google.com/search-console, add your site address, verify it (choose the "HTML tag" or "Domain" method, or ask your developer), then open **Sitemaps** and submit `sitemap.xml`.
3. Ask happy customers to leave a Google review. Reviews help you show up in "mini market near Baby Beach" searches.

## 3. Things that are already set up

- Works on phones, tablets and computers.
- English, Spanish and Dutch. The site picks the visitor's phone language automatically and remembers their choice.
- Google search basics: page titles and descriptions, store details for Google (address, hours, phone, map location), sitemap, robots file.
- Share preview image for WhatsApp, Facebook and X.
- "Open now / Closed now" badge, calculated in Aruba time from your opening hours.
- Buttons for directions (Google Maps), WhatsApp and phone calls, plus an embedded map.
- The route video page: `/how-to-find-us`. Share this link with customers who ask how to get there.
- Home screen icon when someone saves the site on their phone.

## 4. Changing details

Ask your developer to change any of the following. Each is one line in `index.html`:

| What | Current value | Where |
|---|---|---|
| Phone / WhatsApp | +297 748 3926 | `"phone"` setting near the bottom of `index.html` |
| Opening hours | 11:00 – 20:00 | `"hoursWeek"` setting near the bottom of `index.html` |
| Map location | C49C+67J San Nicolas Aruba | `"mapsQuery"` setting |
| Texts in each language | | the `en:`, `es:` and `nl:` blocks |
| Reviews shown | 3 Google reviews | the `REVIEWS` list |

If the hours or phone number change, also update them in the store details block at the top of `index.html` (search for `openingHoursSpecification` and `telephone`), and in your Google Business Profile.

**Photos:** to swap a photo, replace the file in the `assets` folder with a new one of the same name (JPG, roughly 1200px wide is plenty).

Every change pushed to GitHub goes live on Vercel automatically within about a minute.

## 5. Optional extras

- **Visitor statistics:** in Vercel, open the project, click **Analytics** and enable Web Analytics. Your developer then adds one line to the pages.
- **Social media links:** send your Facebook, Instagram or TikTok page links to your developer to add them to the site and to Google.
