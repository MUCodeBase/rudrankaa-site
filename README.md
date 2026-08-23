# Rudrankaa Website

Responsive one-page website for Rudrankaa, prepared for GitHub Pages and the custom domain `rudrankaa.com`.

## Files

- `index.html` — website content and page structure
- `styles.css` — complete responsive design
- `script.js` — mobile navigation and small interface enhancements

## Publishing

The site is designed to publish directly from the repository's `main` branch using GitHub Pages.

## Myth Busters gallery

Published source flyers live in `assets/myth-busters/` and must use this filename format:

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

Upload only the single portrait PNG source flyer used for both mobile and desktop.
The responsive gallery preserves the complete artwork without cropping it.

When a matching source image is added, changed or removed, the `Update Myth Busters gallery`
GitHub Actions workflow automatically:

1. checks the source PNG size;
2. generates a lightweight WebP card image in `assets/myth-busters/thumbnails/`;
3. removes any orphaned generated thumbnails; and
4. regenerates `assets/myth-busters/manifest.json` in descending counter order.

Do not manually upload or edit files in the `thumbnails` folder. The source PNG remains the
full-quality artwork and is loaded only when a visitor opens a Myth Buster. Gallery cards use
the generated WebP image to reduce page bandwidth while preserving the original for detailed viewing.

Source PNGs above 3 MiB generate a workflow warning. Files above 5 MiB are rejected so an
unexpectedly oversized asset does not silently enter the published gallery.

The homepage displays the two highest-counter flyers on mobile and the four highest-counter flyers on larger screens. `myth-busters.html` provides the complete archive and reveals eight flyers at a time through its **Load More** control. Both views use the same manifest and image files.
