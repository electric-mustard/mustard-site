// ProjectGallery block schema — v1.1 — Made by Electric Mustard
// Pairs with src/components/ProjectGallery.astro
import { defineField, defineType } from 'sanity';
import { blockGroups, blockOptionFields } from './blockOptions';

export const GALLERY_LAYOUTS = [
  { title: 'Full width', value: 'full' },
  { title: 'Alternating', value: 'alternate' },
  { title: 'Two up', value: 'pairs' },
] as const;

export type GalleryLayout = (typeof GALLERY_LAYOUTS)[number]['value'];

export const projectGallery = defineType({
  name: 'projectGallery',
  title: 'Gallery',
  type: 'object',
  groups: blockGroups,
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'imageWithAlt' }],
      validation: (rule) => rule.min(1),
      group: 'content',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: [...GALLERY_LAYOUTS], layout: 'radio', direction: 'horizontal' },
      initialValue: 'alternate',
      group: 'content',
    }),
    ...blockOptionFields({ padding: 'md', background: 'light' }),
  ],
  preview: {
    select: { images: 'images', media: 'images.0' },
    prepare: ({ images, media }) => ({ title: 'Gallery', subtitle: `${images?.length ?? 0} images`, media }),
  },
});
