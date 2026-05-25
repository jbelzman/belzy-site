# belzy.net

Personal portfolio for Josh Belzman — Director of Analytics, Publicis Media.
Built with [Astro](https://astro.build), deployed on Netlify.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # generates dist/
npm run preview  # serves the built site
```

Node 20 or newer.

## Deploying to Netlify

### First-time setup

1. **Push to GitHub.** Create a new private repo (e.g. `belzy-site`) and push this folder to `main`.
2. **Connect to Netlify.**
   - Netlify → Add new site → Import an existing project → GitHub → pick the repo.
   - Build command: `npm run build` (auto-detected)
   - Publish directory: `dist` (auto-detected)
   - Click Deploy. First build runs in ~30 seconds.
3. **Verify the temporary URL works** (something like `random-name-12345.netlify.app`).

### Point belzy.net at Netlify

DNS is currently at Squarespace. Two ways to do this:

**Option A (simpler) — change nameservers to Netlify:**
- In Squarespace domain settings, switch nameservers to Netlify's.
- Netlify auto-creates the DNS records and provisions an SSL cert.

**Option B (keep DNS at Squarespace) — add records manually:**
- `CNAME` `www` → `your-site-name.netlify.app`
- `A` `@` (apex) → `75.2.60.5` (Netlify's anycast)
- Then in Netlify → Domain settings, add `belzy.net` and `www.belzy.net` and let Netlify provision Let's Encrypt SSL (couple of minutes).

After DNS propagates, the contact form will start working — Netlify auto-detects forms in static HTML and there's no extra config needed.

### Old Squarespace URLs

`public/_redirects` already handles the most likely legacy URLs (`/welcome-2`, `/experience`, `/testimonials`, etc.). Add more there if any old links break.

## Updating content

### Editing case studies

Each case study is a single Markdown file in `src/content/work/`. Frontmatter at the top sets the metadata (client, role, years, tools, images); body below is the prose. Edit the file, commit, push — Netlify rebuilds automatically.

Schema is enforced by `src/content/config.ts`. If you add a new field, update both.

### Swapping dashboard screenshots

Drop replacement PNGs into `public/images/work/` with the same filenames (`dicks-hero.png`, `lilly-creative.png`, etc.) and they take over automatically.

For new images, add the filename to the relevant Markdown file's `heroImage` or `images:` array.

### Updating the resume page

The resume page (`src/pages/resume.astro`) is hand-coded for full styling control. To update:
- Edit the Astro file directly (the role data is inline).
- Drop a new `Josh_Belzman_Resume.pdf` into `public/` for the download button.

### Updating the home page copy

`src/pages/index.astro` — hero, about, stack, pull quote, CTA all live there.

## Project structure

```
src/
  components/     LightboxImage, WorkCard, Lightbox (native <dialog>)
  content/work/   Markdown case studies (one file per study)
  layouts/Base.astro    Shell: head, nav, footer, SEO, JSON-LD
  pages/          One file per route; [slug].astro = dynamic case study route
  styles/global.css     Design tokens, type system, base styles
public/
  images/work/    Dashboard PNGs
  Josh_Belzman_Resume.pdf      Linked from /resume
  Josh_Belzman_Portfolio.pdf   Linked from /work
  _redirects      Old Squarespace URL redirects
  og.png          1200×630 social share image
  favicon.svg     JOSH-logo favicon
astro.config.mjs  Site URL, sitemap integration
netlify.toml      Build config + cache headers
```

## Design system (TL;DR)

- **Type**: Inter (body/UI), IBM Plex Mono (eyebrows, KPIs, metadata), IBM Plex Serif (one pull quote).
- **Color**: near-black canvas `#0B0F1A`, JOSH-logo blue `#1E5BD8` for accent, restrained red `#E63946` for the underline swoosh.
- **Spacing**: 8pt grid (`--s-1` through `--s-10` in `global.css`).
- **Lightbox**: native HTML `<dialog>` — no library, ~40 lines of vanilla JS. Click outside or hit Esc to close.

Change colors and spacing in `:root` at the top of `src/styles/global.css` — the whole site reflows.
