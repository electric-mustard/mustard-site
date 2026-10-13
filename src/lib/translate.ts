// Auto-translation — v1.0 — Made by Electric Mustard
// Finds every English / Norsk text pair in a Sanity document where the
// Norwegian is empty, translates the English with Claude, and returns the
// patches that fill them in. Pure logic, no network: the API route in
// src/pages/api/translate.ts does the fetching and saving.
import Anthropic from '@anthropic-ai/sdk';

export const LOCALE_TYPES = new Set(['localeString', 'localeText']);

export interface Gap {
  /** Sanity path to the Norwegian value, e.g. `about.heading.no` or `impact.items[_key=="x"].label.no` */
  path: string;
  en: string;
}

/** Walks a document and lists every locale pair whose Norwegian is missing. */
export function findGaps(value: unknown, path = ''): Gap[] {
  if (!value || typeof value !== 'object') return [];
  const gaps: Gap[] = [];

  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      const key = item && typeof item === 'object' && typeof (item as { _key?: string })._key === 'string' ? (item as { _key: string })._key : null;
      const segment = key ? `${path}[_key=="${key}"]` : `${path}[${i}]`;
      gaps.push(...findGaps(item, segment));
    });
    return gaps;
  }

  const obj = value as Record<string, unknown>;
  if (LOCALE_TYPES.has(String(obj._type))) {
    const en = typeof obj.en === 'string' ? obj.en.trim() : '';
    const no = typeof obj.no === 'string' ? obj.no.trim() : '';
    if (en && !no) gaps.push({ path: path ? `${path}.no` : 'no', en });
    return gaps;
  }

  for (const [key, child] of Object.entries(obj)) {
    if (key.startsWith('_')) continue;
    gaps.push(...findGaps(child, path ? `${path}.${key}` : key));
  }
  return gaps;
}

const SYSTEM = `You translate website copy from English to Norwegian Bokmål for a design studio's portfolio.
Keep the tone: plain, confident, no marketing fluff. Keep brand names, client names, product names, numbers and units exactly as written.
Preserve paragraph breaks (blank lines) exactly. Do not add or remove sentences. Do not explain anything.
Reply with JSON only: an object whose keys are the given ids and whose values are the translations.`;

export interface Translator {
  (texts: Record<string, string>): Promise<Record<string, string>>;
}

/** Translates a batch of id → English into id → Norwegian with Claude. */
export function claudeTranslator(apiKey: string, model = process.env.TRANSLATE_MODEL || 'claude-sonnet-5-5'): Translator {
  const client = new Anthropic({ apiKey });
  return async (texts) => {
    const ids = Object.keys(texts);
    if (!ids.length) return {};
    const response = await client.messages.create({
      model,
      max_tokens: 8000,
      system: SYSTEM,
      messages: [{ role: 'user', content: JSON.stringify(texts) }],
    });
    const text = response.content
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('')
      .trim();
    const json = text.startsWith('{') ? text : text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const parsed = JSON.parse(json) as Record<string, unknown>;
    const out: Record<string, string> = {};
    for (const id of ids) {
      const v = parsed[id];
      if (typeof v === 'string' && v.trim()) out[id] = v.trim();
    }
    return out;
  };
}

/** Turns gaps + translations into a Sanity `set` patch. */
export async function buildPatch(gaps: Gap[], translate: Translator): Promise<Record<string, string>> {
  if (!gaps.length) return {};
  const texts: Record<string, string> = {};
  gaps.forEach((g, i) => (texts[`t${i}`] = g.en));
  const translated = await translate(texts);
  const set: Record<string, string> = {};
  gaps.forEach((g, i) => {
    const v = translated[`t${i}`];
    if (v) set[g.path] = v;
  });
  return set;
}
