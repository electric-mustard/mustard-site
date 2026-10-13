# Mustard Site

A portfolio site: Astro (pages and blocks), Sanity (content), GitHub (code), Vercel (hosting).
Opens in Stacki. Made by Electric Mustard.

## What it does

- **Home** — a full-screen slider, one slide per project (Osmo "Layered Image Slider").
- **Project page** — title → one big image → about → impact (scrolls sideways) → gallery → next / close.
- **App-like transitions** — the project title and cover image morph between the two pages.
- **Content** — the client edits projects in Sanity Studio at `/admin`. Design stays locked.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:4321. With no `.env` the site runs on the sample content in `src/data/seed.ts`.

## Connect Sanity

1. Create a project at https://www.sanity.io/manage (free plan is fine). Note the **Project ID**.
2. Copy `.env.example` to `.env` and fill in `PUBLIC_SANITY_PROJECT_ID`.
3. Restart `npm run dev`. The Studio is now at http://localhost:4321/admin.
4. In sanity.io/manage → API → CORS origins, add `http://localhost:4321` (allow credentials). The Studio prompts for this the first time.
5. Optional: load the sample projects into Sanity. Create an API token (API → Tokens, permission **Editor**), put it in `.env` as `SANITY_API_WRITE_TOKEN`, then run `npm run seed`.

Once a Project ID is set, the site reads from Sanity only. The sample data is still used by `/specimen`.

## Deploy to Vercel

The site is static. Add the two `PUBLIC_SANITY_*` variables in Vercel → Settings → Environment Variables.
To publish content changes automatically: Vercel → Settings → Git → Deploy Hooks → create one, then in
sanity.io/manage → API → Webhooks → add the hook URL (trigger on create, update, delete).
Add the production URL to Sanity CORS origins so `/admin` works on the live site.

## Automatic Norwegian

Publishing in the Studio triggers `/api/translate`, which fills empty Norwegian fields with Claude and saves them back. Vercel needs `ANTHROPIC_API_KEY` and `SANITY_API_WRITE_TOKEN`; Sanity needs a webhook pointing at `https://<your-site>/api/translate` with the filter `_type in ["project", "siteSettings"] && !(_id in path("drafts.**"))`, triggered on create and update.

## Where things live

| What | Where |
| --- | --- |
| Design tokens (colour, type, spacing, radius, motion, buttons) | `src/styles/tokens.css` |
| Global styles, block presets, page transitions | `src/styles/global.css` |
| Blocks (component + schema, same name) | `src/components/*.astro` + `src/sanity/schemaTypes/*.ts` |
| Page layout and header | `src/layouts/BaseLayout.astro`, `src/components/SiteHeader.astro` |
| Pages | `src/pages/index.astro`, `src/pages/work/[slug].astro`, `src/pages/specimen.astro` |
| Content loader (Sanity or sample) | `src/lib/sanity.ts` |
| Sample content | `src/data/seed.ts`, `public/seed/` |
| Studio config | `sanity.config.ts`, `src/sanity/structure.ts` |

See `BLOCK-STANDARDS.md` for the rules every block follows and `CURRENT-STATE.md` for what exists today.
