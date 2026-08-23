import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const resolve = (...parts) => path.join(repositoryRoot, ...parts);

const replaceExact = async (file, oldText, newText, expectedCount = 1) => {
  const filePath = resolve(file);
  let content = await readFile(filePath, "utf8");
  const count = content.split(oldText).length - 1;

  if (count !== expectedCount) {
    throw new Error(`${file}: expected ${expectedCount} occurrence(s), found ${count}.`);
  }

  content = content.split(oldText).join(newText);
  await writeFile(filePath, content, "utf8");
};

await replaceExact(
  "index.html",
  `    <link rel="stylesheet" href="service-details.css?v=2" />\n    <script defer src="site-navigation.js?v=1"></script>\n    <script defer src="birth-number.js?v=3"></script>\n    <script defer src="birth-number-refinements.js?v=9"></script>\n    <script defer src="hero-number-pad-refinement.js?v=7"></script>\n    <script defer src="service-details.js?v=3"></script>`,
  `    <link rel="stylesheet" href="service-details.css?v=2" />\n    <link rel="stylesheet" href="birth-number.css?v=1" />\n    <script defer src="site-navigation.js?v=1"></script>\n    <script defer src="birth-number.js?v=4"></script>\n    <script defer src="service-details.js?v=3"></script>`
);

await replaceExact(
  "index.html",
  `          <p>Numbers do not decide your path.</p>\n          <span aria-hidden="true">✦</span>\n          <p>They can help you see it more clearly.</p>`,
  `          <p>Numbers reveal patterns.</p>\n          <span aria-hidden="true">✦</span>\n          <p>Your choices shape your path.</p>`
);

await replaceExact(
  "birth-number.js",
  `error.textContent = "Please enter a whole-number date from 1 to 31.";`,
  `error.textContent = "Please enter a whole-number day from 1 to 31.";`
);

await replaceExact(
  "README.md",
  `- \`birth-number.js\`, \`birth-number-refinements.js\`, \`hero-number-pad-refinement.js\` — current interactive Birth Number experience`,
  `- \`birth-number.js\` / \`birth-number.css\` — consolidated interactive Birth Number experience`
);

for (const obsoleteFile of [
  "birth-number-refinements.js",
  "hero-number-pad-refinement.js",
]) {
  await rm(resolve(obsoleteFile));
}

await rm(resolve("scripts", "apply-part3-consolidation.mjs"), { force: true });
console.log("Part 3 Birth Number consolidation applied successfully.");
