import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const migrationPath = path.join(scriptDirectory, "apply-part2-consolidation.mjs");
let source = await readFile(migrationPath, "utf8");

const startMarker = "const faqReplacements = [";
const endMarker = "\n\nhtml = replaceExact(\n  html,\n  `          </div>\\n        </div>\\n      </section>\\n\\n      <section class=\"faq section-pad\" id=\"faq\">`";
const start = source.indexOf(startMarker);
const end = source.indexOf(endMarker, start);

if (start < 0 || end < 0) {
  throw new Error("Could not locate the FAQ migration block.");
}

const replacement = `const exactFaqReplacements = [
  [
    \`              <summary>What information is needed for a consultation?</summary>\\n              <p>Your relevant name and date-of-birth details, together with the question or area where you are seeking clarity.</p>\`,
    \`              <summary>What information is needed for a consultation?</summary>\\n              <p>Your relevant name and date-of-birth details, together with the question or area where you are seeking clarity. Depending on the Service requested, additional details relevant to the numerological analysis may be needed. Please provide only information reasonably necessary for the consultation.</p>\`,
  ],
  [
    \`              <summary>Are consultations private?</summary>\\n              <p>Yes. Your details remain private and the conversation stays focused on the guidance you have requested.</p>\`,
    \`              <summary>Are consultations private?</summary>\\n              <p>Rudrankaa treats consultation details with care and confidentiality and uses personal information only as reasonably necessary to provide and administer the requested Service, in accordance with the Rudrankaa <a href="privacy.html">Privacy Policy</a>.</p>\`,
  ],
  [
    \`              <summary>Does numerology predict every outcome?</summary>\\n              <p>Rudrankaa uses numerology to highlight patterns, strengths and reflection points, offering guidance that supports greater awareness and more informed choices.</p>\`,
    \`              <summary>Does numerology predict every outcome?</summary>\\n              <p>Numerology is an interpretive discipline that may highlight patterns, cycles and tendencies. It does not determine or guarantee future events or outcomes, and personal choice and free will remain important.</p>\`,
  ],
  [
    \`              <summary>Can one consultation cover more than one area?</summary>\\n              <p>Yes. You may focus on one question or bring together relevant insights across personal, name, career, business or number-alignment themes.</p>\`,
    \`              <summary>Can one consultation cover more than one area?</summary>\\n              <p>Yes. Depending on the scope of the consultation, you may bring together relevant insights across personal, name, career, business or number-alignment themes. The appropriate scope can be discussed when arranging the consultation.</p>\`,
  ],
  [
    \`              <summary>How can I book?</summary>\\n              <p>Use WhatsApp, phone or email from the consultation section below to share your question and arrange a suitable time.</p>\`,
    \`              <summary>How can I book?</summary>\\n              <p>Use WhatsApp, phone or email from the consultation section below to share your question and arrange a suitable time. A request does not by itself guarantee availability; a consultation is confirmed when Rudrankaa communicates confirmation.</p>\`,
  ],
];
for (const [oldFaq, newFaq] of exactFaqReplacements) {
  html = replaceExact(html, oldFaq, newFaq, "FAQ static answer");
}`;

source = source.slice(0, start) + replacement + source.slice(end);
await writeFile(migrationPath, source, "utf8");
await rm(path.join(scriptDirectory, "harden-part2-migration.mjs"), { force: true });
console.log("Part 2 migration FAQ matching hardened.");
