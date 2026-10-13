# Current State

Updated 2026-10-13 (v2.4). Made by Electric Mustard.

## Stack

| Piece | Version / detail |
| --- | --- |
| Astro | 7.3 (static output, `ClientRouter` page transitions) |
| Sanity Studio | 6.18, embedded at `/admin` via `@sanity/astro` 3.5 (hash routing because output is static) |
| GSAP | 3.15 (Observer, CustomEase, ScrollTrigger — all free) |
| Node | 22.12 or newer |
| Hosting | Vercel (static). Not yet connected. |
| Code | Not yet on GitHub. Use Stacki → branch chip → Publish to GitHub. |
| Sanity project | Created 2026-10-13: project `z3603j0f`, dataset `production`, seeded with the five sample projects. Studio at `/admin`; CORS allows `http://localhost:4321`. Todd's `.env` holds the Project ID and a seed token (never committed). |

## Languages

English at `/`, Norwegian at `/no/`. Every text field in Sanity is a pair (English required, Norwegian optional — falls back to English). The site's own labels (Client, Year, About, Impact, Next project, Close…) live in `src/lib/i18n.ts`. The EN / NO links in the header switch language for the current page and remember the choice; a later visit to `/` jumps to `/no/` if Norwegian was chosen. Blocks receive plain one-language strings from `getSite(lang)` and a `lang` prop for their own labels and links; they never see translations. Thin files in `src/pages/` and `src/pages/no/` render the shared templates in `src/templates/`.

## Pages

| Route | File | Notes |
| --- | --- | --- |
| `/`, `/no/` | `src/pages/index.astro`, `src/pages/no/index.astro` → `src/templates/HomePage.astro` | HomeSlider with all projects in Studio order |
| `/work/<slug>/`, `/no/work/<slug>/` | `src/pages/work/[slug].astro`, `src/pages/no/work/[slug].astro` → `src/templates/ProjectPage.astro` | One per project and language, built at deploy time |
| `/specimen/` | `src/pages/specimen.astro` | Every block with sample content (English); design reference only |
| `/admin/` | (generated) | Sanity Studio, only when a Project ID is set |

## Blocks

| Block | Schema | Client fields | Presets |
| --- | --- | --- | --- |
| HomeSlider | `homeSlider` (inside Site) | Projects (ordered references) | Autoplay: Off / 5 s / 8 s |
| ProjectHero | `projectHero` | Eyebrow, Client, Year, Hero Image | Padding, Background |
| ProjectAbout | `projectAbout` | Heading, Body (plain text, blank line = new paragraph), Credits | Padding, Background |
| ProjectImpact | `projectImpact` | Heading, Items (Value, Label, Note) | Padding, Background |
| ProjectGallery | `projectGallery` | Images | Layout: Full / Alternating / Two up; Padding, Background |
| ProjectNav | — (system) | — | — |
| SiteHeader | — (system) | — | — |

## Sanity documents

- **Site** (single document `siteSettings`): Site Name, Description (EN/NO), Contact Email (mail icon on home), Home Slider.
- **Project**: Title (EN/NO), Web Address (slug, from the English title), Cover Image, then the four page sections above.
- Shared objects: `localeString` / `localeText` (English + Norsk pair), `imageWithAlt` (image with hotspot + Alt Text pair).
- Plain, untranslated fields on purpose: client name, year, credits, impact values, site name, email.

## Behaviour worth knowing

- Home: click anywhere on the slide (or press Enter) to open the active project. Other titles jump the slider to them. Scroll wheel / trackpad, swipe, arrow keys and the buttons all step the slider.
- Project pages are sheets: opening one (from home or from "Next project") slides it up over the page beneath, which settles back a touch. Closing (×, logo, Close, or the **Esc** key) slides it down again to reveal home on the same slide. Native view transitions; a plain swap in browsers without them.
- Motion language (`src/lib/reveal.ts`, GSAP SplitText + ScrollTrigger): text enters one line at a time, each line sliding up out of its own mask; images **blur-load** (once the picture has loaded it comes up from a soft blur with a slight rise; fade ≈0.4s, blur ≈0.7s); lists wipe up. No fades anywhere, no hover movement. Above the fold plays on load (after the sheet lands), the rest as it scrolls into view. The Impact block has no entrance animation by design.
- Fixed 2026-10-13: `--duration-reveal` was being read as `0.9s` and divided by 1000 twice, so every reveal ran in ~1ms. Durations now parse `ms` and `s` correctly. Also: image frames hide with `opacity`, not `visibility`, so lazy images inside them still load.
- Sheet: opens in `--duration-page` 680ms on `--ease-page`; closes in `--duration-page-back` 720ms on `--ease-page-back` (a fuller in-out curve). A subtle `--sheet-shadow` sits under it while it slides. Text starts 0.4s after a transition so the two motions don't overlap. Reveals `--duration-reveal` 900ms.
- Impact cards follow the Collins layout and size: heading at `--text-xl`, value at `--text-2xl` top-left, label and note (`--text-lg`) at the foot, 22.5rem × 29.5rem white cards (360 × 472 at 1440), 24px apart.
- Icons are pixel icons from pixelarticons.com (mail, close, arrows), sized by `--icon-size`, resting at `--icon-dim` opacity and solid on hover. No circles around buttons.
- Next-project section: "Next project" eyebrow, big next title with its cover thumb (one link), and a Close link beneath — on the outer edge, in line with the images.
- About block: the label sits on its own row; heading (left) and body (right) start on the same line beneath it.
- Home slider sizing follows the Osmo original: title at `--text-2xl` (4em), 20rem cover card hanging 30% off the bottom edge, controls at `--edge` (same as the page gutter, so they line up with project pages).
- Header top right on home: EN / NO links and the mail icon (scales slightly on hover; opens an email to the Contact Email in Site settings); close button on project pages. No other hover movement anywhere.
- Home slider: the bottom band (Site Name left, arrows right) is the same height as the header band at the top, plus `--space-3` extra below.
- Section padding presets are tighter (`--pad-lg` ≈ 112px at 1440) to sit closer to Collins' rhythm.
- Columns: `.container` = outer edge (`--gutter`, images); `.container.inset` = text columns (`--gutter + --inset`, 0 inset on phones). Hero and About split 1 : 1.9 like Collins.
- Project pages are all light grey (`--color-light-bg: #f8f8f7`, copied from wearecollins.com). Every project block defaults to the Light background; Dark and Accent remain available as presets.
- Layout copies the Collins content column: `--gutter` ≈ 8.4vw each side (1244px wide at 1496), text columns indented a further `--inset` ≈ 8.4vw.
- Impact row: GSAP Draggable + Inertia swiper — finger or mouse drag, flick glides and settles on a card, horizontal trackpad scroll, arrow keys when focused. Vertical page scroll is never hijacked (`touch-action: pan-y`, `allowNativeTouchScrolling`). No pinning, no entrance animation.
- Header flips to dark over Light / Accent blocks, light over Dark.
- Phones (≤767px): `--gutter` 1.25rem, no inset, section padding roughly halved, header 4rem. Hero and gallery images run edge to edge (`.container.flush-phone`). Hero order is eyebrow → title → client/year. On the home slider the site name is hidden and the counter sits under the title (the cover card hangs where they would be); the progress bar is 3em.
- Impact cards: 23rem tall on phones, 27rem on desktop.
- Fonts: system Helvetica stack from tokens. No web font loaded yet — change `--font-sans` in `tokens.css`.

## Not done yet

- GitHub repo, Vercel project and deploy hook (steps in README.md). Add the production URL to Sanity CORS origins when it exists.
- Web font, if wanted.
- Any page other than home and project (no about or contact page in scope).
