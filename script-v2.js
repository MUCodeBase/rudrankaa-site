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
  /* Keep the full logo visible while masking only the faint lower-edge artifact in the source image. */
  .brand-logo-frame {
    height: 66px;
  }

  .brand-logo-frame::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    height: 7px;
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

  @media (min-width: 901px) {
    .hero-credential-message {
      max-width: 620px;
    }

    .hero-credential-detail {
      font-size: 0.92rem;
    }
  }

  @media (max-width: 640px) {
    .brand-logo-frame {
      height: 52px;
    }

    .brand-logo-frame::after {
      height: 6px;
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

const aboutIntro = document.querySelector(".about .split-layout > div:first-child");
if (aboutIntro && !document.querySelector(".about-credential")) {
  const aboutCredential = document.createElement("p");
  aboutCredential.className = "about-credential";
  aboutCredential.textContent = "Every consultation is personally guided, drawing on deep numerological knowledge and practical experience, with careful attention to what matters most to you.";
  aboutIntro.appendChild(aboutCredential);
}
