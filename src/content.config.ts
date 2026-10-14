import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(), // one sentence, shown on cards
      role: z.string(), // e.g. "Tech Lead", "Senior Engineer"
      stack: z.array(z.string()),
      year: z.number(),
      cover: image().optional(),
      links: z
        .object({
          repo: z.url(),
          live: z.url(),
        })
        .partial()
        .optional(),
      featured: z.boolean().default(false), // shown on home page
      draft: z.boolean().default(false), // excluded from production build
    }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, writing };
