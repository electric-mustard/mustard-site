// HomeSlider block schema — v1.0 — Made by Electric Mustard
// Pairs with src/components/HomeSlider.astro
import { defineField, defineType } from 'sanity';

export const AUTOPLAY_OPTIONS = [
  { title: 'Off', value: 0 },
  { title: 'Every 5 seconds', value: 5 },
  { title: 'Every 8 seconds', value: 8 },
] as const;

export const homeSlider = defineType({
  name: 'homeSlider',
  title: 'Home Slider',
  type: 'object',
  fields: [
    defineField({
      name: 'projects',
      title: 'Projects',
      type: 'array',
      description: 'Drag to set the order. Only projects listed here appear on the home page.',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'autoplay',
      title: 'Autoplay',
      type: 'number',
      options: { list: [...AUTOPLAY_OPTIONS], layout: 'radio', direction: 'horizontal' },
      initialValue: 5,
    }),
  ],
});
