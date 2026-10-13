// Block helpers — v1.0 — Made by Electric Mustard
import type { Background, BlockOptions, Padding } from './types';

const PADDINGS: Padding[] = ['none', 'sm', 'md', 'lg'];
const BACKGROUNDS: Background[] = ['dark', 'light', 'accent'];

/** Turns the two standard options into the preset classes defined in global.css. */
export function blockClasses(opts: Partial<BlockOptions>, defaults: BlockOptions): string {
  const padding = PADDINGS.includes(opts.padding as Padding) ? (opts.padding as Padding) : defaults.padding;
  const background = BACKGROUNDS.includes(opts.background as Background)
    ? (opts.background as Background)
    : defaults.background;
  return `block pad-${padding} bg-${background}`;
}

/** Splits a plain-text field into paragraphs on blank lines. */
export function paragraphs(text?: string): string[] {
  if (!text) return [];
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
