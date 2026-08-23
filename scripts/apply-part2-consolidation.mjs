import { readFile, writeFile, rm, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDirectory, "..");
const resolve = (...parts) => path.join(root, ...parts);

const read = (file) => readFile(resolve(file), "utf8");
const write = (file, content) => writeFile(resolve(file), content, "utf8");

const replaceExact = (content, oldText, newText, label, expectedCount = 1) => {
  const count = content.split(oldText).length - 1;
  if (count !== expectedCount) {
    throw new Error(`${label}: expected ${expectedCount} occurrence(s), found ${count}.`);
  }
  return content.split(oldText).join(newText);
};

const replaceRegexOnce = (content, pattern, replacement, label) => {
  const matches = content.match(pattern);
  if (!matches) throw new Error(`${label}: target not found.`);
  const first = content.replace(pattern, replacement);
  if (first === content) throw new Error(`${label}: replacement made no change.`);
  return first;
};

const sharedNavigation = `const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".nav-toggle");
const navigation = document.querySelector(".site-nav");
const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const updateHeader = () => {
  header?.classList.toggle("scrolled", window.scrollY > 16);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation?.classList.toggle("open", !isOpen);
});

document.addEventListener(
  "click",
  (event) => {
    if (menuButton?.getAttribute("aria-expanded") !== "true" || !navigation) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (navigation.contains(target) || menuButton.contains(target)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  },
  true
);

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
  });
});
`;
await write("site-navigation.js", sharedNavigation);

const serviceDetails = `(() => {
  const serviceContent = new Map([
    [
      "manifestation-grid",
      {
        title: "Manifestation Grid Activation",
        paragraphs: [
          "A personalised Manifestation Grid is created using your date of birth and a unique combination of numbers. It can be used repeatedly, focusing on one wish or intention at a time, as a numerological aid alongside your own efforts.",
          "A personalised 3-digit Lucky Number is also calculated for you, giving you a simple number that can be carried or used in everyday life.",
          "The Manifestation Grid and Lucky Number are intended to complement your efforts, focus and positive intentions—not replace them—while pursuing your goals responsibly and without causing harm to others.",
        ],
      },
    ],
    [
      "name-energy",
      {
        title: "Name Energy Alignment",
        paragraphs: [
          "Your date of birth is fixed and carries its own numerical pattern. Your name, however, can be consciously reviewed and, where appropriate, adjusted to create greater numerological harmony.",
          "Name Energy Alignment combines multiple layers of numerological calculations with the sound vibrations associated with individual alphabets to assess and create balanced name combinations.",
          "The service also includes creating numerologically aligned names for newborn babies, taking the child’s date of birth into consideration.",
          "The objective is to identify a name considered more supportive and harmonious within the Rudrankaa numerological framework.",
        ],
      },
    ],
    [
      "personal-numerology",
      {
        title: "Personal Numerology Guidance",
        paragraphs: [
          "Personal Numerology Guidance helps you understand the numerical influences relevant to different areas of your life.",
          "The consultation may include alignment of your name with your date of birth, your current Name & Number Mahadasha, your Personal Year and its opportunities and cautions, and the compatibility of your mobile number with your date of birth.",
          "It can also help identify periods considered more favourable from a numerological perspective for specific tasks, goals or important decisions, allowing you to consider timing as part of your planning.",
          "Where relevant, the consultation may also include marriage compatibility for those planning marriage, helping assess numerical compatibility between partners.",
        ],
        conclusion:
          "The overall analysis is brought together into personalised numerological guidance, with customised remedies or recommendations where appropriate.",
      },
    ],
    [
      "business-career",
      {
        title: "Business & Career Numerology",
        paragraphs: [
          "Business & Career Numerology uses your numerical profile to provide additional perspective when considering important professional and business decisions.",
          "It may include identifying career directions considered more compatible with your numerical profile, guidance for business and brand naming, and assessment of numerological compatibility between business partners.",
          "The consultation can also examine timing for starting a new venture, changing career direction or taking important business decisions, helping you identify periods that may be considered more favourable from a numerological perspective.",
        ],
      },
    ],
    [
      "critical-number",
      {
        title: "Critical Number Alignment",
        paragraphs: [
          "Numbers surround us in everyday life—from our mobile and house numbers to vehicle and bank-account numbers.",
          "Critical Number Alignment assesses the compatibility of these important numbers with your date of birth, helping identify combinations considered more supportive within the Rudrankaa numerological framework and highlighting combinations that may warrant reconsideration.",
          "The guidance can also help you evaluate number combinations considered more favourable within the numerological framework when choosing or changing important numbers in everyday life.",
        ],
      },
    ],
    [
      "rudraksha-crystal-yantra",
      {
        title: "Rudraksha, Crystal & Yantra Guidance",
        paragraphs: [
          "Rudraksha, crystals and yantras have traditionally been used for different spiritual and personal intentions.",
          "Rudraksha is referenced in traditional scriptures and associated with different purposes according to its type. Crystals are traditionally associated with practices relating to energy and chakra balance, while yantras are associated with particular intentions and spiritual practices.",
          "Based on your date of birth and the purpose for which guidance is sought, Rudrankaa provides guidance on Rudraksha, crystal and/or yantra selections considered appropriate within this traditional and numerological framework.",
          "As authenticity is particularly important for such products, we recommend purchasing Rudraksha and crystals only from reliable and trusted sources.",
        ],
      },
    ],
  ]);

  const triggers = Array.from(document.querySelectorAll(".service-details-trigger[data-service-key]"));
  if (!triggers.length) return;

  const dialog = document.createElement("dialog");
  dialog.className = "service-details-dialog";
  dialog.setAttribute("aria-labelledby", "service-details-title");
  dialog.innerHTML = ` + "`" + `
    <div class="service-dialog-shell">
      <button class="service-dialog-close" type="button" aria-label="Close service details">×</button>
      <p class="service-dialog-eyebrow">Service details</p>
      <h2 id="service-details-title"></h2>
      <div class="service-dialog-copy"></div>
      <a class="service-dialog-cta" href="#contact">Book a Consultation <span aria-hidden="true">→</span></a>
    </div>
  ` + "`" + `;
  document.body.appendChild(dialog);

  const dialogTitle = dialog.querySelector("#service-details-title");
  const dialogCopy = dialog.querySelector(".service-dialog-copy");
  const closeButton = dialog.querySelector(".service-dialog-close");
  const consultationLink = dialog.querySelector(".service-dialog-cta");

  const openService = (content) => {
    dialogTitle.textContent = content.title;
    dialogCopy.replaceChildren();

    content.paragraphs.forEach((paragraph) => {
      const copy = document.createElement("p");
      copy.textContent = paragraph;
      dialogCopy.appendChild(copy);
    });

    if (content.conclusion) {
      const conclusion = document.createElement("p");
      conclusion.className = "service-dialog-conclusion";
      conclusion.textContent = content.conclusion;
      dialogCopy.appendChild(conclusion);
    }

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  };

  triggers.forEach((trigger) => {
    const content = serviceContent.get(trigger.dataset.serviceKey);
    if (!content) return;
    trigger.addEventListener("click", () => openService(content));
  });

  closeButton?.addEventListener("click", () => dialog.close());
  consultationLink?.addEventListener("click", () => {
    if (dialog.open) dialog.close();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
})();
`;
await write("service-details.js", serviceDetails);

let html = await read("index.html");
html = replaceExact(
  html,
  `    <link rel="stylesheet" href="styles-v2.css?v=8" />\n    <link rel="stylesheet" href="myth-busters.css?v=2" />\n    <script defer src="script-v2.js?v=11"></script>\n    <script defer src="myth-busters.js?v=6"></script>`,
  `    <link rel="stylesheet" href="styles-v2.css?v=9" />\n    <link rel="stylesheet" href="myth-busters.css?v=2" />\n    <link rel="stylesheet" href="legal.css?v=3" />\n    <link rel="stylesheet" href="service-details.css?v=1" />\n    <script defer src="site-navigation.js?v=1"></script>\n    <script defer src="birth-number.js?v=3"></script>\n    <script defer src="birth-number-refinements.js?v=9"></script>\n    <script defer src="hero-number-pad-refinement.js?v=7"></script>\n    <script defer src="service-details.js?v=2"></script>\n    <script defer src="myth-busters.js?v=6"></script>`,
  "index head assets"
);

html = replaceExact(
  html,
  `              alt="Rudrankaa"\n            />\n          </span>`,
  `              alt="Rudrankaa"\n            />\n            <span class="brand-trademark" aria-hidden="true">™</span>\n          </span>`,
  "header trademark"
);

html = replaceExact(
  html,
  `            <p class="signature-line">Mathematics of Destiny guided by Ardhnarishwarra</p>\n            <p class="hero-lead">`,
  `            <p class="signature-line">Mathematics of Destiny guided by Ardhnarishwarra</p>\n            <div class="hero-credential">\n              <span class="hero-credential-message">Numerology guidance backed by experience, academic distinction &amp; insight</span>\n              <span class="hero-credential-detail">Ph.D. in Numerology • Gold Medallist • Experienced Practitioner</span>\n            </div>\n            <p class="hero-lead">`,
  "hero credential"
);

html = replaceExact(html, `<p class="section-label">About Rudrankaa</p>`, `<p class="section-label">About Rudrankaa™</p>`, "about trademark");
html = replaceExact(
  html,
  `            <h2>Ancient insight, interpreted for modern life.</h2>\n          </div>`,
  `            <h2>Ancient insight, interpreted for modern life.</h2>\n            <p class="about-credential">Every consultation is personally guided, drawing on deep numerological knowledge and practical experience, with careful attention to what matters most to you.</p>\n          </div>`,
  "about credential"
);

const services = [
  {
    oldTitle: "Manifestation Grid Activation", className: "service-card", number: "01", icon: "▦", key: "manifestation-grid",
    title: "Manifestation Grid Activation",
    summary: "A personalised manifestation grid and 3-digit Lucky Number, calculated from your date of birth, to support focused intentions and purposeful action towards your goals.",
    aria: "Manifestation Grid Activation",
  },
  {
    oldTitle: "Name Energy Alignment", className: "service-card featured-card", number: "02", icon: "✽", key: "name-energy",
    title: "Name Energy Alignment",
    summary: "Numerology-based name alignment using your date of birth, layered calculations and sound-vibration analysis, including personalised naming guidance for newborns.",
    aria: "Name Energy Alignment",
  },
  {
    oldTitle: "Personal Numerology Guidance", className: "service-card", number: "03", icon: "✦", key: "personal-numerology",
    title: "Personal Numerology Guidance",
    summary: "A detailed personal numerology review covering name alignment, current numerical cycles, favourable timing, important numbers, relationships and customised guidance.",
    aria: "Personal Numerology Guidance",
  },
  {
    oldTitle: "Business &amp; Career Numerology", className: "service-card", number: "04", icon: "◇", key: "business-career",
    title: "Business &amp; Career Numerology",
    summary: "Numerology-based guidance for career direction, business and brand naming, partnership compatibility and the timing of important career or business decisions.",
    aria: "Business and Career Numerology",
  },
  {
    oldTitle: "Critical Number Alignment", className: "service-card featured-card", number: "05", icon: "#", key: "critical-number",
    title: "Critical Number Alignment",
    summary: "Check how important everyday numbers—such as your mobile, house, vehicle and bank-account numbers—align with your date of birth.",
    aria: "Critical Number Alignment",
  },
  {
    oldTitle: "Rudraksha Consultancy", className: "service-card", number: "06", icon: "◌", key: "rudraksha-crystal-yantra",
    title: "Rudraksha, Crystal &amp; Yantra Guidance",
    summary: "Personalised guidance for selecting Rudraksha, crystals and yantras based on your date of birth and intended purpose, with emphasis on authenticity and trusted sourcing.",
    aria: "Rudraksha, Crystal and Yantra Guidance",
  },
];

for (const service of services) {
  const pattern = new RegExp(`<article class="service-card(?: featured-card)?">[\\s\\S]*?<h3>${service.oldTitle.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}</h3>[\\s\\S]*?</article>`);
  const replacement = `            <article class="${service.className}">\n              <span class="service-number">${service.number}</span>\n              <div class="service-icon" aria-hidden="true">${service.icon}</div>\n              <h3>${service.title}</h3>\n              <p class="service-summary">${service.summary}</p>\n              <div class="service-card-actions">\n                <a href="#contact" aria-label="Enquire about ${service.aria}">Enquire <span aria-hidden="true">→</span></a>\n                <button type="button" class="service-details-trigger" data-service-key="${service.key}" aria-haspopup="dialog">View details</button>\n              </div>\n            </article>`;
  html = replaceRegexOnce(html, pattern, replacement, `service ${service.key}`);
}

const faqReplacements = [
  ["What information is needed for a consultation?", "Your relevant name and date-of-birth details, together with the question or area where you are seeking clarity. Depending on the Service requested, additional details relevant to the numerological analysis may be needed. Please provide only information reasonably necessary for the consultation."],
  ["Does numerology predict every outcome?", "Numerology is an interpretive discipline that may highlight patterns, cycles and tendencies. It does not determine or guarantee future events or outcomes, and personal choice and free will remain important."],
  ["Can one consultation cover more than one area?", "Yes. Depending on the scope of the consultation, you may bring together relevant insights across personal, name, career, business or number-alignment themes. The appropriate scope can be discussed when arranging the consultation."],
  ["How can I book?", "Use WhatsApp, phone or email from the consultation section below to share your question and arrange a suitable time. A request does not by itself guarantee availability; a consultation is confirmed when Rudrankaa communicates confirmation."],
];
for (const [question, answer] of faqReplacements) {
  const pattern = new RegExp(`(<summary>${question.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}</summary>\\s*<p>)[\\s\\S]*?(</p>)`);
  html = replaceRegexOnce(html, pattern, `$1${answer}$2`, `FAQ ${question}`);
}
html = replaceRegexOnce(
  html,
  /(<summary>Are consultations private\?<\/summary>\s*<p>)[\s\S]*?(<\/p>)/,
  `$1Rudrankaa treats consultation details with care and confidentiality and uses personal information only as reasonably necessary to provide and administer the requested Service, in accordance with the Rudrankaa <a href="privacy.html">Privacy Policy</a>.$2`,
  "FAQ privacy"
);

html = replaceExact(
  html,
  `          </div>\n        </div>\n      </section>\n\n      <section class="faq section-pad" id="faq">`,
  `          </div>\n          <p class="testimonial-experience-note">Testimonials reflect individual experiences and do not guarantee similar outcomes.</p>\n        </div>\n      </section>\n\n      <section class="faq section-pad" id="faq">`,
  "testimonial note"
);

html = replaceExact(
  html,
  `            </div>\n          </div>\n          <div class="qr-card">`,
  `            </div>\n            <div class="consultation-disclaimer">\n              <p>Numerology is an interpretive discipline. Rudrankaa guidance is intended for reflection and self-development, does not guarantee outcomes, and is not a substitute for qualified medical, psychological, legal, financial, investment or tax advice. <a href="disclaimer.html">Read full disclaimer</a></p>\n            </div>\n          </div>\n          <div class="qr-card">`,
  "consultation disclaimer"
);

const qrMatch = html.match(/src="data:image\/png;base64,([^"]+)"\s*\n\s*alt="WhatsApp QR code for Rudrankaa"/);
if (!qrMatch) throw new Error("WhatsApp QR data URI not found.");
await mkdir(resolve("assets"), { recursive: true });
await writeFile(resolve("assets", "whatsapp-qr.png"), Buffer.from(qrMatch[1], "base64"));
html = html.replace(`src="data:image/png;base64,${qrMatch[1]}"`, `src="assets/whatsapp-qr.png"`);

const homeFooter = `    <footer class="site-footer">
      <div class="shell footer-main footer-directory">
        <div class="footer-directory-column footer-directory-brand-column">
          <a class="brand footer-brand footer-directory-brand" href="#top" aria-label="Rudrankaa home">
            <span class="brand-mark" aria-hidden="true">ॐ</span>
            <span class="brand-name">RUDRANKAA™</span>
          </a>
          <p class="footer-directory-tagline">DESTINY ARCHITECT</p>
          <p class="footer-directory-copy">Thoughtful numerology guidance for greater clarity, reflection and informed personal choices.</p>
        </div>
        <div class="footer-directory-column">
          <h2 class="footer-directory-heading">Explore</h2>
          <nav class="footer-directory-links" aria-label="Explore Rudrankaa">
            <a href="#about">About Rudrankaa</a>
            <a href="#services">Services</a>
            <a href="#process">How It Works</a>
            <a href="#myth-busters">Myth Busters</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#faq">FAQ</a>
          </nav>
        </div>
        <div class="footer-directory-column">
          <h2 class="footer-directory-heading">Legal</h2>
          <nav class="footer-directory-links" aria-label="Legal information">
            <a href="disclaimer.html">Disclaimer</a>
            <a href="terms.html">Terms &amp; Conditions</a>
            <a href="privacy.html">Privacy Policy</a>
          </nav>
        </div>
        <div class="footer-directory-column">
          <h2 class="footer-directory-heading">Get in touch</h2>
          <div class="footer-directory-links footer-contact-links">
            <a href="https://wa.me/919152376399?text=Namaste%2C%20I%20would%20like%20to%20book%20a%20Rudrankaa%20consultation." target="_blank" rel="noopener noreferrer">WhatsApp +91 91523 76399</a>
            <a href="mailto:contact@rudrankaa.com">contact@rudrankaa.com</a>
            <a href="#contact">Book a Consultation</a>
          </div>
        </div>
      </div>
      <div class="shell footer-bottom footer-bottom-clean">
        <div class="footer-legal-left">
          <span>© <span id="year">2026</span> Rudrankaa. All rights reserved.</span>
          <p class="trademark-notice">RUDRANKAA™ and the Rudrankaa logo are trademarks.</p>
        </div>
      </div>
    </footer>`;
html = replaceRegexOnce(html, /    <footer class="site-footer">[\s\S]*?    <\/footer>/, homeFooter, "homepage footer");
await write("index.html", html);

let archive = await read("myth-busters.html");
archive = replaceExact(
  archive,
  `    <link rel="stylesheet" href="styles-v2.css?v=8" />\n    <link rel="stylesheet" href="myth-busters.css?v=2" />\n    <script defer src="script.js?v=2"></script>\n    <script defer src="myth-busters.js?v=6"></script>`,
  `    <link rel="stylesheet" href="styles-v2.css?v=9" />\n    <link rel="stylesheet" href="myth-busters.css?v=2" />\n    <link rel="stylesheet" href="legal.css?v=3" />\n    <script defer src="site-navigation.js?v=1"></script>\n    <script defer src="myth-busters.js?v=6"></script>`,
  "archive head assets"
);
const archiveFooter = `    <footer class="site-footer">
      <div class="shell footer-main footer-directory">
        <div class="footer-directory-column footer-directory-brand-column">
          <a class="brand footer-brand footer-directory-brand" href="index.html#top" aria-label="Rudrankaa home">
            <span class="brand-mark" aria-hidden="true">ॐ</span>
            <span class="brand-name">RUDRANKAA™</span>
          </a>
          <p class="footer-directory-tagline">DESTINY ARCHITECT</p>
          <p class="footer-directory-copy">Thoughtful numerology guidance for greater clarity, reflection and informed personal choices.</p>
        </div>
        <div class="footer-directory-column">
          <h2 class="footer-directory-heading">Explore</h2>
          <nav class="footer-directory-links" aria-label="Explore Rudrankaa">
            <a href="index.html#about">About Rudrankaa</a>
            <a href="index.html#services">Services</a>
            <a href="index.html#process">How It Works</a>
            <a href="#main" aria-current="page">Myth Busters</a>
            <a href="index.html#testimonials">Testimonials</a>
            <a href="index.html#faq">FAQ</a>
          </nav>
        </div>
        <div class="footer-directory-column">
          <h2 class="footer-directory-heading">Legal</h2>
          <nav class="footer-directory-links" aria-label="Legal information">
            <a href="disclaimer.html">Disclaimer</a>
            <a href="terms.html">Terms &amp; Conditions</a>
            <a href="privacy.html">Privacy Policy</a>
          </nav>
        </div>
        <div class="footer-directory-column">
          <h2 class="footer-directory-heading">Get in touch</h2>
          <div class="footer-directory-links footer-contact-links">
            <a href="https://wa.me/919152376399?text=Namaste%2C%20I%20would%20like%20to%20book%20a%20Rudrankaa%20consultation." target="_blank" rel="noopener noreferrer">WhatsApp +91 91523 76399</a>
            <a href="mailto:contact@rudrankaa.com">contact@rudrankaa.com</a>
            <a href="index.html#contact">Book a Consultation</a>
          </div>
        </div>
      </div>
      <div class="shell footer-bottom footer-bottom-clean">
        <div class="footer-legal-left">
          <span>© <span id="year">2026</span> Rudrankaa. All rights reserved.</span>
          <p class="trademark-notice">RUDRANKAA™ and the Rudrankaa logo are trademarks.</p>
        </div>
      </div>
    </footer>`;
archive = replaceRegexOnce(archive, /    <footer class="site-footer">[\s\S]*?    <\/footer>/, archiveFooter, "archive footer");
await write("myth-busters.html", archive);

let styles = await read("styles-v2.css");
const structuralStyles = `

/* Static credibility elements previously injected at runtime. */
.site-header .brand-logo-frame {
  height: 88px !important;
}

.site-header .brand-logo-frame::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  height: 15px;
  background: #fffdf9;
  pointer-events: none;
}

.hero-credential {
  max-width: 680px;
  margin: 0.2rem 0 1.55rem;
  color: var(--maroon);
}

.hero-credential-message {
  display: block;
  margin-bottom: 0.62rem;
  font-family: var(--serif);
  font-size: clamp(1.02rem, 1.35vw, 1.18rem);
  font-weight: 600;
  line-height: 1.42;
}

.hero-credential-detail {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.18rem 0 0.18rem 0.78rem;
  border-left: 2px solid var(--gold);
  background: transparent;
  color: var(--maroon);
  font-size: 0.88rem;
  font-weight: 800;
  letter-spacing: 0.045em;
  line-height: 1.4;
  text-transform: uppercase;
}

.hero-credential-detail::before {
  content: "✦";
  color: var(--gold);
  font-size: 0.7rem;
}

.about-credential {
  margin-top: 1.35rem;
  padding-top: 1rem;
  border-top: 1px solid var(--line);
  color: var(--maroon);
  font-family: var(--serif);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.7;
}

.about-credential::before {
  content: "✦";
  margin-right: 0.55rem;
  color: var(--gold);
  font-size: 0.8rem;
}

.brand-trademark {
  position: absolute;
  right: 7px;
  top: 10px;
  z-index: 4;
  color: var(--maroon);
  font-family: var(--sans);
  font-size: 0.76rem;
  font-weight: 750;
  line-height: 1;
  pointer-events: none;
}

@media (min-width: 901px) {
  .hero-credential-message { max-width: 620px; }
  .hero-credential-detail { font-size: 0.92rem; }
}

@media (max-width: 640px) {
  .site-header .brand-logo-frame { height: 60px !important; }
  .site-header .brand-logo-frame::after { height: 3px; }
  .brand-trademark { right: 6px; top: 7px; font-size: 0.66rem; }
  .hero-credential { margin-top: 0.05rem; margin-bottom: 1.35rem; }
  .hero-credential-message { margin-bottom: 0.5rem; font-size: 0.98rem; line-height: 1.38; }
  .hero-credential-detail {
    display: flex;
    width: 100%;
    padding: 0.12rem 0 0.12rem 0.65rem;
    font-size: 0.77rem;
    letter-spacing: 0.025em;
    line-height: 1.45;
  }
  .signature-line { margin-bottom: 0.8rem; }
  .hero-lead { margin-top: 0.1rem; margin-bottom: 1.55rem; font-size: 1.02rem; line-height: 1.55; }
}
`;
if (styles.includes("Static credibility elements previously injected at runtime")) {
  throw new Error("styles-v2.css already contains Part 2 structural styles.");
}
styles += structuralStyles;
await write("styles-v2.css", styles);

let legal = await read("legal.css");
if (!legal.includes(".testimonial-experience-note")) {
  legal += `

.testimonial-experience-note {
  max-width: 760px;
  margin: 1.35rem auto 0;
  color: var(--ink-soft);
  font-size: 0.78rem;
  line-height: 1.55;
  text-align: center;
}
`;
}
await write("legal.css", legal);

let wrangler = await read("wrangler.jsonc");
wrangler = replaceExact(wrangler, `  "$schema": "./node_modules/wrangler/config-schema.json",\n`, "", "wrangler stale schema");
await write("wrangler.jsonc", wrangler);

let readme = await read("README.md");
readme = readme.replace(
  /- `script-v2\.js` — homepage behaviour and feature bootstrap\n/,
  "- `site-navigation.js` — shared header, mobile navigation and footer-year behaviour\n"
);
readme = readme.replace(
  /- `disclaimer\.html`, `terms\.html`, `privacy\.html`, `legal\.css`, `legal-footer\.js` — legal and footer content\n/,
  "- `disclaimer.html`, `terms.html`, `privacy.html`, `legal.css` — legal content and shared footer styling\n"
);
readme = readme.replace(
  "- `service-details.js` / `service-details.css` — service detail interactions\n",
  "- `service-details.js` / `service-details.css` — service detail dialog interactions; approved service summaries remain in HTML\n"
);
const marker = "## Automated health checks\n";
if (!readme.includes(marker)) throw new Error("README health-check section marker missing.");
readme = readme.replace(
  marker,
  "## Structural source of truth\n\nApproved visitor-facing credentials, service summaries, FAQ answers, disclaimers and footer content live directly in the HTML rather than being rewritten after page load. JavaScript is reserved for interaction and progressive enhancement.\n\n## Automated health checks\n"
);
await write("README.md", readme);

for (const obsolete of ["script-v2.js", "script.js", "legal-footer.js"]) {
  await rm(resolve(obsolete), { force: true });
}
await rm(resolve("scripts", "apply-part2-consolidation.mjs"), { force: true });

console.log("Part 2 structural consolidation applied successfully.");
