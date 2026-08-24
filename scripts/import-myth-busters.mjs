import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const sourceDir = process.argv[2];
const targetDir = path.resolve('assets/myth-busters');

if (!sourceDir) {
  console.error('Usage: node scripts/import-myth-busters.mjs <upload-directory>');
  process.exit(1);
}

const uploadDir = path.resolve(sourceDir);
if (!fs.existsSync(uploadDir) || !fs.statSync(uploadDir).isDirectory()) {
  console.error(`Upload directory does not exist: ${uploadDir}`);
  process.exit(1);
}

const filenamePattern = /^MB_(\d+)_(\d{8})\.png$/i;
const maxBytes = 5 * 1024 * 1024;
const warnBytes = 3 * 1024 * 1024;

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function listPublishedSources() {
  if (!fs.existsSync(targetDir)) return [];
  return fs.readdirSync(targetDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && filenamePattern.test(entry.name))
    .map((entry) => entry.name);
}

const published = listPublishedSources();
const publishedByLowerName = new Map(published.map((name) => [name.toLowerCase(), name]));
const publishedByCounter = new Map();

for (const name of published) {
  const match = name.match(filenamePattern);
  const counter = Number(match[1]);
  if (publishedByCounter.has(counter)) {
    console.error(`Production already contains duplicate Myth Buster counter ${counter}.`);
    process.exit(1);
  }
  publishedByCounter.set(counter, name);
}

const uploads = fs.readdirSync(uploadDir, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((name) => !name.startsWith('.'))
  .filter((name) => name.toLowerCase() !== 'readme.md');

const seenUploadCounters = new Map();
const seenUploadLowerNames = new Set();
let imported = 0;

for (const name of uploads.sort()) {
  const match = name.match(filenamePattern);
  if (!match) {
    console.error(`Invalid upload filename: ${name}. Expected MB_<counter>_DDMMYYYY.png`);
    process.exit(1);
  }

  const counter = Number(match[1]);
  if (!Number.isSafeInteger(counter) || counter <= 0) {
    console.error(`Invalid Myth Buster counter in ${name}.`);
    process.exit(1);
  }

  const lowerName = name.toLowerCase();
  if (seenUploadLowerNames.has(lowerName)) {
    console.error(`Upload filenames differ only by capitalization: ${name}`);
    process.exit(1);
  }
  seenUploadLowerNames.add(lowerName);

  if (seenUploadCounters.has(counter)) {
    console.error(`Duplicate upload counter ${counter}: ${seenUploadCounters.get(counter)} and ${name}`);
    process.exit(1);
  }
  seenUploadCounters.set(counter, name);

  const uploadPath = path.join(uploadDir, name);
  const stat = fs.statSync(uploadPath);
  if (stat.size > maxBytes) {
    console.error(`${name} exceeds the 5 MiB production limit.`);
    process.exit(1);
  }
  if (stat.size > warnBytes) {
    console.warn(`WARNING: ${name} exceeds 3 MiB (${(stat.size / 1024 / 1024).toFixed(2)} MiB).`);
  }

  const existingName = publishedByLowerName.get(lowerName);
  if (existingName) {
    const existingPath = path.join(targetDir, existingName);
    if (sha256(existingPath) === sha256(uploadPath)) {
      console.log(`Already published, unchanged: ${name}`);
      continue;
    }
    console.error(`Refusing to replace already published Myth Buster ${existingName} with different content.`);
    process.exit(1);
  }

  const existingCounterName = publishedByCounter.get(counter);
  if (existingCounterName) {
    console.error(`Counter ${counter} is already published as ${existingCounterName}; refusing ${name}.`);
    process.exit(1);
  }

  fs.mkdirSync(targetDir, { recursive: true });
  fs.copyFileSync(uploadPath, path.join(targetDir, name));
  publishedByLowerName.set(lowerName, name);
  publishedByCounter.set(counter, name);
  imported += 1;
  console.log(`Imported: ${name}`);
}

console.log(`Imported ${imported} new Myth Buster source file(s).`);
