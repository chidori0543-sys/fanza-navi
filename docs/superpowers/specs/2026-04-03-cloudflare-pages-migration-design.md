# Cloudflare Pages Migration Design

Date: 2026-04-03

## Goal

Move the site from GitHub Pages to Cloudflare Pages with the smallest possible change set, while keeping the current static-export deployment model.

## Current State

- The app is a Next.js static export site.
- [next.config.mjs](/Users/thisdevice/dmm-affiliate-site/next.config.mjs) contains `output: "export"`.
- The config also contains a GitHub Pages-specific `basePath: "/fanza-navi"`.
- The build currently outputs static files to `out/`.

## Recommended Approach

Use a Cloudflare-only configuration for this repository.

- Remove the GitHub Pages-specific `basePath`.
- Keep `output: "export"` so Cloudflare Pages can serve the generated `out/` directory.
- Keep image optimization disabled.
- Keep remote image allowlist as-is.
- Update documentation to use Cloudflare Pages deployment settings.

## Why This Approach

- It is the smallest possible change.
- It removes GitHub Pages coupling from URLs and asset paths.
- It keeps the deployment flow identical for future static affiliate sites.
- It avoids adding environment-based branching for a host that is no longer needed.

## Out of Scope

- Reworking the site for SSR or Pages Functions.
- Changing page structure, content, or affiliate logic.
- Adding dual-host support for GitHub Pages.

## Implementation Plan

1. Update `next.config.mjs` to remove `basePath`.
2. Update README deployment instructions from GitHub Pages to Cloudflare Pages.
3. Run focused verification:
   - `npm test`
   - `npm run build`
4. Confirm the generated export still targets `out/`.

## Cloudflare Pages Settings

- Framework preset: `None` or `Next.js (static export)` if offered by the dashboard
- Build command: `npm run build`
- Build output directory: `out`

## Risks

- Absolute or hard-coded `/fanza-navi` references elsewhere in the codebase would break after removing `basePath`.
- README examples may become stale if Cloudflare dashboard wording changes.

## Verification

- Search the repo for `/fanza-navi` references.
- Run the existing test suite.
- Run a production build and confirm static export succeeds.
