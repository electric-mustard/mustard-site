// Sanity seed — v1.2 — Made by Electric Mustard
// Loads the sample projects (src/data/seed.ts + public/seed images) into your
// Sanity dataset so the Studio is not empty on day one. Safe to re-run: it
// replaces the same documents each time.
//
//   npm run seed
//
// Needs PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.
import { createClient } from '@sanity/client';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { seedProjects, seedSite } from '../src/data/seed.ts';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error('Missing PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env');
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2026-10-01', useCdn: false });
const key = (prefix, i) => `${prefix}-${i}`;

async function uploadImage(pic) {
  const file = path.join('public', pic.src);
  const buffer = await readFile(file);
  const asset = await client.assets.upload('image', buffer, { filename: path.basename(file) });
  return { _type: 'imageWithAlt', asset: { _type: 'reference', _ref: asset._id }, alt: { _type: 'localeString', ...pic.alt } };
}

for (const p of seedProjects) {
  console.log(`→ ${p.title}`);
  const cover = await uploadImage(p.cover);
  const heroImage = p.hero ? await uploadImage(p.hero.image) : undefined;
  const galleryImages = p.gallery ? await Promise.all(p.gallery.images.map(uploadImage)) : [];

  const doc = {
    _id: `project-${p.slug}`,
    _type: 'project',
    title: { _type: 'localeString', ...p.title },
    slug: { _type: 'slug', current: p.slug },
    cover,
  };
  if (p.hero && heroImage) {
    doc.hero = {
      _type: 'projectHero',
      eyebrow: { _type: 'localeString', ...p.hero.eyebrow },
      client: p.hero.client,
      year: p.hero.year,
      image: heroImage,
      padding: p.hero.padding,
      background: p.hero.background,
    };
  }
  if (p.about) {
    doc.about = {
      _type: 'projectAbout',
      heading: { _type: 'localeString', ...p.about.heading },
      body: { _type: 'localeText', ...p.about.body },
      credits: p.about.credits,
      padding: p.about.padding,
      background: p.about.background,
    };
  }
  if (p.impact) {
    doc.impact = {
      _type: 'projectImpact',
      heading: { _type: 'localeString', ...p.impact.heading },
      items: p.impact.items.map((item, i) => ({
        _type: 'impactItem',
        _key: key('impact', i),
        value: item.value,
        label: { _type: 'localeString', ...item.label },
        note: item.note ? { _type: 'localeText', ...item.note } : undefined,
      })),
      padding: p.impact.padding,
      background: p.impact.background,
    };
  }
  if (p.gallery) {
    doc.gallery = {
      _type: 'projectGallery',
      layout: p.gallery.layout,
      images: galleryImages.map((img, i) => ({ ...img, _key: key('img', i) })),
      padding: p.gallery.padding,
      background: p.gallery.background,
    };
  }
  await client.createOrReplace(doc);
}

await client.createOrReplace({
  _id: 'siteSettings',
  _type: 'siteSettings',
  siteName: seedSite.siteName,
  description: { _type: 'localeText', ...seedSite.description },
  contactEmail: seedSite.contactEmail,
  slider: {
    _type: 'homeSlider',
    autoplay: seedSite.autoplay,
    projects: seedProjects.map((p, i) => ({ _type: 'reference', _ref: `project-${p.slug}`, _key: key('ref', i) })),
  },
});

console.log(`Done. ${seedProjects.length} projects and the Site document are in dataset "${dataset}".`);
