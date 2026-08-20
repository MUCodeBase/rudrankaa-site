# Rudrankaa Website

Responsive one-page website for Rudrankaa, prepared for GitHub Pages and the custom domain `rudrankaa.com`.

## Files

- `index.html` — website content and page structure
- `styles.css` — complete responsive design
- `script.js` — mobile navigation and small interface enhancements

## Publishing

The site is designed to publish directly from the repository's `main` branch using GitHub Pages.

## Myth Busters gallery

Published flyers live in `assets/myth-busters/` and must use this filename format:

```text
MB_DDMMYYYY_X.jpg
```

Examples for two flyers published on 20 August 2026:

```text
MB_20082026_1.jpg
MB_20082026_2.jpg
```

The `MB` prefix and `.jpg` extension are case-insensitive, so names such as
`mb_20082026_1.jpg` and `Mb_20082026_1.JPG` are also accepted. The date,
underscores and sequence number must still follow the format exactly. Do not
upload duplicate filenames that differ only by capitalization.

Upload only the single portrait flyer used for both mobile and desktop. The responsive gallery preserves the complete image without cropping it.

When a matching image is added or removed, the `Update Myth Busters gallery` GitHub Actions workflow regenerates `assets/myth-busters/manifest.json`. The website then displays the newest date first and preserves ascending sequence order within the same date.
