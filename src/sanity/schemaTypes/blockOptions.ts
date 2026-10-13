// Standard block options — v1.0 — Made by Electric Mustard
// Every block gets these two fields. Values are named presets that map to
// tokens in src/styles/tokens.css, so the client can never break the design.
import { defineField } from 'sanity';

export const PADDING_OPTIONS = [
  { title: 'None', value: 'none' },
  { title: 'Small', value: 'sm' },
  { title: 'Medium', value: 'md' },
  { title: 'Large', value: 'lg' },
] as const;

export const BACKGROUND_OPTIONS = [
  { title: 'Dark', value: 'dark' },
  { title: 'Light', value: 'light' },
  { title: 'Accent', value: 'accent' },
] as const;

export type Padding = (typeof PADDING_OPTIONS)[number]['value'];
export type Background = (typeof BACKGROUND_OPTIONS)[number]['value'];

export const blockOptionFields = (defaults: { padding?: Padding; background?: Background } = {}) => [
  defineField({
    name: 'padding',
    title: 'Padding',
    type: 'string',
    description: 'Space above and below this section.',
    options: { list: [...PADDING_OPTIONS], layout: 'radio', direction: 'horizontal' },
    initialValue: defaults.padding ?? 'md',
    group: 'options',
  }),
  defineField({
    name: 'background',
    title: 'Background',
    type: 'string',
    description: 'Colour behind this section.',
    options: { list: [...BACKGROUND_OPTIONS], layout: 'radio', direction: 'horizontal' },
    initialValue: defaults.background ?? 'dark',
    group: 'options',
  }),
];

export const blockGroups = [
  { name: 'content', title: 'Content', default: true },
  { name: 'options', title: 'Options' },
];
