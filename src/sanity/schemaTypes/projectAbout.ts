// ProjectAbout block schema — v1.2 — Made by Electric Mustard
// Pairs with src/components/ProjectAbout.astro
import { defineField, defineType } from 'sanity';
import { blockGroups, blockOptionFields } from './blockOptions';

export const projectAbout = defineType({
  name: 'projectAbout',
  title: 'About',
  type: 'object',
  groups: blockGroups,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'localeString',
      description: 'One short sentence that sums up the project.',
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'localeText',
      description: 'Leave a blank line between paragraphs.',
      group: 'content',
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      description: 'Optional. Short lines like "Photography — Jane Doe".',
      of: [{ type: 'string' }],
      group: 'content',
    }),
    ...blockOptionFields({ padding: 'lg', background: 'light' }),
  ],
  preview: {
    select: { title: 'heading.en' },
    prepare: ({ title }) => ({ title: 'About', subtitle: title }),
  },
});
