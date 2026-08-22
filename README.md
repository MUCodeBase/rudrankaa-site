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
MB_<counter>_DDMMYYYY.png
```

Examples for two flyers published on 20 August 2026:

```text
MB_1_20082026.png
MB_2_20082026.png
```

The `MB` prefix and `.png` extension are case-insensitive, so names such as
`mb_1_20082026.png` and `Mb_2_20082026.PNG` are also accepted. The counter must
be a unique positive number. The date, underscores and field order must still
follow the format exactly. Do not upload duplicate filenames that differ only
by capitalization.

The gallery sorts flyers by counter in descending order, so the highest counter
appears first regardless of the date. Legacy date-first JPG and JPEG files are
ignored during migration and should be removed after their PNG replacements
have been uploaded.

Upload only the single portrait flyer used for both mobile and desktop. The responsive gallery preserves the complete image without cropping it.

When a matching image is added or removed, the `Update Myth Busters gallery` GitHub Actions workflow regenerates `assets/myth-busters/manifest.json` using the counter order.

The homepage displays the two highest-counter flyers on mobile and the four highest-counter flyers on larger screens. `myth-busters.html` provides the complete archive and reveals eight flyers at a time through its **Load More** control. Both views use the same manifest and image files.
