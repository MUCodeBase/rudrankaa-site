import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const ignoredDirectories = new Set([".git", "node_modules", ".wrangler"]);
const errors = [];
const warnings = [];

const toPosix = (value) => value.split(path.sep).join("/");

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;

    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(absolutePath));
    } else if (entry.isFile()) {
      files.push(toPosix(path.relative(repositoryRoot, absolutePath)));
    }
  }

  return files;
};

const repositoryFiles = await walk(repositoryRoot);
const repositoryFileSet = new Set(repositoryFiles);

const localReference = (reference, sourceFile) => {
  const value = reference.trim();
  if (
    !value ||
    value.startsWith("#") ||
    /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(value)
  ) {
    return null;
  }

  const withoutFragment = value.split("#", 1)[0].split("?", 1)[0];
  if (!withoutFragment) return null;

  let decodedReference;
  try {
    decodedReference = decodeURIComponent(withoutFragment);
  } catch {
    decodedReference = withoutFragment;
  }

  const absoluteTarget = decodedReference.startsWith("/")
    ? path.join(repositoryRoot, decodedReference.slice(1))
    : path.resolve(repositoryRoot, path.dirname(sourceFile), decodedReference);

  const relativeTarget = toPosix(path.relative(repositoryRoot, absoluteTarget));
  if (relativeTarget.startsWith("../") || relativeTarget === "..") {
    errors.push(`${sourceFile}: local reference escapes the repository root: ${reference}`);
    return null;
  }

  return relativeTarget;
};

for (const htmlFile of repositoryFiles.filter((file) => file.endsWith(".html"))) {
  const html = await readFile(path.join(repositoryRoot, htmlFile), "utf8");
  const ids = new Set();
  const duplicateIds = new Set();

  for (const match of html.matchAll(/\bid=["']([^"']+)["']/gi)) {
    const id = match[1];
    if (ids.has(id)) duplicateIds.add(id);
    ids.add(id);
  }

  for (const id of duplicateIds) {
    errors.push(`${htmlFile}: duplicate id "${id}"`);
  }

  for (const match of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)) {
    const target = localReference(match[1], htmlFile);
    if (target && !repositoryFileSet.has(target)) {
      errors.push(`${htmlFile}: missing local asset ${match[1]} -> ${target}`);
    }
  }
}

const publicPageCanonicals = new Map([
  ["index.html", "https://rudrankaa.com/"],
  ["myth-busters.html", "https://rudrankaa.com/myth-busters.html"],
  ["disclaimer.html", "https://rudrankaa.com/disclaimer.html"],
  ["terms.html", "https://rudrankaa.com/terms.html"],
  ["privacy.html", "https://rudrankaa.com/privacy.html"],
]);

for (const [htmlFile, canonicalUrl] of publicPageCanonicals) {
  const html = await readFile(path.join(repositoryRoot, htmlFile), "utf8");
  if (!html.includes(`<link rel="canonical" href="${canonicalUrl}" />`)) {
    errors.push(`${htmlFile}: missing or incorrect canonical URL.`);
  }
  if (!html.includes('assets/favicon.svg')) {
    errors.push(`${htmlFile}: missing shared favicon reference.`);
  }
}

for (const requiredFile of ["assets/favicon.svg", "robots.txt", "sitemap.xml"]) {
  if (!repositoryFileSet.has(requiredFile)) {
    errors.push(`Missing SEO asset: ${requiredFile}`);
  }
}

for (const requiredOptimizedAsset of [
  "assets/rudrankaa-logo-440.webp",
  "assets/watermarks/ardhanarishwar-watermark-520.webp",
  "assets/watermarks/om-watermark-420.webp",
  "myth-busters-loader.js",
]) {
  if (!repositoryFileSet.has(requiredOptimizedAsset)) {
    errors.push(`Missing optimized display asset: ${requiredOptimizedAsset}`);
  }
}

const homepageHtml = await readFile(path.join(repositoryRoot, "index.html"), "utf8");

for (const requiredHomepageSeo of [
  'property="og:title"',
  'property="og:description"',
  'property="og:url" content="https://rudrankaa.com/"',
  'name="twitter:card"',
  'type="application/ld+json"',
]) {
  if (!homepageHtml.includes(requiredHomepageSeo)) {
    errors.push(`index.html: missing SEO metadata marker ${requiredHomepageSeo}`);
  }
}

if (homepageHtml.includes('Prevent the source logo from expanding if an external stylesheet is delayed or cached.')) {
  errors.push('index.html: legacy inline logo fallback CSS should not be present.');
}

const serviceCardCount = (homepageHtml.match(/<article class="service-card(?: featured-card)?">/g) || []).length;
const serviceKeyMatches = Array.from(homepageHtml.matchAll(/data-service-key="([^"]+)"/g), (match) => match[1]);
const expectedServiceKeys = new Set([
  "manifestation-grid",
  "name-energy",
  "personal-numerology",
  "business-career",
  "critical-number",
  "rudraksha-crystal-yantra",
]);

if (serviceCardCount !== 6) {
  errors.push(`Expected exactly 6 homepage service cards, found ${serviceCardCount}.`);
}
if (serviceKeyMatches.length !== 6 || serviceKeyMatches.some((key) => !expectedServiceKeys.has(key)) || new Set(serviceKeyMatches).size !== 6) {
  errors.push("Homepage service detail triggers must contain the 6 unique approved service keys.");
}

for (const cssFile of repositoryFiles.filter((file) => file.endsWith(".css"))) {
  const css = await readFile(path.join(repositoryRoot, cssFile), "utf8");

  for (const match of css.matchAll(/url\(\s*(["']?)([^"')]+)\1\s*\)/gi)) {
    const target = localReference(match[2], cssFile);
    if (target && !repositoryFileSet.has(target)) {
      errors.push(`${cssFile}: missing local asset ${match[2]} -> ${target}`);
    }
  }
}

const galleryDirectory = path.join(repositoryRoot, "assets", "myth-busters");
const thumbnailDirectory = path.join(galleryDirectory, "thumbnails");
const manifestPath = path.join(galleryDirectory, "manifest.json");
const filenamePattern = /^MB_(\d+)_(\d{2})(\d{2})(\d{4})\.png$/i;
const legacyFilenamePattern = /^MB_(\d{2})(\d{2})(\d{4})_(\d+)\.jpe?g$/i;
const fiveMiB = 5 * 1024 * 1024;
const threeMiB = 3 * 1024 * 1024;

const galleryEntries = await readdir(galleryDirectory, { withFileTypes: true });
const topLevelImageFiles = galleryEntries
  .filter((entry) => entry.isFile() && /\.(?:png|jpe?g|webp)$/i.test(entry.name))
  .map((entry) => entry.name);

const legacyFiles = topLevelImageFiles.filter((file) => legacyFilenamePattern.test(file));
for (const file of legacyFiles) {
  warnings.push(`Legacy Myth Buster file is ignored by the PNG gallery: ${file}`);
}

const sourceFiles = topLevelImageFiles.filter((file) => !legacyFilenamePattern.test(file));
const invalidSourceFiles = sourceFiles.filter((file) => !filenamePattern.test(file));
for (const file of invalidSourceFiles) {
  errors.push(`Invalid Myth Buster filename: ${file}. Use MB_<counter>_DDMMYYYY.png.`);
}

const validSources = sourceFiles.filter((file) => filenamePattern.test(file));
const sourceByCounter = new Map();
const sourceByLowercase = new Map();
const sourceMetadata = new Map();

for (const file of validSources) {
  const lower = file.toLowerCase();
  if (sourceByLowercase.has(lower)) {
    errors.push(`Myth Buster filenames differ only by capitalization: ${sourceByLowercase.get(lower)}, ${file}`);
  }
  sourceByLowercase.set(lower, file);

  const [, counterText, dayText, monthText, yearText] = file.match(filenamePattern);
  const counter = Number(counterText);
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);
  const date = new Date(Date.UTC(year, month - 1, day));
  const validDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  if (!validDate || !Number.isSafeInteger(counter) || counter < 1) {
    errors.push(`Invalid date or counter in Myth Buster filename: ${file}`);
    continue;
  }

  if (sourceByCounter.has(counter)) {
    errors.push(`Duplicate Myth Buster counter ${counter}: ${sourceByCounter.get(counter)}, ${file}`);
  }
  sourceByCounter.set(counter, file);

  const fileStats = await stat(path.join(galleryDirectory, file));
  if (fileStats.size > fiveMiB) {
    errors.push(`${file}: ${(fileStats.size / 1024 / 1024).toFixed(2)} MiB exceeds the 5 MiB source limit.`);
  } else if (fileStats.size > threeMiB) {
    warnings.push(`${file}: ${(fileStats.size / 1024 / 1024).toFixed(2)} MiB is above the preferred 3 MiB target.`);
  }

  sourceMetadata.set(file, {
    counter,
    date: `${yearText}-${monthText}-${dayText}`,
    thumbnail: `thumbnails/${path.parse(file).name}.webp`,
  });
}

let manifest;
try {
  manifest = JSON.parse(await readFile(manifestPath, "utf8"));
} catch (error) {
  errors.push(`Unable to parse assets/myth-busters/manifest.json: ${error.message}`);
  manifest = [];
}

if (!Array.isArray(manifest)) {
  errors.push("assets/myth-busters/manifest.json must contain an array.");
  manifest = [];
}

if (manifest.length !== validSources.length) {
  errors.push(`Myth Buster manifest has ${manifest.length} entries but ${validSources.length} valid source PNGs exist.`);
}

const manifestFiles = new Set();
let previousCounter = Number.POSITIVE_INFINITY;

for (const entry of manifest) {
  if (!entry || typeof entry !== "object") {
    errors.push("Myth Buster manifest contains a non-object entry.");
    continue;
  }

  if (typeof entry.file !== "string") {
    errors.push("Myth Buster manifest entry is missing a string file property.");
    continue;
  }

  if (manifestFiles.has(entry.file)) {
    errors.push(`Duplicate Myth Buster manifest file entry: ${entry.file}`);
  }
  manifestFiles.add(entry.file);

  const expected = sourceMetadata.get(entry.file);
  if (!expected) {
    errors.push(`Manifest references missing or invalid source PNG: ${entry.file}`);
    continue;
  }

  if (entry.counter !== expected.counter) {
    errors.push(`${entry.file}: manifest counter ${entry.counter} does not match filename counter ${expected.counter}.`);
  }
  if (entry.date !== expected.date) {
    errors.push(`${entry.file}: manifest date ${entry.date} does not match filename date ${expected.date}.`);
  }
  if (entry.counter > previousCounter) {
    errors.push("Myth Buster manifest is not sorted by counter in descending order.");
  }
  previousCounter = entry.counter;

  if (entry.thumbnail !== expected.thumbnail) {
    errors.push(`${entry.file}: manifest thumbnail should be ${expected.thumbnail}.`);
  } else if (!repositoryFileSet.has(`assets/myth-busters/${entry.thumbnail}`)) {
    errors.push(`${entry.file}: generated thumbnail is missing: ${entry.thumbnail}`);
  }
}

for (const file of validSources) {
  if (!manifestFiles.has(file)) {
    errors.push(`Valid Myth Buster source PNG is missing from the manifest: ${file}`);
  }
}

const thumbnailEntries = await readdir(thumbnailDirectory, { withFileTypes: true });
const thumbnailFiles = thumbnailEntries
  .filter((entry) => entry.isFile() && /\.webp$/i.test(entry.name))
  .map((entry) => entry.name);
const expectedThumbnails = new Set(validSources.map((file) => `${path.parse(file).name}.webp`));

for (const thumbnail of thumbnailFiles) {
  if (!expectedThumbnails.has(thumbnail)) {
    errors.push(`Orphan Myth Buster thumbnail: assets/myth-busters/thumbnails/${thumbnail}`);
  }
}

for (const warning of warnings) {
  console.warn(`WARNING: ${warning}`);
}

if (errors.length > 0) {
  console.error(`\nSite health validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Site health validation passed (${repositoryFiles.length} files checked, ${validSources.length} Myth Busters verified).`);
}
