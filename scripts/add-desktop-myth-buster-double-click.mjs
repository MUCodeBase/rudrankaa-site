import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const resolve = (...parts) => path.join(repositoryRoot, ...parts);

const replaceExact = async (file, oldText, newText, expectedCount = 1) => {
  const filePath = resolve(file);
  let content = await readFile(filePath, "utf8");
  const occurrences = content.split(oldText).length - 1;
  if (occurrences !== expectedCount) {
    throw new Error(`${file}: expected ${expectedCount} occurrence(s), found ${occurrences}.`);
  }
  content = content.split(oldText).join(newText);
  await writeFile(filePath, content, "utf8");
};

await replaceExact(
  "myth-busters.js",
  `  let gestureHadMultiplePointers = false;\n  let lastTouchTap = null;`,
  `  let gestureHadMultiplePointers = false;\n  let lastTouchTap = null;\n  let lastInteractionPointerType = "mouse";`
);

await replaceExact(
  "myth-busters.js",
  `  dialogViewport?.addEventListener("pointerdown", (event) => {\n    const pointerPoint = { x: event.clientX, y: event.clientY };`,
  `  dialogViewport?.addEventListener("pointerdown", (event) => {\n    lastInteractionPointerType = event.pointerType || "mouse";\n    const pointerPoint = { x: event.clientX, y: event.clientY };`
);

await replaceExact(
  "myth-busters.js",
  `  window.addEventListener("resize", refitFlyerWhenWidthChanges);\n\n  dialogViewport?.addEventListener("pointerdown", (event) => {`,
  `  window.addEventListener("resize", refitFlyerWhenWidthChanges);\n\n  dialogViewport?.addEventListener("dblclick", (event) => {\n    if (lastInteractionPointerType !== "mouse") {\n      return;\n    }\n\n    event.preventDefault();\n    const targetZoom = zoom > minimumZoom ? minimumZoom : doubleTapZoom;\n    if (targetZoom === minimumZoom) {\n      renderZoom(minimumZoom, false);\n    } else {\n      renderZoomAroundPoint(targetZoom, event.clientX, event.clientY);\n    }\n  });\n\n  dialogViewport?.addEventListener("pointerdown", (event) => {`
);

await replaceExact("index.html", 'src="myth-busters.js?v=5"', 'src="myth-busters.js?v=6"');
await replaceExact("myth-busters.html", 'src="myth-busters.js?v=5"', 'src="myth-busters.js?v=6"');

await rm(resolve("scripts/add-desktop-myth-buster-double-click.mjs"), { force: true });
console.log("Desktop Myth Buster double-click zoom added successfully.");
