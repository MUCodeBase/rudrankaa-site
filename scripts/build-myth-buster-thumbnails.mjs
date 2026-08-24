import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { access, mkdir, readdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const galleryDirectory = path.join(repositoryRoot, "assets", "myth-busters");
const thumbnailsDirectory = path.join(galleryDirectory, "thumbnails");
const cachePath = path.join(thumbnailsDirectory, ".source-hashes.json");
const filenamePattern = /^MB_(\d+)_(\d{2})(\d{2})(\d{4})\.png$/i;

const warningSizeBytes = 3 * 1024 * 1024;
const maximumSizeBytes = 5 * 1024 * 1024;
const thumbnailWidth = 720;
const cacheVersion = 1;
const thumbnailRecipe = `cwebp:q90:m6:sharp_yuv:resize${thumbnailWidth}:v1`;

await mkdir(thumbnailsDirectory, { recursive: true });

const galleryEntries = await readdir(galleryDirectory, { withFileTypes: true });
const sourceFiles = galleryEntries
  .filter((entry) => entry.isFile() && filenamePattern.test(entry.name))
  .map((entry) => entry.name)
  .sort((left, right) => left.localeCompare(right, "en", { sensitivity: "base" }));

let cacheWasPresent = false;
let cacheIsUsable = false;
let cachedFingerprints = {};
let cachedContent = "";

try {
  cachedContent = await readFile(cachePath, "utf8");
  cacheWasPresent = true;
  const parsedCache = JSON.parse(cachedContent);
  const hasValidShape =
    parsedCache &&
    parsedCache.version === cacheVersion &&
    parsedCache.recipe === thumbnailRecipe &&
    parsedCache.files &&
    typeof parsedCache.files === "object" &&
    !Array.isArray(parsedCache.files);

  if (hasValidShape) {
    cachedFingerprints = parsedCache.files;
    cacheIsUsable = true;
  } else {
    console.warn("Thumbnail source-hash cache is outdated or invalid; affected thumbnails will be regenerated.");
  }
} catch (error) {
  if (error.code !== "ENOENT") {
    cacheWasPresent = true;
    console.warn(`Unable to read thumbnail source-hash cache: ${error.message}. Thumbnails will be regenerated as needed.`);
  }
}

const expectedThumbnails = new Set();
const nextFingerprints = {};
let generatedCount = 0;
let skippedCount = 0;
let removedCount = 0;

const fileExists = async (filePath) => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

const sourceFingerprint = (sourceBuffer) => {
  const hash = createHash("sha256");
  hash.update(thumbnailRecipe);
  hash.update("\0");
  hash.update(sourceBuffer);
  return hash.digest("hex");
};

for (const file of sourceFiles) {
  const sourcePath = path.join(galleryDirectory, file);
  const sourceStats = await stat(sourcePath);

  if (sourceStats.size > maximumSizeBytes) {
    throw new Error(
      `${file} is ${(sourceStats.size / 1024 / 1024).toFixed(2)} MiB. ` +
        "Myth Buster source PNG files must be 5 MiB or smaller."
    );
  }

  if (sourceStats.size > warningSizeBytes) {
    console.warn(
      `Warning: ${file} is ${(sourceStats.size / 1024 / 1024).toFixed(2)} MiB. ` +
        "Consider optimizing the source artwork before upload."
    );
  }

  const thumbnailName = `${path.parse(file).name}.webp`;
  const thumbnailPath = path.join(thumbnailsDirectory, thumbnailName);
  expectedThumbnails.add(thumbnailName.toLowerCase());

  const sourceBuffer = await readFile(sourcePath);
  const fingerprint = sourceFingerprint(sourceBuffer);
  nextFingerprints[file] = fingerprint;
  const thumbnailExists = await fileExists(thumbnailPath);

  const canReuseFromCache =
    cacheIsUsable &&
    thumbnailExists &&
    cachedFingerprints[file] === fingerprint;

  const canBootstrapExistingThumbnail =
    !cacheWasPresent &&
    thumbnailExists;

  if (canReuseFromCache || canBootstrapExistingThumbnail) {
    skippedCount += 1;
    console.log(
      canReuseFromCache
        ? `Unchanged, skipped thumbnail generation: ${file}`
        : `Existing thumbnail adopted for incremental cache bootstrap: ${file}`
    );
    continue;
  }

  await execFileAsync("cwebp", [
    "-quiet",
    "-q", "90",
    "-m", "6",
    "-sharp_yuv",
    "-resize", String(thumbnailWidth), "0",
    sourcePath,
    "-o", thumbnailPath,
  ]);

  generatedCount += 1;
  const thumbnailStats = await stat(thumbnailPath);
  console.log(
    `${file}: ${(sourceStats.size / 1024).toFixed(0)} KiB -> ` +
      `${(thumbnailStats.size / 1024).toFixed(0)} KiB card image (${thumbnailWidth}px wide)`
  );
}

const thumbnailEntries = await readdir(thumbnailsDirectory, { withFileTypes: true });

for (const entry of thumbnailEntries) {
  if (
    entry.isFile() &&
    /\.webp$/i.test(entry.name) &&
    !expectedThumbnails.has(entry.name.toLowerCase())
  ) {
    await unlink(path.join(thumbnailsDirectory, entry.name));
    removedCount += 1;
    console.log(`Removed orphan thumbnail ${entry.name}`);
  }
}

const nextCacheContent = `${JSON.stringify({
  version: cacheVersion,
  recipe: thumbnailRecipe,
  files: nextFingerprints,
}, null, 2)}\n`;

const shouldPersistCache = cacheWasPresent || generatedCount > 0 || removedCount > 0;
if (shouldPersistCache && nextCacheContent !== cachedContent) {
  await writeFile(cachePath, nextCacheContent, "utf8");
  console.log(`Updated ${path.relative(repositoryRoot, cachePath)}.`);
}

console.log(
  `Prepared ${sourceFiles.length} Myth Buster thumbnail(s): ` +
    `${generatedCount} generated, ${skippedCount} unchanged, ${removedCount} orphaned removed.`
);
