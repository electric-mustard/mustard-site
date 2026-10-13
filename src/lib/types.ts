// Content types — v1.1 — Made by Electric Mustard
// The shape every block receives, whether the content came from Sanity or
// from the built-in sample data.
import type { Background, Padding } from '../sanity/schemaTypes/blockOptions';
import type { GalleryLayout } from '../sanity/schemaTypes/projectGallery';

export type { Background, Padding, GalleryLayout };

export interface Picture {
  src: string;
  srcset?: string;
  alt: string;
  width: number;
  height: number;
}

export interface BlockOptions {
  padding: Padding;
  background: Background;
}

export interface ProjectHeroData extends BlockOptions {
  eyebrow?: string;
  client?: string;
  year?: string;
  image: Picture;
}

export interface ProjectAboutData extends BlockOptions {
  heading: string;
  body?: string;
  credits?: string[];
}

export interface ImpactItem {
  value: string;
  label: string;
  note?: string;
}

export interface ProjectImpactData extends BlockOptions {
  heading?: string;
  items: ImpactItem[];
}

export interface ProjectGalleryData extends BlockOptions {
  layout: GalleryLayout;
  images: Picture[];
}

export interface Project {
  title: string;
  slug: string;
  cover: Picture;
  hero?: ProjectHeroData;
  about?: ProjectAboutData;
  impact?: ProjectImpactData;
  gallery?: ProjectGalleryData;
}

export interface Site {
  siteName: string;
  description?: string;
  contactEmail?: string;
  autoplay: number;
  projects: Project[];
}
