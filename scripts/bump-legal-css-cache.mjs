import { readdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const htmlFiles = (await readdir(repositoryRoot)).filter((file) => file.endsWith(".html"));

let replacements = 0;

for (const file of htmlFiles) {
  const filePath = path.join(repositoryRoot, file);
  const original = await readFile(filePath, "utf8");
  const updated = original.replace(/legal\.css\?v=(?:2|3)/g, () => {
    replacements += 1;
    return "legal.css?v=4";
  });

  if (updated !== original) {
    await writeFile(filePath, updated, "utf8");
  }
}

if (replacements !== 5) {
  throw new Error(`Expected to refresh 5 legal.css references, found ${replacements}.`);
}

await rm(path.join(repositoryRoot, "scripts", "bump-legal-css-cache.mjs"), { force: true });
console.log("Refreshed all legal.css cache keys to v4.");
