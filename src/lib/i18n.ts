// Languages — v1.0 — Made by Electric Mustard
// English is the default and lives at /. Norwegian lives at /no/.
// Text fields in Sanity hold both versions; pick() chooses one, falling back
// to English when the Norwegian is empty. t() is for the site's own labels.

export const LANGS = ['en', 'no'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

export interface Localised {
  en?: string;
  no?: string;
}

export function isLang(value: unknown): value is Lang {
  return value === 'en' || value === 'no';
}

/** The text for a language, falling back to English, then to an empty string. */
export function pick(value: Localised | string | undefined | null, lang: Lang): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return (value[lang] || value.en || '').trim();
}

/** Prefixes a site path with the language, e.g. ('no', '/work/x/') → '/no/work/x/'. */
export function localePath(lang: Lang, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return lang === DEFAULT_LANG ? clean : `/no${clean === '/' ? '/' : clean}`;
}

/** The same page in the other language. */
export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'no' : 'en';
}

/** Strips a language prefix from a pathname. */
export function stripLang(pathname: string): string {
  return pathname.replace(/^\/no(\/|$)/, '/');
}

const strings = {
  en: {
    home: 'Home',
    client: 'Client',
    year: 'Year',
    about: 'About',
    impact: 'Impact',
    nextProject: 'Next project',
    close: 'Close',
    closeProject: 'Close project',
    emailUs: 'Email us',
    prevSlide: 'Previous project',
    nextSlide: 'Next project',
    language: 'Language',
    projects: 'Projects',
    project: 'Project',
  },
  no: {
    home: 'Hjem',
    client: 'Kunde',
    year: 'År',
    about: 'Om',
    impact: 'Effekt',
    nextProject: 'Neste prosjekt',
    close: 'Lukk',
    closeProject: 'Lukk prosjekt',
    emailUs: 'Send e-post',
    prevSlide: 'Forrige prosjekt',
    nextSlide: 'Neste prosjekt',
    language: 'Språk',
    projects: 'Prosjekter',
    project: 'Prosjekt',
  },
} as const;

export type StringKey = keyof (typeof strings)['en'];

export function t(lang: Lang | string | undefined, key: StringKey): string {
  const l: Lang = isLang(lang) ? lang : DEFAULT_LANG;
  return strings[l][key];
}
