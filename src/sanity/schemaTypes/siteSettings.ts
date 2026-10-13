// Site settings (single document) — v1.2 — Made by Electric Mustard
import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      description: 'Shown in the browser tab.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeText',
      description: 'One or two sentences for search engines and link previews.',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'The mail icon on the home page opens a new email to this address.',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'slider',
      title: 'Home Slider',
      type: 'homeSlider',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site' }),
  },
});
