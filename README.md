# Rudrankaa Website

Responsive static website for Rudrankaa, published from the `main` branch with GitHub Pages and the custom domain `rudrankaa.com`.

## Main structure

- `index.html` — homepage structure and core content
- `styles-v2.css` — shared responsive site styling
- `site-navigation.js` — shared header, mobile navigation and footer-year behaviour
- `birth-number.js` / `birth-number.css` — consolidated interactive Birth Number experience
- `service-details.js` / `service-details.css` — service detail dialog interactions; approved service summaries remain in HTML
- `myth-busters.html`, `myth-busters.js`, `myth-busters.css` — Myth Busters archive and viewer
- `disclaimer.html`, `terms.html`, `privacy.html`, `legal.css` — legal content and shared footer styling
- `assets/` — approved site images, service icons, watermarks and Myth Buster assets
- `scripts/` — repository automation and validation scripts

## Publishing discipline

Use the controlled workflow for website changes:

**stable release → branch → preview → inspect → iterate → approve → merge → production → release**

Avoid direct feature changes on `main`. Preview branches are deployed separately through the configured Cloudflare Workers preview environment.

## Structural source of truth

Approved visitor-facing credentials, service summaries, FAQ answers, disclaimers and footer content live directly in the HTML rather than being rewritten after page load. JavaScript is reserved for interaction and progressive enhancement.

## Automated health checks

The `Site health` GitHub Actions workflow runs for pull requests and for pushes to `main`. It:

1. syntax-checks all JavaScript and MJS files;
2. checks local HTML/CSS asset references;
3. detects duplicate HTML IDs;
4. validates the Myth Busters manifest, counters, thumbnails and sort order;
5. fails when a Myth Buster source PNG exceeds 5 MiB and warns above 3 MiB; and
6. checks for whitespace errors.

For the check to block an unsafe merge, configure branch protection/rulesets so the Site health validation job is required before merging to `main`. Repository CI can reject a pushed file from a healthy release, but it cannot erase a file that has already been pushed into Git history.

## Myth Busters gallery

Published source flyers live in `assets/myth-busters/` and must use this filename format:

```text
MB_<counter>_DDMMYYYY.png
```

For example:

```text
MB_05_22082026.png
MB_06_23082026.png
```

The `MB` prefix and `.png` extension are case-insensitive. The counter must be a unique positive number. The date, underscores and field order must follow the format exactly, and filenames must not differ only by capitalization.

The gallery sorts flyers by counter in descending order, so the highest counter appears first regardless of the date.

Upload only the single portrait PNG source flyer used for both mobile and desktop. Do not manually create or edit files in `assets/myth-busters/thumbnails/` or manually edit `assets/myth-busters/manifest.json`.

When a matching source image is added, changed or removed, the `Update Myth Busters gallery` workflow automatically:

1. checks the source PNG size;
2. generates a lightweight 720 px-wide WebP card image only for a new or changed source;
3. reuses existing thumbnails when the source fingerprint and thumbnail recipe are unchanged;
4. removes orphaned generated thumbnails; and
5. regenerates the manifest in descending counter order.

Incremental thumbnail fingerprints are stored in `assets/myth-busters/thumbnails/.source-hashes.json`. The cache includes the thumbnail-generation recipe as well as the source content hash, so a future change to the WebP recipe can invalidate and regenerate affected thumbnails safely. Existing thumbnails are trusted during the one-time cache bootstrap; the cache is first persisted when a real thumbnail generation or orphan cleanup occurs.

Source PNGs above 3 MiB generate a warning. A source above 5 MiB causes gallery generation and Site health validation to fail. If such a file was already pushed to a branch, the failure prevents it from being treated as a healthy release but does not remove that object from Git history.

The homepage displays the two highest-counter flyers on mobile and the four highest-counter flyers on larger screens. `myth-busters.html` provides the complete archive and reveals eight flyers at a time through **Load More**. Gallery cards use lightweight WebP thumbnails; the full-resolution PNG is loaded only when a visitor opens a flyer.

The full-resolution viewer starts fitted to the available width on mobile and desktop. At the 100% fit-to-width baseline, portrait flyers can be read by vertical scrolling. Zoom controls, pinch-to-zoom, double-tap zoom and drag/pan remain available up to 300%.
