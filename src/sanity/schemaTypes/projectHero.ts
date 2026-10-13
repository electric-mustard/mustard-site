// ProjectHero block schema — v1.2 — Made by Electric Mustard
// Pairs with src/components/ProjectHero.astro
import { defineField, defineType } from 'sanity';
import { blockGroups, blockOptionFields } from './blockOptions';

export const projectHero = defineType({
  name: 'projectHero',
  title: 'Title & Hero Image',
  type: 'object',
  groups: blockGroups,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'localeString',
      description: 'Small line above the title, e.g. "Brand identity".',
      group: 'content',
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'image',
      title: 'Hero Image',
      type: 'imageWithAlt',
      description: 'The one big image under the title. Landscape works best.',
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    ...blockOptionFields({ padding: 'lg', background: 'light' }),
  ],
  preview: {
    select: { client: 'client', media: 'image' },
    prepare: ({ client, media }) => ({ title: 'Title & Hero Image', subtitle: client, media }),
  },
});
