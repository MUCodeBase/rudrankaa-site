import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDirectory, "..");

const indexPath = path.join(root, "index.html");
let html = await readFile(indexPath, "utf8");
const startMarker = '          <div class="service-grid">';
const endMarker = '\n        </div>\n      </section>\n\n      <section class="process section-pad" id="process">';
const start = html.indexOf(startMarker);
const end = html.indexOf(endMarker, start);
if (start < 0 || end < 0) {
  throw new Error("Could not locate the service-grid boundaries.");
}

const serviceGrid = `          <div class="service-grid">
            <article class="service-card">
              <span class="service-number">01</span>
              <div class="service-icon" aria-hidden="true">▦</div>
              <h3>Manifestation Grid Activation</h3>
              <p class="service-summary">A personalised manifestation grid and 3-digit Lucky Number, calculated from your date of birth, to support focused intentions and purposeful action towards your goals.</p>
              <div class="service-card-actions">
                <a href="#contact" aria-label="Enquire about Manifestation Grid Activation">Enquire <span aria-hidden="true">→</span></a>
                <button type="button" class="service-details-trigger" data-service-key="manifestation-grid" aria-haspopup="dialog">View details</button>
              </div>
            </article>

            <article class="service-card featured-card">
              <span class="service-number">02</span>
              <div class="service-icon" aria-hidden="true">✽</div>
              <h3>Name Energy Alignment</h3>
              <p class="service-summary">Numerology-based name alignment using your date of birth, layered calculations and sound-vibration analysis, including personalised naming guidance for newborns.</p>
              <div class="service-card-actions">
                <a href="#contact" aria-label="Enquire about Name Energy Alignment">Enquire <span aria-hidden="true">→</span></a>
                <button type="button" class="service-details-trigger" data-service-key="name-energy" aria-haspopup="dialog">View details</button>
              </div>
            </article>

            <article class="service-card">
              <span class="service-number">03</span>
              <div class="service-icon" aria-hidden="true">✦</div>
              <h3>Personal Numerology Guidance</h3>
              <p class="service-summary">A detailed personal numerology review covering name alignment, current numerical cycles, favourable timing, important numbers, relationships and customised guidance.</p>
              <div class="service-card-actions">
                <a href="#contact" aria-label="Enquire about Personal Numerology Guidance">Enquire <span aria-hidden="true">→</span></a>
                <button type="button" class="service-details-trigger" data-service-key="personal-numerology" aria-haspopup="dialog">View details</button>
              </div>
            </article>

            <article class="service-card">
              <span class="service-number">04</span>
              <div class="service-icon" aria-hidden="true">◇</div>
              <h3>Business &amp; Career Numerology</h3>
              <p class="service-summary">Numerology-based guidance for career direction, business and brand naming, partnership compatibility and the timing of important career or business decisions.</p>
              <div class="service-card-actions">
                <a href="#contact" aria-label="Enquire about Business and Career Numerology">Enquire <span aria-hidden="true">→</span></a>
                <button type="button" class="service-details-trigger" data-service-key="business-career" aria-haspopup="dialog">View details</button>
              </div>
            </article>

            <article class="service-card featured-card">
              <span class="service-number">05</span>
              <div class="service-icon" aria-hidden="true">#</div>
              <h3>Critical Number Alignment</h3>
              <p class="service-summary">Check how important everyday numbers—such as your mobile, house, vehicle and bank-account numbers—align with your date of birth.</p>
              <div class="service-card-actions">
                <a href="#contact" aria-label="Enquire about Critical Number Alignment">Enquire <span aria-hidden="true">→</span></a>
                <button type="button" class="service-details-trigger" data-service-key="critical-number" aria-haspopup="dialog">View details</button>
              </div>
            </article>

            <article class="service-card">
              <span class="service-number">06</span>
              <div class="service-icon" aria-hidden="true">◌</div>
              <h3>Rudraksha, Crystal &amp; Yantra Guidance</h3>
              <p class="service-summary">Personalised guidance for selecting Rudraksha, crystals and yantras based on your date of birth and intended purpose, with emphasis on authenticity and trusted sourcing.</p>
              <div class="service-card-actions">
                <a href="#contact" aria-label="Enquire about Rudraksha, Crystal and Yantra Guidance">Enquire <span aria-hidden="true">→</span></a>
                <button type="button" class="service-details-trigger" data-service-key="rudraksha-crystal-yantra" aria-haspopup="dialog">View details</button>
              </div>
            </article>
          </div>`;

html = html.slice(0, start) + serviceGrid + html.slice(end);
await writeFile(indexPath, html, "utf8");

const validatorPath = path.join(root, "scripts", "validate-site.mjs");
let validator = await readFile(validatorPath, "utf8");
const validatorMarker = 'for (const cssFile of repositoryFiles.filter((file) => file.endsWith(".css"))) {';
if (!validator.includes(validatorMarker)) {
  throw new Error("Could not locate validator CSS loop marker.");
}
if (!validator.includes("Expected exactly 6 homepage service cards")) {
  const serviceGuard = `const homepageHtml = await readFile(path.join(repositoryRoot, "index.html"), "utf8");
const serviceCardCount = (homepageHtml.match(/<article class="service-card(?: featured-card)?">/g) || []).length;
const serviceKeyMatches = Array.from(homepageHtml.matchAll(/data-service-key="([^"]+)"/g), (match) => match[1]);
const expectedServiceKeys = new Set([
  "manifestation-grid",
  "name-energy",
  "personal-numerology",
  "business-career",
  "critical-number",
  "rudraksha-crystal-yantra",
]);

if (serviceCardCount !== 6) {
  errors.push(\`Expected exactly 6 homepage service cards, found \${serviceCardCount}.\`);
}
if (serviceKeyMatches.length !== 6 || serviceKeyMatches.some((key) => !expectedServiceKeys.has(key)) || new Set(serviceKeyMatches).size !== 6) {
  errors.push("Homepage service detail triggers must contain the 6 unique approved service keys.");
}

`;
  validator = validator.replace(validatorMarker, serviceGuard + validatorMarker);
}
await writeFile(validatorPath, validator, "utf8");

await rm(path.join(scriptDirectory, "fix-part2-service-grid.mjs"), { force: true });
console.log("Part 2 service grid repaired and validation guard added.");
