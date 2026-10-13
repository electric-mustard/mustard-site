// Image with alt text — v1.1 — Made by Electric Mustard
import { defineField, defineType } from 'sanity';

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'localeString',
      description: 'Describe the image in a few words. Read out by screen readers.',
      validation: (rule) => rule.required(),
    }),
  ],
});
