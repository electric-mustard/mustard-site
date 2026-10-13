// Translate endpoint — v1.0 — Made by Electric Mustard
// Sanity calls this (webhook) whenever a project or the Site document is
// published. Any English text without a Norwegian version is translated with
// Claude and written back into Sanity, which then triggers the normal rebuild.
//
// Needs on the server: PUBLIC_SANITY_PROJECT_ID, SANITY_API_WRITE_TOKEN,
// ANTHROPIC_API_KEY. Optional: SANITY_WEBHOOK_SECRET (checked when set),
// TRANSLATE_MODEL.
import type { APIRoute } from 'astro';
import { createClient } from '@sanity/client';
import { buildPatch, claudeTranslator, findGaps } from '../../lib/translate';

export const prerender = false;

const TYPES = new Set(['project', 'siteSettings']);

export const POST: APIRoute = async ({ request }) => {
  const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
  const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
  const token = import.meta.env.SANITY_API_WRITE_TOKEN;
  const apiKey = import.meta.env.ANTHROPIC_API_KEY;
  const secret = import.meta.env.SANITY_WEBHOOK_SECRET;

  if (!projectId || !token || !apiKey) {
    return json({ ok: false, error: 'Server is missing PUBLIC_SANITY_PROJECT_ID, SANITY_API_WRITE_TOKEN or ANTHROPIC_API_KEY' }, 500);
  }

  const body = await request.text();

  if (secret) {
    const { isValidSignature, SIGNATURE_HEADER_NAME } = await import('@sanity/webhook');
    const signature = request.headers.get(SIGNATURE_HEADER_NAME) || '';
    if (!(await isValidSignature(body, signature, secret))) return json({ ok: false, error: 'Bad signature' }, 401);
  }

  let payload: { _id?: string; _type?: string } = {};
  try {
    payload = JSON.parse(body);
  } catch {
    return json({ ok: false, error: 'Body is not JSON' }, 400);
  }

  const id = typeof payload._id === 'string' ? payload._id : '';
  if (!id || id.startsWith('drafts.')) return json({ ok: true, skipped: 'no published document id' });

  const client = createClient({ projectId, dataset, token, apiVersion: '2026-10-01', useCdn: false });
  const doc = await client.getDocument(id);
  if (!doc) return json({ ok: true, skipped: 'document not found' });
  if (!TYPES.has(String(doc._type))) return json({ ok: true, skipped: `type ${doc._type} is not translated` });

  const gaps = findGaps(doc);
  if (!gaps.length) return json({ ok: true, translated: 0 });

  const set = await buildPatch(gaps, claudeTranslator(apiKey));
  if (!Object.keys(set).length) return json({ ok: false, error: 'Translation returned nothing' }, 502);

  await client.patch(id).set(set).commit();
  return json({ ok: true, translated: Object.keys(set).length, paths: Object.keys(set) });
};

export const GET: APIRoute = () => json({ ok: true, info: 'POST a Sanity webhook payload here to fill empty Norwegian fields.' });

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}
