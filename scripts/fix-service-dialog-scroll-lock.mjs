import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");

const replaceExact = async (file, oldText, newText, expectedCount = 1) => {
  const filePath = path.join(repositoryRoot, file);
  let content = await readFile(filePath, "utf8");
  const count = content.split(oldText).length - 1;
  if (count !== expectedCount) {
    throw new Error(`${file}: expected ${expectedCount} occurrence(s), found ${count}.`);
  }
  content = content.split(oldText).join(newText);
  await writeFile(filePath, content, "utf8");
};

await replaceExact(
  "service-details.css",
  `  box-shadow: 0 30px 90px rgba(46, 20, 19, 0.28);\n  overflow: auto;`,
  `  box-shadow: 0 30px 90px rgba(46, 20, 19, 0.28);\n  overflow: auto;\n  overscroll-behavior: contain;\n  -webkit-overflow-scrolling: touch;`
);

await replaceExact(
  "service-details.js",
  `  const consultationLink = dialog.querySelector(".service-dialog-cta");\n\n  const openService = (content) => {`,
  `  const consultationLink = dialog.querySelector(".service-dialog-cta");\n\n  let lockedScrollY = 0;\n  let scrollLockSnapshot = null;\n\n  const lockPageScroll = () => {\n    if (scrollLockSnapshot) return;\n\n    const rootStyle = document.documentElement.style;\n    const bodyStyle = document.body.style;\n    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);\n\n    lockedScrollY = window.scrollY;\n    scrollLockSnapshot = {\n      rootOverflow: rootStyle.overflow,\n      rootOverscrollBehavior: rootStyle.overscrollBehavior,\n      bodyPosition: bodyStyle.position,\n      bodyTop: bodyStyle.top,\n      bodyLeft: bodyStyle.left,\n      bodyRight: bodyStyle.right,\n      bodyWidth: bodyStyle.width,\n      bodyOverflow: bodyStyle.overflow,\n      bodyPaddingRight: bodyStyle.paddingRight,\n    };\n\n    rootStyle.overflow = "hidden";\n    rootStyle.overscrollBehavior = "none";\n    bodyStyle.position = "fixed";\n    bodyStyle.top = \`-\${lockedScrollY}px\`;\n    bodyStyle.left = "0";\n    bodyStyle.right = "0";\n    bodyStyle.width = "100%";\n    bodyStyle.overflow = "hidden";\n    if (scrollbarWidth > 0) bodyStyle.paddingRight = \`\${scrollbarWidth}px\`;\n  };\n\n  const unlockPageScroll = () => {\n    if (!scrollLockSnapshot) return;\n\n    const rootStyle = document.documentElement.style;\n    const bodyStyle = document.body.style;\n    const previousRootScrollBehavior = rootStyle.scrollBehavior;\n    const snapshot = scrollLockSnapshot;\n    scrollLockSnapshot = null;\n\n    rootStyle.overflow = snapshot.rootOverflow;\n    rootStyle.overscrollBehavior = snapshot.rootOverscrollBehavior;\n    bodyStyle.position = snapshot.bodyPosition;\n    bodyStyle.top = snapshot.bodyTop;\n    bodyStyle.left = snapshot.bodyLeft;\n    bodyStyle.right = snapshot.bodyRight;\n    bodyStyle.width = snapshot.bodyWidth;\n    bodyStyle.overflow = snapshot.bodyOverflow;\n    bodyStyle.paddingRight = snapshot.bodyPaddingRight;\n\n    rootStyle.scrollBehavior = "auto";\n    window.scrollTo(0, lockedScrollY);\n    rootStyle.scrollBehavior = previousRootScrollBehavior;\n  };\n\n  const openService = (content) => {`
);

await replaceExact(
  "service-details.js",
  `    if (typeof dialog.showModal === "function") {\n      dialog.showModal();\n    } else {\n      dialog.setAttribute("open", "");\n    }`,
  `    lockPageScroll();\n    try {\n      if (typeof dialog.showModal === "function") {\n        dialog.showModal();\n      } else {\n        dialog.setAttribute("open", "");\n      }\n    } catch (error) {\n      unlockPageScroll();\n      throw error;\n    }`
);

await replaceExact(
  "service-details.js",
  `  closeButton?.addEventListener("click", () => dialog.close());`,
  `  dialog.addEventListener("close", unlockPageScroll);\n  closeButton?.addEventListener("click", () => dialog.close());`
);

await replaceExact("index.html", 'href="service-details.css?v=1"', 'href="service-details.css?v=2"');
await replaceExact("index.html", 'src="service-details.js?v=2"', 'src="service-details.js?v=3"');

await rm(path.join(repositoryRoot, "scripts", "fix-service-dialog-scroll-lock.mjs"), { force: true });
console.log("Applied service dialog scroll containment and page scroll lock.");
