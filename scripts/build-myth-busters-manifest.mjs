import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const galleryDirectory = path.join(repositoryRoot, "assets", "myth-busters");
const manifestPath = path.join(galleryDirectory, "manifest.json");
const filenamePattern = /^MB_(\d{2})(\d{2})(\d{4})_(\d+)\.jpg$/i;

const files = await readdir(galleryDirectory, { withFileTypes: true });
const imageFiles = files
  .filter((entry) => entry.isFile() && /\.(?:jpe?g|png|webp)$/i.test(entry.name))
  .map((entry) => entry.name);

const invalidFiles = imageFiles.filter((file) => !filenamePattern.test(file));

if (invalidFiles.length > 0) {
  throw new Error(
    `Invalid Myth Buster filename${invalidFiles.length === 1 ? "" : "s"}: ${invalidFiles.join(", ")}. ` +
      "Use MB_DDMMYYYY_X.jpg, for example MB_20082026_1.jpg."
  );
}

const filenamesByLowercase = new Map();

for (const file of imageFiles) {
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

const entries = imageFiles.map((file) => {
  const [, dayText, monthText, yearText, sequenceText] = file.match(filenamePattern);
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);
  const sequence = Number(sequenceText);
  const date = new Date(Date.UTC(year, month - 1, day));

  const isValidDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  if (!isValidDate || sequence < 1) {
    throw new Error(`Invalid date or sequence in Myth Buster filename: ${file}`);
  }

  return {
    file,
    date: `${yearText}-${monthText}-${dayText}`,
    sequence,
  };
});

entries.sort((left, right) => {
  const dateComparison = right.date.localeCompare(left.date);
  return dateComparison || left.sequence - right.sequence;
});

await writeFile(manifestPath, `${JSON.stringify(entries, null, 2)}\n`, "utf8");

console.log(`Generated ${path.relative(repositoryRoot, manifestPath)} with ${entries.length} item(s).`);
