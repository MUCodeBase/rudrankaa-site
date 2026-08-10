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

// Surface the practitioner's academic credential without competing with the brand.
const credentialText = "PhD in Numerology";

const credentialStyles = document.createElement("style");
credentialStyles.textContent = `
  .hero-credential {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    margin: 0.2rem 0 1.35rem;
    padding: 0.48rem 0.8rem;
    border: 1px solid rgba(185, 133, 60, 0.38);
    border-radius: 999px;
    background: rgba(255, 253, 249, 0.72);
    color: var(--maroon);
    font-size: 0.76rem;
    font-weight: 750;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    box-shadow: 0 8px 24px rgba(54, 32, 23, 0.05);
  }

  .hero-credential::before {
    content: "✦";
    color: var(--gold);
    font-size: 0.72rem;
  }

  .about-credential {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: fit-content;
    margin-top: 1.35rem;
    padding-top: 1rem;
    border-top: 1px solid var(--line);
    color: var(--maroon);
    font-family: var(--serif);
    font-size: 1rem;
    font-weight: 600;
  }

  .about-credential::before {
    content: "✦";
    color: var(--gold);
    font-family: inherit;
    font-size: 0.8rem;
  }

  @media (max-width: 640px) {
    .hero-credential {
      margin-bottom: 1.1rem;
      font-size: 0.68rem;
      letter-spacing: 0.08em;
    }
  }
`;
document.head.appendChild(credentialStyles);

const heroHeading = document.querySelector(".hero h1");
const existingSignature = document.querySelector(".hero .signature-line");

if (heroHeading && !document.querySelector(".hero-credential")) {
  const heroCredential = document.createElement("p");
  heroCredential.className = "hero-credential";
  heroCredential.textContent = credentialText;

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
  aboutCredential.textContent = credentialText;
  aboutIntro.appendChild(aboutCredential);
}
