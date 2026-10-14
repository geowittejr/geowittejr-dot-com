# Project Plan: geowittejr.com

> **Status:** Active · **Owner:** George Witte Jr. · **Last updated:** 2026-10-14
>
> This is the source of truth for how the site is built. Change this file when a decision changes, and log the change in the [Decision Log](#decision-log). Deeper designs for individual features go in [`docs/`](README.md).

## 1. Goal

A clean, simple portfolio site for a senior software engineer, aimed at prospective recruiters and hiring managers. It should show:

1. **About**: who I am, my experience, my skills, and my resume.
2. **Projects**: work I've done, written as case studies.
3. **Writing**: my thoughts on engineering and other subjects.

### Success criteria

- A recruiter can find my resume, contact info, and best projects within 10 seconds of landing.
- The site is fast (Lighthouse 95+ in every category) and ships close to zero JavaScript.
- Adding a project or post means adding one Markdown file. No code changes.

### Non-goals

- No CMS, database, backend, or comments.
- No heavy client-side framework app. React is only for small interactive islands.

## 2. Tech Stack

| Concern       | Choice                                      | Notes                                                          |
| ------------- | ------------------------------------------- | -------------------------------------------------------------- |
| Framework     | [Astro](https://astro.build) (v7), static output | Content-focused; ships no JS by default                       |
| Content       | Markdown / MDX via **content collections**  | Frontmatter is type-checked with Zod                           |
| Interactivity | React (`@astrojs/react`), islands only      | Use `client:*` directives only where interactivity is needed   |
| Language      | TypeScript (strict)                         |                                                                |
| Styling       | [Tailwind CSS](https://tailwindcss.com) v4 (`@tailwindcss/vite`) + `@tailwindcss/typography` | Theme tokens in `src/styles/global.css`; utilities in markup |
| Integrations  | `@astrojs/react`, `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/rss` |                                       |
| Package mgr   | npm                                         | Lockfile committed                                             |
| Analytics     | None                                        | Revisit only if there's a question analytics would answer      |
| Hosting       | GitHub Pages                                | Repo: `geowittejr/geowittejr-dot-com`                          |
| Deploy        | GitHub Actions (`withastro/action`)         | On every push to `main`                                        |
| Domain        | `geowittejr.com` (owned); default GitHub URL for now | `https://geowittejr.github.io/geowittejr-dot-com/` until DNS is set; see [§7](#7-deployment) |

## 3. Repository Structure

This is the root of the GitHub Pages repo:

```
geowittejr-dot-com/
├── .github/
│   └── workflows/
│       └── deploy.yml          # build + deploy to GitHub Pages
├── docs/                       # design docs (not published to the site)
│   ├── project-plan.md         # ← this file
│   ├── README.md               # index of design docs + conventions
│   └── _template.md            # copy this to start a new design doc
├── public/                     # served as-is, not processed
│   ├── CNAME                   # custom domain: geowittejr.com
│   ├── favicon.svg
│   ├── resume.pdf              # one click from every page
│   └── og-image.png            # default social share image
├── src/
│   ├── assets/                 # images optimized via astro:assets
│   │   ├── headshot.jpg
│   │   └── projects/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ProjectCard.astro
│   │   ├── PostCard.astro
│   │   ├── TagList.astro
│   │   ├── FormattedDate.astro
│   │   └── ThemeToggle.tsx     # React only where interactive (island)
│   ├── content/                # all markdown content lives here
│   │   ├── projects/
│   │   │   └── <slug>.md       # one file per case study
│   │   └── writing/
│   │       └── <slug>.md       # one file per post
│   ├── layouts/
│   │   ├── BaseLayout.astro    # <head>, SEO meta, header, footer
│   │   └── ProseLayout.astro   # article styling for markdown pages
│   ├── lib/
│   │   ├── content.ts          # getProjects/getPosts: draft filtering + sorting
│   │   └── url.ts              # url(): prefixes internal links with the base path
│   ├── pages/                  # file-based routing
│   │   ├── index.astro         # hero, featured projects, recent writing
│   │   ├── about.mdx           # bio, experience, skills
│   │   ├── projects/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── writing/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── rss.xml.ts
│   │   └── 404.astro
│   ├── styles/
│   │   └── global.css          # Tailwind entry + theme tokens
│   ├── consts.ts               # site name, email, social links
│   └── content.config.ts       # content collection schemas
├── .gitignore
├── astro.config.mjs
├── LICENSE
├── package.json
├── README.md                   # short: what this is, how to run it
└── tsconfig.json
```

### Structure rules

- **Repeating content goes in `src/content/`, one-off pages go in `src/pages/`.** Projects and posts are collections. About, Home, and 404 are pages.
- **Default to `.astro` components.** Use `.tsx` (React) only when a component needs client-side state or events, and hydrate it with the narrowest directive that works (`client:visible` before `client:load`).
- **Use `.md` by default and `.mdx` only when a file embeds components.**
- **Images:** use `src/assets/` for anything rendered with `<Image />` (it gets optimized) and `public/` only for files that need a fixed URL (resume, favicon, OG image, CNAME).
- **`docs/` is for planning, not for the site.** Astro never builds it.
- **Internal links go through `url()`** from `src/lib/url.ts` (in `.astro`, `.ts`, and `.mdx`), never a bare `/path`, so they work under the current base path. In plain `.md` content, avoid root-relative links to site pages until the custom domain is live (use `.mdx` if needed).
- **Style with Tailwind utilities in markup.** Colors use the theme tokens (`bg-bg`, `text-fg`, `text-muted`, `text-accent`, `border-border`, `bg-bg-subtle`), which already switch with dark mode. Markdown bodies use `prose max-w-none`.

## 4. Site Map & Routes

| Route               | Source                              | Purpose                                                    |
| ------------------- | ----------------------------------- | ---------------------------------------------------------- |
| `/`                 | `pages/index.astro`                 | Short intro, 3–4 featured projects, recent writing, contact |
| `/about`            | `pages/about.mdx`                   | Bio, experience summary, skills, resume link               |
| `/projects`         | `pages/projects/index.astro`        | All non-draft projects, newest first                       |
| `/projects/[slug]`  | `pages/projects/[slug].astro`       | Project case study                                         |
| `/writing`          | `pages/writing/index.astro`         | All non-draft posts, newest first                          |
| `/writing/[slug]`   | `pages/writing/[slug].astro`        | Single post                                                |
| `/rss.xml`          | `pages/rss.xml.ts`                  | RSS feed for writing                                       |
| `/resume.pdf`       | `public/resume.pdf`                 | Downloadable resume                                        |
| `/404`              | `pages/404.astro`                   | Not found (GitHub Pages serves `404.html` automatically)    |

Slugs come from the filename: `src/content/projects/payments-platform.md` becomes `/projects/payments-platform`.

## 5. Content Model

Defined in `src/content.config.ts`. Builds fail on invalid frontmatter, and that's intended.

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';   // Zod 4; `z` from 'astro:content' is deprecated

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    summary: z.string(),                 // one sentence, shown on cards
    role: z.string(),                    // e.g. "Tech Lead", "Senior Engineer"
    stack: z.array(z.string()),
    year: z.number(),
    cover: image().optional(),
    links: z.object({
      repo: z.url(),
      live: z.url(),
    }).partial().optional(),
    featured: z.boolean().default(false), // shown on home page
    draft: z.boolean().default(false),    // excluded from production build
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
```

### Project case study format

Each project body follows this outline. Senior hiring cares more about judgment than about a list of technologies.

1. **Context / Problem**: what was broken or needed, and why it mattered.
2. **My Role**: scope, team size, and what I owned.
3. **Approach & Key Decisions**: the trade-offs considered and why I chose what I chose.
4. **Outcome**: measurable results (latency, cost, revenue, reliability, team velocity).
5. **What I'd Do Differently** (optional): shows reflection.

## 6. Design Principles

- **Clean and simple:** one column, generous whitespace, system or one web font, a restrained palette, light and dark mode.
- **Fast:** static HTML with minimal JS and optimized images. Performance is part of the pitch.
- **Accessible:** semantic HTML, good contrast, keyboard navigable, alt text required on every image.
- **SEO and sharing:** per-page `<title>`, meta description, canonical URL, Open Graph and Twitter tags in `BaseLayout`, plus a sitemap and RSS.
- **Recruiter-first:** resume and contact links in the header or footer on every page.

## 7. Deployment

- **Pages source:** set to **GitHub Actions** in repo Settings → Pages. Do **not** use "Deploy from branch → `/docs`", because `docs/` here holds design docs, not the built site.
- **Workflow:** `.github/workflows/deploy.yml` uses `withastro/action` to build, then `actions/deploy-pages` to deploy. It runs on push to `main` and on manual dispatch.
- **`astro.config.mjs`:** a `CUSTOM_DOMAIN` flag picks `site` and `base`:
  ```js
  const CUSTOM_DOMAIN = false;

  export default defineConfig({
    site: CUSTOM_DOMAIN ? 'https://geowittejr.com' : 'https://geowittejr.github.io',
    base: CUSTOM_DOMAIN ? '/' : '/geowittejr-dot-com',
    integrations: [react(), mdx(), sitemap()],
    vite: { plugins: [tailwindcss()] },
  });
  ```
- **Current URL:** `https://geowittejr.github.io/geowittejr-dot-com/`. All internal links use `url()` so the base path is applied everywhere.
- **Switching to the custom domain** (`geowittejr.com` is owned):
  1. DNS: A/AAAA records (or ALIAS) for the apex pointing at GitHub Pages, plus a `www` CNAME to `geowittejr.github.io`.
  2. Repo Settings → Pages → Custom domain: `geowittejr.com`; enforce HTTPS. (`public/CNAME` already contains it.)
  3. Set `CUSTOM_DOMAIN = true` in `astro.config.mjs` and push.
- **Drafts:** `draft: true` entries are filtered out of all listings and routes in production builds.

## 8. Milestones

- [ ] **M1: Scaffold.** Astro + TS + React/MDX/sitemap integrations, folder structure above, deploy workflow, and a "hello world" live.
  - [x] Astro project, integrations, strict TS, content schemas, placeholder pages, deploy workflow, `CNAME`
  - [x] Merge to `main`
  - [ ] Set Pages source to GitHub Actions; confirm the site is live at the default GitHub URL
  - [ ] Later: switch to `geowittejr.com` (steps in [§7](#7-deployment))
- [x] **M2: Layout & design.** BaseLayout, Header and Footer, global styles, dark mode, SEO meta.
  - Dark mode: `data-theme` on `<html>`, set pre-paint by an inline script (stored choice, else OS); `ThemeToggle.tsx` island flips and persists it; no-JS falls back to `prefers-color-scheme`. Shiki dual themes follow it.
  - `BaseLayout` props: `title`, `description`, `image` (OG/Twitter; default image lands in M5), `type` + `publishedTime`/`modifiedTime` for posts, `noindex`.
  - Resume link in the header; skip link, focus rings, prose/code/table styles.
- [x] **M3: Content collections.** Schemas, project and writing index and detail pages, RSS.
  - `src/lib/content.ts`: `getProjects()` (year desc, then title) and `getPosts()` (newest first). Drafts show in dev (with a "Draft" label) and are excluded from production builds, including routes and RSS.
  - Pages: `/projects`, `/projects/[slug]` (role, year, stack, links, optional cover), `/writing`, `/writing/[slug]` (dates, tags, article meta), `/rss.xml`. Home shows up to 4 featured projects and the 3 latest posts.
  - Components: `ProjectCard`, `PostCard`, `TagList`, `FormattedDate`. RSS is linked in `<head>` and the footer.
  - Also: migrated styles to Tailwind v4 and added base-path support (`url()`) for the default GitHub URL.
- [ ] **M4: Real content.** About page, resume PDF, 3–4 project case studies, 1–2 posts.
  - [x] Scaffolds: About page sections (bio, experience, skills, resume) with TODOs; `case-study-1..4.md` (1–3 featured) and `post-1..2.md` as `draft: true` with the case-study / post outline and prompts; example files removed
  - [ ] Fill in About, `LINKS.linkedin` / `LINKS.email` in `consts.ts`
  - [ ] Add `public/resume.pdf` (header/footer/About links 404 until then)
  - [ ] Write case studies and posts, rename files to real slugs, set `draft: false`
- [ ] **M5: Polish.** Lighthouse/a11y pass, OG image, 404 page.

## 9. Open Questions

None right now. Resolved questions are recorded in the [Decision Log](#decision-log).

## Decision Log

Newest first. Each entry records what was decided and why, so the reasoning survives.

| Date       | Decision                                                                 | Rationale                                                          |
| ---------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| 2026-10-14 | Serve from the default GitHub URL for now, behind a `CUSTOM_DOMAIN` flag | `geowittejr.com` is owned but DNS isn't set yet; one-line switch later |
| 2026-10-14 | Internal links via `url()` helper; `about` is `.mdx` so it can use it    | Base path must apply everywhere; Astro 7's Markdown processor makes a rehype link plugin extra setup |
| 2026-10-14 | Tailwind CSS v4 + typography plugin, colors as theme-token CSS variables | Faster iteration in markup; tokens keep the existing dark-mode approach |
| 2026-10-14 | No analytics for now                                                     | Nothing to measure yet; zero third-party JS                        |
| 2026-10-14 | npm as package manager                                                   | Default, already in use                                            |
| 2026-10-14 | Theme via `data-theme` + inline pre-paint script; toggle is a React island | No flash of wrong theme; user choice persists; works without JS    |
| 2026-10-14 | Astro 7 + Zod 4 (`import { z } from 'astro/zod'`), Node 22+              | Current stable at scaffold time; old `astro:content` `z` is deprecated |
| 2026-10-14 | Deploy via GitHub Actions, not "deploy from branch"                      | Standard for Astro; frees `docs/` for design docs                  |
| 2026-10-14 | Keep design docs in `docs/` with a shared template                       | Planning lives with the code; this plan is the top-level doc       |
| 2026-10-14 | Name the posts section `writing/`, not `blog/`                           | Reads more senior; fits "thoughts on subjects"                     |
| 2026-10-14 | Add a `featured` flag on projects                                        | Home page shows a curated 3–4, not everything                      |
| 2026-10-14 | Write projects as case studies (problem → role → decisions → outcome)    | Shows judgment and impact, which is what senior roles are hired for |
| 2026-10-14 | Default to `.astro`; React only for interactive islands                  | Zero JS by default means a fast site, and speed is part of the pitch |
| 2026-10-14 | Content collections with Zod schemas for projects and writing            | Type-safe frontmatter; adding content is a Markdown file           |
| 2026-10-14 | Astro static site + Markdown/MDX + React on GitHub Pages                 | Content-first, simple, free hosting                                |
