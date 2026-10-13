// Project document — v1.1 — Made by Electric Mustard
// One project = one slide on the home page + one project page at /work/<slug>.
import { defineField, defineType } from 'sanity';

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'basics', title: 'Basics', default: true },
    { name: 'sections', title: 'Page Sections' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (rule) => rule.required(),
      group: 'basics',
    }),
    defineField({
      name: 'slug',
      title: 'Web Address',
      type: 'slug',
      description: 'The last part of the page link, e.g. "northwind" → /work/northwind. Click Generate.',
      options: { source: 'title.en', maxLength: 96 },
      validation: (rule) => rule.required(),
      group: 'basics',
    }),
    defineField({
      name: 'cover',
      title: 'Cover Image',
      type: 'imageWithAlt',
      description: 'The small portrait image shown on the home page slider. Portrait (4:5) works best.',
      validation: (rule) => rule.required(),
      group: 'basics',
    }),
    defineField({
      name: 'hero',
      title: 'Title & Hero Image',
      type: 'projectHero',
      group: 'sections',
    }),
    defineField({
      name: 'about',
      title: 'About',
      type: 'projectAbout',
      group: 'sections',
    }),
    defineField({
      name: 'impact',
      title: 'Impact',
      type: 'projectImpact',
      group: 'sections',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'projectGallery',
      group: 'sections',
    }),
  ],
  preview: {
    select: { title: 'title.en', subtitle: 'hero.client', media: 'cover' },
  },
});
