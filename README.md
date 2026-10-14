# geowittejr.com

Personal portfolio site, built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com), deployed to GitHub Pages at <https://geowittejr.com/>.

- **Plan and decisions:** [`docs/project-plan.md`](docs/project-plan.md)
- **Design docs:** [`docs/`](docs/README.md)

## Develop

Requires Node 22+.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # type-check + build to dist/
npm run preview   # serve dist/ locally
```

## Add content

- **Project:** add `src/content/projects/<slug>.md`
- **Post:** add `src/content/writing/<slug>.md`

Frontmatter schemas are in [`src/content.config.ts`](src/content.config.ts). Set `draft: true` to hide an entry from production builds (drafts still show in `npm run dev`).

Internal links must use `url()` from [`src/lib/url.ts`](src/lib/url.ts) so they include the site's base path.

## Deploy

Pushing to `main` builds and deploys via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). In repo Settings → Pages, the source must be **GitHub Actions**.
