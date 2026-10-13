// Astro config — v1.1 — Made by Electric Mustard
// The Sanity integration (and the embedded Studio at /admin) switches on only
// when PUBLIC_SANITY_PROJECT_ID is set in .env. Without it the site runs on the
// sample content in src/data/seed.ts so it can be previewed straight away.
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sanity from '@sanity/astro';
import react from '@astrojs/react';

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const projectId = env.PUBLIC_SANITY_PROJECT_ID;
const dataset = env.PUBLIC_SANITY_DATASET || 'production';

export default defineConfig({
  output: 'static',
  // English at /, Norwegian at /no/. Pages for /no/ live in src/pages/no/.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'no'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: projectId
    ? [
        sanity({
          projectId,
          dataset,
          useCdn: false,
          apiVersion: '2026-10-01',
          studioBasePath: '/admin',
        }),
        react(),
      ]
    : [],
});
