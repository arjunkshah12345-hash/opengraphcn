# Deploying to GitHub Pages

The site is static: Vite build, hash routes (`#/studio`), registry JSON under `/r/`.

1. Push to `main`. `.github/workflows/deploy.yml` runs lint, typecheck, tests and `npm run build`, then publishes `dist/` with `actions/deploy-pages`.
2. In the repository: **Settings → Pages → Source: GitHub Actions**.

Production builds use the base path `/opengraphcn/`. For a fork or custom domain:

```bash
BASE_PATH=/ npm run build
```

and update `GITHUB_OWNER` / `REPO_NAME` in `src/lib/site.ts` so registry URLs and install commands point at your deployment (the registry builder reads them).

Local preview of the production build: `npm run build && npm run preview` → http://localhost:4173/opengraphcn/
