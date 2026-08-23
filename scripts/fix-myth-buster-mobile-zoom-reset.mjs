import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");

const replaceExact = async (relativePath, oldText, newText, expectedCount = 1) => {
  const filePath = path.join(repositoryRoot, relativePath);
  let content = await readFile(filePath, "utf8");
  const count = content.split(oldText).length - 1;
  if (count !== expectedCount) {
    throw new Error(`${relativePath}: expected ${expectedCount} match(es), found ${count}.`);
  }
  content = content.split(oldText).join(newText);
  await writeFile(filePath, content, "utf8");
};

await replaceExact(
  "myth-busters.js",
  `  dialogImage?.addEventListener("load", fitFlyer);\n  window.addEventListener("resize", fitFlyer);`,
  `  dialogImage?.addEventListener("load", fitFlyer);\n\n  const refitFlyerWhenWidthChanges = () => {\n    if (!dialog?.open || !dialogViewport || !fittedWidth) {\n      return;\n    }\n\n    const availableWidth = Math.max(1, dialogViewport.clientWidth);\n    if (Math.abs(availableWidth - fittedWidth) < 2) {\n      return;\n    }\n\n    fitFlyer();\n  };\n\n  window.addEventListener("resize", refitFlyerWhenWidthChanges);`
);

await replaceExact("index.html", 'src="myth-busters.js?v=5"', 'src="myth-busters.js?v=6"');
await replaceExact("myth-busters.html", 'src="myth-busters.js?v=5"', 'src="myth-busters.js?v=6"');

await rm(path.join(repositoryRoot, "scripts", "fix-myth-buster-mobile-zoom-reset.mjs"), { force: true });
console.log("Mobile Myth Buster resize/zoom reset fix applied.");
