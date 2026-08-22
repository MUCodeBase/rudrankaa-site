const header = document.querySelector(".site-header");
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

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
  });
});

// Keep the hero credibility sequence clear: positioning first, qualification as proof.
const credentialStyles = document.createElement("style");
credentialStyles.textContent = `
  /* Desktop: keep enough vertical room for the complete damroo, then mask only
     the lower tagline area of the source logo. */
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

  /* Keep the source logo artwork unchanged. The trademark mark sits inside
     the logo frame so it remains aligned at every viewport size. */
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

  .footer-legal-left {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 0.48rem;
  }

  .footer-legal-left > * {
    margin: 0;
  }

  .trademark-notice {
    margin: 0;
    color: rgba(255, 255, 255, 0.42);
    font-size: 0.72rem;
    line-height: 1.5;
  }

  @media (min-width: 901px) {
    .hero-credential-message {
      max-width: 620px;
    }

    .hero-credential-detail {
      font-size: 0.92rem;
    }
  }

  @media (max-width: 640px) {
    .site-header .brand-logo-frame {
      height: 60px !important;
    }

    .site-header .brand-logo-frame::after {
      height: 3px;
    }

    .brand-trademark {
      right: 6px;
      top: 7px;
      font-size: 0.66rem;
    }

    .hero-credential {
      margin-top: 0.05rem;
      margin-bottom: 1.35rem;
    }

    .hero-credential-message {
      margin-bottom: 0.5rem;
      font-size: 0.98rem;
      line-height: 1.38;
    }

    .hero-credential-detail {
      display: flex;
      width: 100%;
      padding: 0.12rem 0 0.12rem 0.65rem;
      font-size: 0.77rem;
      letter-spacing: 0.025em;
      line-height: 1.45;
    }

    .signature-line {
      margin-bottom: 0.8rem;
    }

    .hero-lead {
      margin-top: 0.1rem;
      margin-bottom: 1.55rem;
      font-size: 1.02rem;
      line-height: 1.55;
    }

    .footer-legal-left {
      gap: 0.5rem;
    }

    .trademark-notice {
      font-size: 0.72rem;
    }
  }
`;
document.head.appendChild(credentialStyles);

const heroHeading = document.querySelector(".hero h1");
const existingSignature = document.querySelector(".hero .signature-line");

if (heroHeading && !document.querySelector(".hero-credential")) {
  const heroCredential = document.createElement("div");
  heroCredential.className = "hero-credential";

  const heroMessage = document.createElement("span");
  heroMessage.className = "hero-credential-message";
  heroMessage.textContent = "Numerology guidance backed by experience, academic distinction & insight";

  const heroDetail = document.createElement("span");
  heroDetail.className = "hero-credential-detail";
  heroDetail.textContent = "Ph.D. in Numerology • Gold Medallist • Experienced Practitioner";

  heroCredential.append(heroMessage, heroDetail);

  if (existingSignature) {
    existingSignature.insertAdjacentElement("afterend", heroCredential);
  } else {
    heroHeading.insertAdjacentElement("afterend", heroCredential);
  }
}

const aboutLabel = document.querySelector(".about .section-label");
if (aboutLabel && aboutLabel.textContent.trim() === "About Rudrankaa") {
  aboutLabel.textContent = "About Rudrankaa™";
}

const aboutIntro = document.querySelector(".about .split-layout > div:first-child");
if (aboutIntro && !document.querySelector(".about-credential")) {
  const aboutCredential = document.createElement("p");
  aboutCredential.className = "about-credential";
  aboutCredential.textContent = "Every consultation is personally guided, drawing on deep numerological knowledge and practical experience, with careful attention to what matters most to you.";
  aboutIntro.appendChild(aboutCredential);
}

const logoFrame = document.querySelector(".site-header .brand-logo-frame");
if (logoFrame && !logoFrame.querySelector(".brand-trademark")) {
  const trademark = document.createElement("span");
  trademark.className = "brand-trademark";
  trademark.textContent = "™";
  trademark.setAttribute("aria-hidden", "true");
  logoFrame.appendChild(trademark);
}

const footerBottom = document.querySelector(".site-footer .footer-bottom");
if (footerBottom && !document.querySelector(".trademark-notice")) {
  const legalLeft = document.createElement("div");
  legalLeft.className = "footer-legal-left";

  const copyrightItem = footerBottom.firstElementChild;
  if (copyrightItem) {
    footerBottom.insertBefore(legalLeft, copyrightItem);
    legalLeft.appendChild(copyrightItem);
  } else {
    footerBottom.prepend(legalLeft);
  }

  const trademarkNotice = document.createElement("p");
  trademarkNotice.className = "trademark-notice";
  trademarkNotice.textContent = "RUDRANKAA™ and the Rudrankaa logo are trademarks.";
  legalLeft.appendChild(trademarkNotice);
}

const birthNumberFeature = document.createElement("script");
birthNumberFeature.src = "birth-number.js?v=3";
birthNumberFeature.async = false;
birthNumberFeature.addEventListener("load", () => {
  const birthNumberRefinements = document.createElement("script");
  birthNumberRefinements.src = "birth-number-refinements.js?v=9";
  birthNumberRefinements.async = false;
  document.head.appendChild(birthNumberRefinements);
});
document.head.appendChild(birthNumberFeature);

const heroNumberPadRefinement = document.createElement("script");
heroNumberPadRefinement.src = "hero-number-pad-refinement.js?v=7";
heroNumberPadRefinement.async = false;
document.head.appendChild(heroNumberPadRefinement);

// Disclaimer and claim-clarity enhancement.
if (!document.querySelector('link[href^="legal.css"]')) {
  const legalStylesheet = document.createElement("link");
  legalStylesheet.rel = "stylesheet";
  legalStylesheet.href = "legal.css?v=1";
  document.head.appendChild(legalStylesheet);
}

const serviceCopyUpdates = new Map([
  [
    "Manifestation Grid Activation",
    "Activate your intentions. Align your focus. Support purposeful action.",
  ],
  [
    "Name Energy Alignment",
    "Explore the numerological patterns and alignment connected with your name.",
  ],
  [
    "Personal Numerology Guidance",
    "Life • Relationships • Personal Decisions.",
  ],
  [
    "Business & Career Numerology",
    "Career Direction • Business Decisions • Brand & Business Alignment.",
  ],
  [
    "Rudraksha Consultancy",
    "Personalised Rudraksha selection and numerology-based guidance.",
  ],
]);

document.querySelectorAll(".service-card").forEach((card) => {
  const title = card.querySelector("h3")?.textContent.trim();
  const copy = title ? serviceCopyUpdates.get(title) : null;
  const description = card.querySelector("p");

  if (copy && description) {
    description.textContent = copy;
  }
});

const contactActions = document.querySelector("#contact .contact-actions");
if (contactActions && !document.querySelector(".consultation-disclaimer")) {
  const disclaimer = document.createElement("div");
  disclaimer.className = "consultation-disclaimer";

  const disclaimerText = document.createElement("p");
  disclaimerText.append(
    "Numerology is an interpretive discipline. Rudrankaa guidance is intended for reflection and self-development, does not guarantee outcomes, and is not a substitute for qualified medical, psychological, legal, financial, investment or tax advice. "
  );

  const fullDisclaimerLink = document.createElement("a");
  fullDisclaimerLink.href = "disclaimer.html";
  fullDisclaimerLink.textContent = "Read full disclaimer";
  disclaimerText.appendChild(fullDisclaimerLink);

  disclaimer.appendChild(disclaimerText);
  contactActions.insertAdjacentElement("afterend", disclaimer);
}

const footerGuidance = footerBottom
  ? Array.from(footerBottom.children).find((item) =>
      item.textContent.includes("Numerology guidance is intended for personal reflection")
    )
  : null;

if (footerGuidance && !footerGuidance.querySelector(".footer-disclaimer-link")) {
  const fullDisclaimerLink = document.createElement("a");
  fullDisclaimerLink.href = "disclaimer.html";
  fullDisclaimerLink.className = "footer-disclaimer-link";
  fullDisclaimerLink.textContent = "Disclaimer";
  footerGuidance.appendChild(fullDisclaimerLink);
}
