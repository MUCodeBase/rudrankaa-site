import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const galleryDirectory = path.join(repositoryRoot, "assets", "myth-busters");
const manifestPath = path.join(galleryDirectory, "manifest.json");
const filenamePattern = /^MB_(\d+)_(\d{2})(\d{2})(\d{4})\.png$/i;
const legacyFilenamePattern = /^MB_(\d{2})(\d{2})(\d{4})_(\d+)\.jpe?g$/i;

const files = await readdir(galleryDirectory, { withFileTypes: true });
const imageFiles = files
  .filter((entry) => entry.isFile() && /\.(?:jpe?g|png|webp)$/i.test(entry.name))
  .map((entry) => entry.name);

// Existing date-first JPEG files remain in the repository during migration,
// but they are not accepted into the new PNG-only gallery manifest.
const legacyFiles = imageFiles.filter((file) => legacyFilenamePattern.test(file));
const galleryFiles = imageFiles.filter((file) => !legacyFilenamePattern.test(file));
const invalidFiles = galleryFiles.filter((file) => !filenamePattern.test(file));

if (legacyFiles.length > 0) {
  console.warn(`Ignoring ${legacyFiles.length} legacy JPEG Myth Buster file(s).`);
}

if (invalidFiles.length > 0) {
  throw new Error(
    `Invalid Myth Buster filename${invalidFiles.length === 1 ? "" : "s"}: ${invalidFiles.join(", ")}. ` +
      "Use MB_<counter>_DDMMYYYY.png, for example MB_1_20082026.png."
  );
}

const filenamesByLowercase = new Map();

for (const file of galleryFiles) {
  const lowercaseName = file.toLowerCase();
  const existingFile = filenamesByLowercase.get(lowercaseName);

  if (existingFile) {
    throw new Error(
      `Duplicate Myth Buster filenames differ only by capitalization: ${existingFile}, ${file}. ` +
        "Keep only one of these files."
    );
  }

  filenamesByLowercase.set(lowercaseName, file);
}

const entries = galleryFiles.map((file) => {
  const [, counterText, dayText, monthText, yearText] = file.match(filenamePattern);
  const counter = Number(counterText);
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);
  const date = new Date(Date.UTC(year, month - 1, day));

  const isValidDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  if (!isValidDate || !Number.isSafeInteger(counter) || counter < 1) {
    throw new Error(`Invalid date or counter in Myth Buster filename: ${file}`);
  }

  return {
    file,
    date: `${yearText}-${monthText}-${dayText}`,
    counter,
  };
});

const entriesByCounter = new Map();

for (const entry of entries) {
  const existingEntry = entriesByCounter.get(entry.counter);

  if (existingEntry) {
    throw new Error(
      `Duplicate Myth Buster counter ${entry.counter}: ${existingEntry.file}, ${entry.file}. ` +
        "Use a unique positive counter for every flyer."
    );
  }

  entriesByCounter.set(entry.counter, entry);
}

entries.sort((left, right) => right.counter - left.counter);

await writeFile(manifestPath, `${JSON.stringify(entries, null, 2)}\n`, "utf8");

console.log(`Generated ${path.relative(repositoryRoot, manifestPath)} with ${entries.length} item(s).`);
