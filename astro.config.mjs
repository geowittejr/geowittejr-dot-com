// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Flip to true once geowittejr.com DNS points at GitHub Pages (see docs/project-plan.md §7).
// Until then the site is served from the default project URL under a base path.
const CUSTOM_DOMAIN = false;

// https://astro.build/config
export default defineConfig({
  site: CUSTOM_DOMAIN ? 'https://geowittejr.com' : 'https://geowittejr.github.io',
  base: CUSTOM_DOMAIN ? '/' : '/geowittejr-dot-com',
  integrations: [react(), mdx(), sitemap()],
  markdown: {
    // Dual themes; global.css switches to the dark one via `data-theme`.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
