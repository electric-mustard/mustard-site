/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID?: string;
  readonly PUBLIC_SANITY_DATASET?: string;
  readonly SANITY_API_WRITE_TOKEN?: string;
  readonly SANITY_WEBHOOK_SECRET?: string;
  readonly ANTHROPIC_API_KEY?: string;
  readonly TRANSLATE_MODEL?: string;
}
