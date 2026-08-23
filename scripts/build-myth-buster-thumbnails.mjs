import { execFile } from "node:child_process";
import { mkdir, readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const galleryDirectory = path.join(repositoryRoot, "assets", "myth-busters");
const thumbnailsDirectory = path.join(galleryDirectory, "thumbnails");
const filenamePattern = /^MB_(\d+)_(\d{2})(\d{2})(\d{4})\.png$/i;

const warningSizeBytes = 3 * 1024 * 1024;
const maximumSizeBytes = 5 * 1024 * 1024;

await mkdir(thumbnailsDirectory, { recursive: true });

const galleryEntries = await readdir(galleryDirectory, { withFileTypes: true });
const sourceFiles = galleryEntries
  .filter((entry) => entry.isFile() && filenamePattern.test(entry.name))
  .map((entry) => entry.name)
  .sort((left, right) => left.localeCompare(right, "en", { sensitivity: "base" }));

const expectedThumbnails = new Set();

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

  await execFileAsync("cwebp", [
    "-quiet",
    "-q", "90",
    "-m", "6",
    "-sharp_yuv",
    sourcePath,
    "-o", thumbnailPath,
  ]);

  const thumbnailStats = await stat(thumbnailPath);
  console.log(
    `${file}: ${(sourceStats.size / 1024).toFixed(0)} KiB -> ` +
      `${(thumbnailStats.size / 1024).toFixed(0)} KiB card image`
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
    console.log(`Removed orphan thumbnail ${entry.name}`);
  }
}

console.log(`Prepared ${sourceFiles.length} Myth Buster thumbnail(s).`);
