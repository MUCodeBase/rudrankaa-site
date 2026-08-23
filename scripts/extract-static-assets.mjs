import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const indexPath = path.join(repositoryRoot, "index.html");
const stylesheetPath = path.join(repositoryRoot, "styles-v2.css");
const logoPath = path.join(repositoryRoot, "assets", "rudrankaa-logo.png");

const originalIndex = await readFile(indexPath, "utf8");
const originalStylesheet = await readFile(stylesheetPath, "utf8");

// The logo source is extracted byte-for-byte from the currently approved embedded PNG.
// Its display CSS is deliberately untouched so crop, alignment, size and mobile positioning
// remain exactly as they are on the approved site.
const logoPattern = /(<img\s+[^>]*class="brand-logo"[^>]*\bsrc=")data:image\/png;base64,([^"]+)(")/;
const logoMatch = originalIndex.match(logoPattern);

if (!logoMatch) {
  throw new Error("Could not find the approved embedded Rudrankaa brand-logo PNG. No files were changed.");
}

const logoBytes = Buffer.from(logoMatch[2].replace(/\s+/g, ""), "base64");
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

if (!logoBytes.subarray(0, pngSignature.length).equals(pngSignature)) {
  throw new Error("The extracted brand-logo data is not a valid PNG. No files were changed.");
}

const requiredLogoLayoutTokens = [
  ".site-header .brand-logo-frame",
  "width: 220px !important",
  "height: 72px !important",
  "top: -38px !important",
  "width: 174px !important",
  "height: 60px !important",
  "top: -30px !important",
];

for (const token of requiredLogoLayoutTokens) {
  if (!originalIndex.includes(token)) {
    throw new Error(`Expected approved logo layout token was not found: ${token}. No files were changed.`);
  }
}

await mkdir(path.dirname(logoPath), { recursive: true });
await writeFile(logoPath, logoBytes);

let optimizedIndex = originalIndex.replace(
  logoPattern,
  `$1assets/rudrankaa-logo.png$3`,
);

// Refresh only the Myth Busters script cache key because that script now serves thumbnails.
optimizedIndex = optimizedIndex.replace(
  '<script defer src="myth-busters.js?v=3"></script>',
  '<script defer src="myth-busters.js?v=4"></script>',
);

for (const token of requiredLogoLayoutTokens) {
  if (!optimizedIndex.includes(token)) {
    throw new Error(`Logo layout changed unexpectedly while extracting the asset: ${token}`);
  }
}

// The old pseudo-element watermark payload is no longer rendered: a later rule explicitly
// hides that pseudo-element and the visible watermark uses the external watermark asset.
// Remove only the dead embedded data URL; leave every layout/style declaration untouched.
const hiddenLegacyWatermarkRule = /\.about::after,\s*\n\.contact-card::before\s*\{\s*\n\s*display:\s*none;\s*\n\}/;

if (!hiddenLegacyWatermarkRule.test(originalStylesheet)) {
  throw new Error("The legacy watermark pseudo-element is not confirmed hidden. Stylesheet was not changed.");
}

const embeddedWatermarkPattern = /(\.about::after\s*\{[\s\S]*?\bbackground:\s*)url\("data:image\/webp;base64,[^"]+"\)(\s*;)/;

if (!embeddedWatermarkPattern.test(originalStylesheet)) {
  throw new Error("Could not find the obsolete embedded watermark payload. Stylesheet was not changed.");
}

const optimizedStylesheet = originalStylesheet.replace(
  embeddedWatermarkPattern,
  "$1none$2",
);

if (optimizedStylesheet.includes('background: url("data:image/webp;base64,')) {
  throw new Error("An embedded WebP background remains after cleanup. Stylesheet was not written.");
}

await writeFile(indexPath, optimizedIndex, "utf8");
await writeFile(stylesheetPath, optimizedStylesheet, "utf8");

const [indexBefore, indexAfter, cssBefore, cssAfter, logoStats] = await Promise.all([
  Promise.resolve(Buffer.byteLength(originalIndex)),
  stat(indexPath).then((value) => value.size),
  Promise.resolve(Buffer.byteLength(originalStylesheet)),
  stat(stylesheetPath).then((value) => value.size),
  stat(logoPath),
]);

const logoHash = createHash("sha256").update(logoBytes).digest("hex");

console.log(`Extracted approved logo: ${logoStats.size} bytes, SHA-256 ${logoHash}`);
console.log(`index.html: ${indexBefore} -> ${indexAfter} bytes`);
console.log(`styles-v2.css: ${cssBefore} -> ${cssAfter} bytes`);
