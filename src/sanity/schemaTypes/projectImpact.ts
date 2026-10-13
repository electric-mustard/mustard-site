// ProjectImpact block schema — v1.1 — Made by Electric Mustard
// Pairs with src/components/ProjectImpact.astro
import { defineField, defineType } from 'sanity';
import { blockGroups, blockOptionFields } from './blockOptions';

export const impactItem = defineType({
  name: 'impactItem',
  title: 'Impact Item',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      description: 'The big number or word, e.g. "3.2×" or "No. 1".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'localeString',
      description: 'What the value means, e.g. "Increase in sign-ups".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'localeText',
      description: 'Optional. One or two sentences of context.',
    }),
  ],
  preview: {
    select: { title: 'value', subtitle: 'label.en' },
  },
});

export const projectImpact = defineType({
  name: 'projectImpact',
  title: 'Impact',
  type: 'object',
  groups: blockGroups,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'localeString',
      initialValue: { en: 'Impact', no: 'Effekt' },
      group: 'content',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      description: 'These scroll sideways. Three to six works best.',
      of: [{ type: 'impactItem' }],
      validation: (rule) => rule.min(1).max(8),
      group: 'content',
    }),
    ...blockOptionFields({ padding: 'lg', background: 'light' }),
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }) => ({ title: 'Impact', subtitle: `${items?.length ?? 0} items` }),
  },
});
