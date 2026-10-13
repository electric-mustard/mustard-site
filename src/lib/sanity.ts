// Content loader — v2.0 — Made by Electric Mustard
// Reads from Sanity when PUBLIC_SANITY_PROJECT_ID is set; otherwise serves the
// sample content in src/data/seed.ts so the site runs with no setup. Either
// way, getSite(lang) hands the blocks plain strings in one language, so
// blocks never deal with translations themselves.
import { createClient } from '@sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import type { Picture, Project, Site } from './types';
import { pick, type Lang, type Localised } from './i18n';
import { seedSite, type SeedPicture, type SeedProject } from '../data/seed';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

export const hasSanity = Boolean(projectId);

const client = hasSanity
  ? createClient({ projectId, dataset, useCdn: false, apiVersion: '2026-10-01', perspective: 'published' })
  : null;

const builder = hasSanity ? createImageUrlBuilder({ projectId: projectId as string, dataset }) : null;

const SRCSET_WIDTHS = [640, 960, 1280, 1920, 2560];

interface SanityImage {
  alt?: Localised;
  hotspot?: unknown;
  crop?: unknown;
  asset?: { _id: string; url: string; metadata?: { dimensions?: { width: number; height: number } } };
}

function toPicture(img: SanityImage | null | undefined, lang: Lang, fallbackAlt = ''): Picture | undefined {
  if (!img?.asset || !builder) return undefined;
  const source = { ...img, asset: { _ref: img.asset._id } } as SanityImageSource;
  const base = builder.image(source).auto('format').fit('max').quality(82);
  const dims = img.asset.metadata?.dimensions;
  return {
    src: base.width(1920).url(),
    srcset: SRCSET_WIDTHS.map((w) => `${base.width(w).url()} ${w}w`).join(', '),
    alt: pick(img.alt, lang) || fallbackAlt,
    width: dims?.width ?? 1600,
    height: dims?.height ?? 1000,
  };
}

const IMAGE = `{ alt, hotspot, crop, asset->{ _id, url, metadata { dimensions { width, height } } } }`;

const PROJECT = `{
  title,
  "slug": slug.current,
  cover ${IMAGE},
  hero { eyebrow, client, year, padding, background, image ${IMAGE} },
  about { heading, body, credits, padding, background },
  impact { heading, padding, background, items[] { value, label, note } },
  gallery { layout, padding, background, images[] ${IMAGE} }
}`;

const SITE_QUERY = `*[_type == "siteSettings" && _id == "siteSettings"][0]{
  siteName,
  description,
  contactEmail,
  "autoplay": coalesce(slider.autoplay, 5),
  "projects": slider.projects[]-> ${PROJECT}
}`;

const ALL_PROJECTS_QUERY = `*[_type == "project" && defined(slug.current)] | order(_createdAt asc) ${PROJECT}`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromSanity(raw: any, lang: Lang): Project | null {
  const title = pick(raw?.title, lang);
  if (!raw?.slug || !title) return null;
  const cover = toPicture(raw.cover, lang, title);
  const heroImage = toPicture(raw.hero?.image, lang, title);
  if (!cover && !heroImage) return null;

  const project: Project = { title, slug: raw.slug, cover: (cover ?? heroImage) as Picture };

  if (raw.hero && heroImage) {
    project.hero = {
      eyebrow: pick(raw.hero.eyebrow, lang) || undefined,
      client: raw.hero.client ?? undefined,
      year: raw.hero.year ?? undefined,
      image: heroImage,
      padding: raw.hero.padding ?? 'lg',
      background: raw.hero.background ?? 'light',
    };
  }
  const aboutHeading = pick(raw.about?.heading, lang);
  if (aboutHeading) {
    project.about = {
      heading: aboutHeading,
      body: pick(raw.about.body, lang) || undefined,
      credits: Array.isArray(raw.about.credits) ? raw.about.credits.filter(Boolean) : undefined,
      padding: raw.about.padding ?? 'lg',
      background: raw.about.background ?? 'light',
    };
  }
  if (Array.isArray(raw.impact?.items) && raw.impact.items.length) {
    const items = raw.impact.items
      .map((i: { value?: string; label?: Localised; note?: Localised }) => ({
        value: i?.value ?? '',
        label: pick(i?.label, lang),
        note: pick(i?.note, lang) || undefined,
      }))
      .filter((i: { value: string; label: string }) => i.value && i.label);
    if (items.length) {
      project.impact = {
        heading: pick(raw.impact.heading, lang) || undefined,
        items,
        padding: raw.impact.padding ?? 'lg',
        background: raw.impact.background ?? 'light',
      };
    }
  }
  if (Array.isArray(raw.gallery?.images)) {
    const images = raw.gallery.images
      .map((img: SanityImage, i: number) => toPicture(img, lang, `${title} — ${i + 1}`))
      .filter(Boolean) as Picture[];
    if (images.length) {
      project.gallery = {
        images,
        layout: raw.gallery.layout ?? 'alternate',
        padding: raw.gallery.padding ?? 'md',
        background: raw.gallery.background ?? 'light',
      };
    }
  }
  return project;
}

function seedPicture(p: SeedPicture, lang: Lang): Picture {
  return { src: p.src, alt: pick(p.alt, lang), width: p.width, height: p.height };
}

function fromSeed(p: SeedProject, lang: Lang): Project {
  return {
    title: pick(p.title, lang),
    slug: p.slug,
    cover: seedPicture(p.cover, lang),
    hero: {
      eyebrow: pick(p.hero.eyebrow, lang),
      client: p.hero.client,
      year: p.hero.year,
      image: seedPicture(p.hero.image, lang),
      padding: p.hero.padding,
      background: p.hero.background,
    },
    about: {
      heading: pick(p.about.heading, lang),
      body: pick(p.about.body, lang),
      credits: p.about.credits,
      padding: p.about.padding,
      background: p.about.background,
    },
    impact: {
      heading: pick(p.impact.heading, lang),
      items: p.impact.items.map((i) => ({ value: i.value, label: pick(i.label, lang), note: pick(i.note, lang) || undefined })),
      padding: p.impact.padding,
      background: p.impact.background,
    },
    gallery: {
      images: p.gallery.images.map((img) => seedPicture(img, lang)),
      layout: p.gallery.layout,
      padding: p.gallery.padding,
      background: p.gallery.background,
    },
  };
}

/** The sample site in one language (used by /specimen too). */
export function seedSiteFor(lang: Lang): Site {
  return {
    siteName: seedSite.siteName,
    description: pick(seedSite.description, lang),
    contactEmail: seedSite.contactEmail,
    autoplay: seedSite.autoplay,
    projects: seedSite.projects.map((p) => fromSeed(p, lang)),
  };
}

const cache = new Map<Lang, Promise<Site>>();

/** The whole site in one language: settings plus projects in home-page order. Fetched once per build. */
export function getSite(lang: Lang): Promise<Site> {
  let p = cache.get(lang);
  if (!p) {
    p = loadSite(lang);
    cache.set(lang, p);
  }
  return p;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let rawCache: Promise<{ settings: any; all: any[] }> | null = null;

async function loadRaw() {
  if (!client) return { settings: null, all: [] };
  const settings = await client.fetch(SITE_QUERY);
  const all = settings?.projects?.length ? [] : await client.fetch(ALL_PROJECTS_QUERY);
  return { settings, all };
}

async function loadSite(lang: Lang): Promise<Site> {
  if (!client) return seedSiteFor(lang);
  if (!rawCache) rawCache = loadRaw();
  const { settings, all } = await rawCache;

  let projects = ((settings?.projects ?? []) as unknown[]).map((p) => fromSanity(p, lang)).filter(Boolean) as Project[];
  // No slider set up yet in the Studio: show every project, oldest first.
  if (!projects.length) projects = (all ?? []).map((p) => fromSanity(p, lang)).filter(Boolean) as Project[];

  const fallback = seedSiteFor(lang);
  return {
    siteName: settings?.siteName || fallback.siteName,
    description: pick(settings?.description, lang) || fallback.description,
    contactEmail: settings?.contactEmail || undefined,
    autoplay: typeof settings?.autoplay === 'number' ? settings.autoplay : 5,
    projects,
  };
}

export async function getProjects(lang: Lang): Promise<Project[]> {
  return (await getSite(lang)).projects;
}

export async function getProject(lang: Lang, slug: string): Promise<Project | undefined> {
  return (await getProjects(lang)).find((p) => p.slug === slug);
}

/** The project after this one in home-page order, wrapping round to the first. */
export async function getNextProject(lang: Lang, slug: string): Promise<Project | undefined> {
  const projects = await getProjects(lang);
  if (projects.length < 2) return undefined;
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
