# Workers URL Alignment Design

Date: 2026-04-05

## Goal

Align all public-facing metadata and SEO URLs with the currently published Cloudflare Workers URL so the DMM review submission uses a self-consistent public site.

## Current Problem

- The public site is being reviewed at a `workers.dev` URL.
- The app metadata still points to `https://fanza-navi.pages.dev`.
- `robots.txt` and `sitemap.xml` also point to `https://fanza-navi.pages.dev`.
- This creates an avoidable mismatch between the submitted URL and the URLs exposed inside the site.

## Recommended Approach

Apply a minimal URL-only fix.

- Update `SITE_URL` to the currently published `workers.dev` URL.
- Keep route structure unchanged.
- Keep all current page content unchanged.
- Regenerate the static export after the metadata change.

## Scope

In scope:

- `src/lib/site.ts`
- Metadata and structured data that derive from `SITE_URL`
- `public/robots.txt`
- `public/sitemap.xml`
- Regenerated `out/` export

Out of scope:

- Changing affiliate disclosure wording
- Rewriting "準備中" sections
- Adding DMM API integration
- Changing deployment method

## Why This Approach

- It fixes the highest-signal inconsistency before review.
- It minimizes risk by not changing site behavior or content structure.
- It can be deployed immediately through the current Direct Upload flow.

## Verification

1. Update the public URL constant.
2. Run `npm run build`.
3. Confirm generated files reference the `workers.dev` URL.
4. Re-upload the regenerated `out/` directory to Cloudflare.
