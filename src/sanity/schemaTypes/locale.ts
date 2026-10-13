// Localised text fields — v1.0 — Made by Electric Mustard
// Every text the client writes exists in English and Norwegian. English is
// required; if the Norwegian is left empty the site shows the English.
import { defineField, defineType } from 'sanity';

export const LANGUAGES = [
  { id: 'en', title: 'English' },
  { id: 'no', title: 'Norsk' },
] as const;

export const localeString = defineType({
  name: 'localeString',
  title: 'Text',
  type: 'object',
  options: { columns: 2 },
  fields: LANGUAGES.map((l) =>
    defineField({
      name: l.id,
      title: l.title,
      type: 'string',
      validation: l.id === 'en' ? (rule) => rule.required() : undefined,
    })
  ),
});

export const localeText = defineType({
  name: 'localeText',
  title: 'Long Text',
  type: 'object',
  fields: LANGUAGES.map((l) =>
    defineField({
      name: l.id,
      title: l.title,
      type: 'text',
      rows: 6,
      validation: l.id === 'en' ? (rule) => rule.required() : undefined,
    })
  ),
});
