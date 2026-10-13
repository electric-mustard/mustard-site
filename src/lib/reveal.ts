// Reveal — v3.2 — Made by Electric Mustard
// Motion language for everything that enters the page. No fades: things are
// masked and move into place.
//
//   data-reveal           text → split into single lines, each line slides up
//                         out of its own mask (GSAP SplitText)
//   data-reveal="block"   any element → wipes up from its bottom edge
//   data-reveal="image"   a figure → the picture comes up from a soft blur with
//                         a slight rise (a blur load)
//   data-reveal-group     container → its reveals play as one staggered sequence
//   data-reveal-delay     seconds, optional, added to that element or group
//
// Above the fold plays on page load; the rest plays as it scrolls into view.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
if (!CustomEase.get('reveal')) CustomEase.create('reveal', 'M0,0 C0.25,0.1 0.1,1 1,1');

const EASE = 'reveal';
const STAGGER = 0.06; // between lines
const STEP = 0.08; // between items in a group

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

let triggers: ScrollTrigger[] = [];
let splits: SplitText[] = [];
let timelines: gsap.core.Timeline[] = [];

function cssSeconds(name: string, fallback: number): number {
  // Browsers may serialise a custom property as "900ms" or "0.9s"; handle both.
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const v = parseFloat(raw);
  if (!Number.isFinite(v) || v <= 0) return fallback;
  return raw.endsWith('ms') ? v / 1000 : v;
}

function kind(el: Element): 'lines' | 'block' | 'image' {
  const v = el.getAttribute('data-reveal');
  return v === 'block' || v === 'image' ? v : 'lines';
}

function radiusOf(el: Element): string {
  const r = getComputedStyle(el).borderTopLeftRadius;
  return r && r !== '0px' ? ` round ${r}` : '';
}

/**
 * Blur load: once the picture has actually loaded, it comes up from a soft
 * blur with a slight rise. Lazy images are nudged to load first so a frame
 * never waits on a picture that was never asked for.
 */
async function blurLoad(figure: HTMLElement, seconds: number) {
  const img = figure.querySelector('img');
  if (img) {
    if (img.loading === 'lazy') img.loading = 'eager';
    await Promise.race([img.decode().catch(() => undefined), new Promise((r) => setTimeout(r, 2500))]);
  }
  const tl = gsap.timeline();
  tl.fromTo(figure, { opacity: 0.35 }, { opacity: 1, duration: seconds * 0.45, ease: 'power1.out' }, 0);
  tl.fromTo(
    figure,
    { y: 24, filter: 'blur(22px)' },
    { y: 0, filter: 'blur(0px)', duration: seconds * 0.75, ease: 'power2.out', onComplete: () => gsap.set(figure, { clearProps: 'filter,transform' }) },
    0
  );
}

/** Masks clip at the line box; give descenders a little room. */
function padMasks(split: SplitText) {
  split.masks.forEach((m) => {
    const el = m as HTMLElement;
    el.style.paddingBottom = '0.12em';
    el.style.marginBottom = '-0.12em';
  });
}

/** Adds one element's entrance to a timeline at the given position. */
function add(tl: gsap.core.Timeline, el: HTMLElement, at: number) {
  const duration = cssSeconds('--duration-reveal', 1.2);
  const type = kind(el);

  if (type === 'image') {
    tl.call(() => void blurLoad(el, duration), [], at);
    return;
  }

  if (type === 'block') {
    const r = radiusOf(el);
    tl.fromTo(
      el,
      { clipPath: `inset(0% 0% 100% 0%${r})`, y: 48, visibility: 'visible' },
      { clipPath: `inset(0% 0% 0% 0%${r})`, y: 0, duration, ease: EASE, clearProps: 'clipPath,transform' },
      at
    );
    return;
  }

  // lines
  const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'reveal-line' });
  padMasks(split);
  splits.push(split);
  tl.set(el, { visibility: 'visible' }, at);
  tl.from(split.lines, { yPercent: 110, duration, ease: EASE, stagger: STAGGER }, at);
}

function play(items: HTMLElement[], delay = 0) {
  if (!items.length) return;
  if (reduced()) {
    items.forEach((el) => {
      el.style.visibility = 'visible';
      el.style.opacity = '1';
    });
    return;
  }
  const tl = gsap.timeline({ delay });
  timelines.push(tl);
  let at = 0;
  items.forEach((el) => {
    add(tl, el, at);
    // a text item with several lines takes longer; let the next item follow its first line
    at += STEP;
  });
}

export function destroyReveals() {
  triggers.forEach((t) => t.kill());
  timelines.forEach((t) => t.kill());
  splits.forEach((s) => s.revert());
  triggers = [];
  timelines = [];
  splits = [];
}

/** @param delay seconds before above-the-fold items start (lets a page transition land). */
export async function initReveals(delay = 0) {
  destroyReveals();
  if (document.fonts) await document.fonts.ready; // split lines only once the real font is in

  const seen = new Set<Element>();
  const groups: { items: HTMLElement[]; delay: number }[] = [];
  const own = (el: Element) => parseFloat(el.getAttribute('data-reveal-delay') || '0') || 0;

  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const items = [...group.querySelectorAll<HTMLElement>('[data-reveal]')].filter((el) => !seen.has(el));
    items.forEach((el) => seen.add(el));
    if (items.length) groups.push({ items, delay: own(group) });
  });
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (seen.has(el)) return;
    seen.add(el);
    groups.push({ items: [el], delay: own(el) });
  });

  groups.forEach(({ items, delay: extra }) => {
    const first = items[0];
    const aboveFold = first.getBoundingClientRect().top < window.innerHeight * 0.92;
    if (aboveFold) {
      play(items, delay + extra);
      return;
    }
    triggers.push(
      ScrollTrigger.create({
        trigger: first,
        start: 'top 88%',
        once: true,
        onEnter: () => play(items, extra),
      })
    );
  });
}

// Lines re-split on resize so masks always match the current wrapping.
let resizeTimer = 0;
window.addEventListener('resize', () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    splits.forEach((s) => padMasks(s.split({ type: 'lines', mask: 'lines', linesClass: 'reveal-line' })));
  }, 200);
});
