import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const resolve = (...parts) => path.join(repositoryRoot, ...parts);

const replaceExact = async (file, oldText, newText, expectedCount = 1) => {
  const filePath = resolve(file);
  let content = await readFile(filePath, "utf8");
  const occurrences = content.split(oldText).length - 1;

  if (occurrences !== expectedCount) {
    throw new Error(`${file}: expected ${expectedCount} occurrence(s) of target text, found ${occurrences}.`);
  }

  content = content.split(oldText).join(newText);
  await writeFile(filePath, content, "utf8");
};

const addLazyWatermarkAttributes = async (watermark) => {
  const filePath = resolve("index.html");
  let content = await readFile(filePath, "utf8");
  const marker = `src="${watermark}"`;
  const markerIndex = content.indexOf(marker);

  if (markerIndex < 0) throw new Error(`index.html: watermark source not found: ${watermark}`);

  const tagEnd = content.indexOf("/>", markerIndex);
  if (tagEnd < 0) throw new Error(`index.html: watermark img tag is not closed: ${watermark}`);

  const currentTag = content.slice(markerIndex, tagEnd);
  if (currentTag.includes('loading="lazy"') || currentTag.includes('fetchpriority="low"')) {
    throw new Error(`index.html: watermark already contains lazy-load attributes: ${watermark}`);
  }

  const decodingMarker = 'decoding="async"';
  const decodingIndex = content.indexOf(decodingMarker, markerIndex);
  if (decodingIndex < 0 || decodingIndex > tagEnd) {
    throw new Error(`index.html: decoding marker not found inside watermark tag: ${watermark}`);
  }

  const insertion = 'loading="lazy"\n          fetchpriority="low"\n          ';
  content = content.slice(0, decodingIndex) + insertion + content.slice(decodingIndex);
  await writeFile(filePath, content, "utf8");
};

await replaceExact("index.html", 'src="script-v2.js?v=10"', 'src="script-v2.js?v=11"');
await replaceExact("index.html", 'src="myth-busters.js?v=4"', 'src="myth-busters.js?v=5"');
await replaceExact("myth-busters.html", 'src="myth-busters.js?v=4"', 'src="myth-busters.js?v=5"');

await addLazyWatermarkAttributes("assets/watermarks/ardhanarishwar-watermark.webp");
await addLazyWatermarkAttributes("assets/watermarks/om-watermark.webp");

await replaceExact(
  "script-v2.js",
  'legalStylesheet.href = "legal.css?v=2";',
  'legalStylesheet.href = "legal.css?v=3";'
);

await replaceExact(
  "legal-footer.js",
  `(() => {\n  const legalStylesheet = document.querySelector('link[href^="legal.css"]');\n  if (legalStylesheet && legalStylesheet.getAttribute("href") !== "legal.css?v=3") {\n    legalStylesheet.setAttribute("href", "legal.css?v=3");\n  }\n\n  if (!document.querySelector("#footer-directory-spacing-fix")) {`,
  `(() => {\n  if (!document.querySelector("#footer-directory-spacing-fix")) {`
);

await replaceExact(
  "myth-busters.js",
  `    if (panPointerId === event.pointerId && panLastPoint && zoom > minimumZoom) {\n      event.preventDefault();\n      dialogViewport.scrollBy({\n        left: panLastPoint.x - currentPoint.x,\n        top: panLastPoint.y - currentPoint.y,\n      });\n    }`,
  `    const canScrollVertically = dialogViewport.scrollHeight > dialogViewport.clientHeight;\n\n    if (\n      panPointerId === event.pointerId &&\n      panLastPoint &&\n      (zoom > minimumZoom || canScrollVertically)\n    ) {\n      event.preventDefault();\n      dialogViewport.scrollBy({\n        left: zoom > minimumZoom ? panLastPoint.x - currentPoint.x : 0,\n        top: panLastPoint.y - currentPoint.y,\n      });\n    }`
);

const readme = `# Rudrankaa Website

Responsive static website for Rudrankaa, published from the \`main\` branch with GitHub Pages and the custom domain \`rudrankaa.com\`.

## Main structure

- \`index.html\` — homepage structure and core content
- \`styles-v2.css\` — shared responsive site styling
- \`script-v2.js\` — homepage behaviour and feature bootstrap
- \`birth-number.js\`, \`birth-number-refinements.js\`, \`hero-number-pad-refinement.js\` — current interactive Birth Number experience
- \`service-details.js\` / \`service-details.css\` — service detail interactions
- \`myth-busters.html\`, \`myth-busters.js\`, \`myth-busters.css\` — Myth Busters archive and viewer
- \`disclaimer.html\`, \`terms.html\`, \`privacy.html\`, \`legal.css\`, \`legal-footer.js\` — legal and footer content
- \`assets/\` — approved site images, service icons, watermarks and Myth Buster assets
- \`scripts/\` — repository automation and validation scripts

## Publishing discipline

Use the controlled workflow for website changes:

**stable release → branch → preview → inspect → iterate → approve → merge → production → release**

Avoid direct feature changes on \`main\`. Preview branches are deployed separately through the configured Cloudflare Workers preview environment.

## Automated health checks

The \`Site health\` GitHub Actions workflow runs for pull requests and for pushes to \`main\`. It:

1. syntax-checks all JavaScript and MJS files;
2. checks local HTML/CSS asset references;
3. detects duplicate HTML IDs;
4. validates the Myth Busters manifest, counters, thumbnails and sort order;
5. fails when a Myth Buster source PNG exceeds 5 MiB and warns above 3 MiB; and
6. checks for whitespace errors.

For the check to block an unsafe merge, configure branch protection/rulesets so the Site health validation job is required before merging to \`main\`. Repository CI can reject a pushed file from a healthy release, but it cannot erase a file that has already been pushed into Git history.

## Myth Busters gallery

Published source flyers live in \`assets/myth-busters/\` and must use this filename format:

\`\`\`text
MB_<counter>_DDMMYYYY.png
\`\`\`

For example:

\`\`\`text
MB_05_22082026.png
MB_06_23082026.png
\`\`\`

The \`MB\` prefix and \`.png\` extension are case-insensitive. The counter must be a unique positive number. The date, underscores and field order must follow the format exactly, and filenames must not differ only by capitalization.

The gallery sorts flyers by counter in descending order, so the highest counter appears first regardless of the date.

Upload only the single portrait PNG source flyer used for both mobile and desktop. Do not manually create or edit files in \`assets/myth-busters/thumbnails/\` or manually edit \`assets/myth-busters/manifest.json\`.

When a matching source image is added, changed or removed, the \`Update Myth Busters gallery\` workflow automatically:

1. checks the source PNG size;
2. generates a lightweight 720 px-wide WebP card image;
3. removes orphaned generated thumbnails; and
4. regenerates the manifest in descending counter order.

Source PNGs above 3 MiB generate a warning. A source above 5 MiB causes gallery generation and Site health validation to fail. If such a file was already pushed to a branch, the failure prevents it from being treated as a healthy release but does not remove that object from Git history.

The homepage displays the two highest-counter flyers on mobile and the four highest-counter flyers on larger screens. \`myth-busters.html\` provides the complete archive and reveals eight flyers at a time through **Load More**. Gallery cards use lightweight WebP thumbnails; the full-resolution PNG is loaded only when a visitor opens a flyer.

The full-resolution viewer starts fitted to the available width on mobile and desktop. At the 100% fit-to-width baseline, portrait flyers can be read by vertical scrolling. Zoom controls, pinch-to-zoom, double-tap zoom and drag/pan remain available up to 300%.
`;

await writeFile(resolve("README.md"), readme, "utf8");

for (const obsoleteFile of [
  ".github/v1.4.0-trust-clarity.md",
  "styles.css",
]) {
  await rm(resolve(obsoleteFile), { force: true });
}

for (const oneTimeFile of [
  "scripts/apply-part1-cleanup.mjs",
  "scripts/apply-part1-cleanup-v2.mjs",
  "scripts/apply-part1-cleanup-v3.mjs",
]) {
  await rm(resolve(oneTimeFile), { force: true });
}

console.log("Part 1 code and repository cleanup applied successfully.");
