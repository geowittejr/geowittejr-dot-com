// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://geowittejr.com',
  // no `base` needed with a custom domain (see project-plan.md §7)
  integrations: [react(), mdx(), sitemap()],
});
