# Rudrankaa Website

Responsive one-page website for Rudrankaa, prepared for GitHub Pages and the custom domain `rudrankaa.com`.

## Files

- `index.html` — website content and page structure
- `styles.css` — complete responsive design
- `script.js` — mobile navigation and small interface enhancements

## Publishing

The site is designed to publish directly from the repository's `main` branch using GitHub Pages.

## Myth Busters gallery

Published flyers live in `assets/myth-busters/` and must use this exact filename format:

```text
MB_DDMMYYYY_X.jpg
```

Examples for two flyers published on 20 August 2026:

```text
MB_20082026_1.jpg
MB_20082026_2.jpg
```

Upload only the single portrait flyer used for both mobile and desktop. The responsive gallery preserves the complete image without cropping it.

When a matching image is added or removed, the `Update Myth Busters gallery` GitHub Actions workflow regenerates `assets/myth-busters/manifest.json`. The website then displays the newest date first and preserves ascending sequence order within the same date.
