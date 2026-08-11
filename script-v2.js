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

// Present academic credentials once in the hero, then reinforce personal expertise lower on the page.
const credentialStyles = document.createElement("style");
credentialStyles.textContent = `
  .hero-credential {
    margin: 0.35rem 0 1.35rem;
    color: var(--maroon);
  }

  .hero-credential-message {
    display: block;
    margin-bottom: 0.6rem;
    font-family: var(--serif);
    font-size: clamp(1rem, 1.5vw, 1.2rem);
    font-weight: 600;
    line-height: 1.45;
  }

  .hero-credential-detail {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.38rem 0.7rem;
    border-left: 2px solid var(--gold);
    background: rgba(185, 133, 60, 0.07);
    color: var(--maroon);
    font-size: 0.92rem;
    font-weight: 800;
    letter-spacing: 0.055em;
    line-height: 1.35;
    text-transform: uppercase;
  }

  .hero-credential-detail::before {
    content: "✦";
    color: var(--gold);
    font-size: 0.78rem;
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

  @media (max-width: 640px) {
    .hero-credential {
      margin-bottom: 1.1rem;
    }

    .hero-credential-message {
      font-size: 1rem;
    }

    .hero-credential-detail {
      font-size: 0.8rem;
      letter-spacing: 0.04em;
      padding: 0.36rem 0.58rem;
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
