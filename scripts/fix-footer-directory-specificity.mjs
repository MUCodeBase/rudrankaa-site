import { readdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const legalCssPath = path.join(repositoryRoot, "legal.css");
let css = await readFile(legalCssPath, "utf8");

const replaceExact = (oldText, newText, expectedCount) => {
  const count = css.split(oldText).length - 1;
  if (count !== expectedCount) {
    throw new Error(`Expected ${expectedCount} occurrence(s) of ${oldText}, found ${count}.`);
  }
  css = css.split(oldText).join(newText);
};

replaceExact(".footer-directory-links {", ".site-footer .footer-directory-links {", 2);
replaceExact(".footer-directory-links a {", ".site-footer .footer-directory-links a {", 2);
replaceExact(
  ".footer-directory-links a:hover,\n.footer-directory-links a:focus-visible {",
  ".site-footer .footer-directory-links a:hover,\n.site-footer .footer-directory-links a:focus-visible {",
  1
);

await writeFile(legalCssPath, css, "utf8");

const htmlFiles = (await readdir(repositoryRoot)).filter((file) => file.endsWith(".html"));
let cacheUpdates = 0;
for (const file of htmlFiles) {
  const filePath = path.join(repositoryRoot, file);
  const original = await readFile(filePath, "utf8");
  const updated = original.replace(/legal\.css\?v=4/g, () => {
    cacheUpdates += 1;
    return "legal.css?v=5";
  });
  if (updated !== original) await writeFile(filePath, updated, "utf8");
}

if (cacheUpdates !== 5) {
  throw new Error(`Expected to refresh 5 legal.css v4 references, found ${cacheUpdates}.`);
}

await rm(path.join(repositoryRoot, "scripts", "fix-footer-directory-specificity.mjs"), { force: true });
console.log("Applied definitive desktop footer spacing specificity fix and bumped legal.css to v5.");
