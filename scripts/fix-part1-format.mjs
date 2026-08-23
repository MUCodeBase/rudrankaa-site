import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const indexPath = path.join(repositoryRoot, "index.html");
let html = await readFile(indexPath, "utf8");

const oldBlock = `            loading="lazy"\n          fetchpriority="low"\n          decoding="async"`;
const newBlock = `            loading="lazy"\n            fetchpriority="low"\n            decoding="async"`;
const occurrences = html.split(oldBlock).length - 1;

if (occurrences !== 1) {
  throw new Error(`Expected one mis-indented watermark attribute block, found ${occurrences}.`);
}

html = html.replace(oldBlock, newBlock);
await writeFile(indexPath, html, "utf8");
await rm(path.join(repositoryRoot, "scripts", "fix-part1-format.mjs"), { force: true });
console.log("Final Part 1 HTML formatting fix applied.");
