// Sanity Studio config — v1.0 — Made by Electric Mustard
// The Studio is embedded at /admin (see astro.config.mjs).
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';

export default defineConfig({
  name: 'default',
  title: 'Site',
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  plugins: [structureTool({ structure })],
  schema: { types: schemaTypes },
});
