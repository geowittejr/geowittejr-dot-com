# geowittejr.com

Personal portfolio site, built with [Astro](https://astro.build) and deployed to GitHub Pages.

- **Plan and decisions:** [`project-plan.md`](project-plan.md)
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

Frontmatter schemas are in [`src/content.config.ts`](src/content.config.ts). Set `draft: true` to hide an entry.

## Deploy

Pushing to `main` builds and deploys via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). In repo Settings → Pages, the source must be **GitHub Actions**.
