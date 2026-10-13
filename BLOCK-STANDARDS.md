# Block Standards

Version 1.3 — 2026-10-13. Made by Electric Mustard.

The rules every block in this site follows. If a block breaks one of these, it is not done.

## The split

- Electric Mustard owns design, global styles and the block library.
- The client owns content, edited in Sanity Studio at `/admin`.
- Nothing a client can do in Sanity may break the design.

## Tokens

- All colours, type sizes, spacing, radius, motion and button styles live in `src/styles/tokens.css`.
- Blocks use tokens only (`var(--…)`). No hard-coded colours, sizes or fonts inside a block.
- Preset classes (`pad-*`, `bg-*`) are defined once in `src/styles/global.css`.

## Every block

1. **Two files, same name.** `src/components/Name.astro` and `src/sanity/schemaTypes/name.ts`
   (component in PascalCase, schema in camelCase). A header comment in each points to the other.
2. **Scoped styles.** All CSS lives in the component's `<style>` block. Astro scopes it automatically.
3. **Locked client fields.** Text, images (with required alt text) and named presets only.
   No free colour, font, size or spacing controls. Presets are radio lists with Title Case labels.
   Any text a visitor reads is a `localeString` or `localeText` (English + Norsk); names, numbers,
   years and emails stay plain `string`. Blocks receive one language as plain strings from
   `getSite(lang)` plus a `lang` prop, and use `t(lang, key)` from `src/lib/i18n.ts` for their own labels.
4. **Standard options.** Every block has `padding` (None / Small / Medium / Large) and
   `background` (Dark / Light / Accent), added with `blockOptionFields()` from `blockOptions.ts`
   and applied with `blockClasses()` from `src/lib/block.ts`. They sit in an **Options** tab.
5. **Field labels** in Title Case, with a short plain `description` where the purpose is not obvious.
6. **Works on desktop and phone** before it is called done. Check at 1440 and 390 wide.
7. **On the specimen page.** Add every block (and each of its presets) to `src/pages/specimen.astro`.
8. **Version comment and mark.** First line of both files: `// Name — vX.Y — Made by Electric Mustard`.
9. **Scripts survive page transitions.** Any client script initialises on `astro:page-load`
   and cleans up on `astro:before-swap`. Never rely on `DOMContentLoaded`.
10. **Images** always carry `width`, `height`, `alt`, `loading` and `decoding`. Below-the-fold images are `loading="lazy"`.
11. **Motion comes from `src/lib/reveal.ts`, not from the block.** Mark text with `data-reveal` (masked single lines),
    figures with `data-reveal="image"` (blur load), anything else with `data-reveal="block"` (wipe up).
    Wrap a set in `data-reveal-group` to stagger it. Text never fades; images may carry a slight fade with their blur load.

## System blocks

`SiteHeader` and `ProjectNav` have no client-editable fields, so they have no schema. They still follow every other rule.

## Protecting client content

- Adding fields is safe.
- Never rename or remove a field that holds live content without Todd's yes, and an explanation of what would be lost.
- When a field must change, add the new one, migrate, then remove the old one in a later release.

## Delivery

- Complete, working code. No placeholders, no TODOs.
- Work on a branch. Preview link first. Publish only after Todd approves. Never push straight to live.
- Update `CURRENT-STATE.md` whenever something true changes.
