(() => {
  const legalStylesheet = document.querySelector('link[href^="legal.css"]');
  if (legalStylesheet && legalStylesheet.getAttribute("href") !== "legal.css?v=3") {
    legalStylesheet.setAttribute("href", "legal.css?v=3");
  }

  if (!document.querySelector("#footer-directory-spacing-fix")) {
    const compactFooterStyles = document.createElement("style");
    compactFooterStyles.id = "footer-directory-spacing-fix";
    compactFooterStyles.textContent = `
      .site-footer .footer-directory-heading {
        margin-bottom: 0.72rem !important;
      }

      .site-footer .footer-directory-links {
        gap: 0.55rem !important;
      }

      .site-footer .footer-directory-links > a {
        margin: 0 !important;
        padding: 0 !important;
      }
    `;
    document.head.appendChild(compactFooterStyles);
  }

  const footer = document.querySelector(".site-footer");
  const footerMain = footer?.querySelector(".footer-main");
  const footerBottom = footer?.querySelector(".footer-bottom");

  if (!footer || !footerMain || footerMain.dataset.legalDirectory === "ready") {
    return;
  }

  footerMain.dataset.legalDirectory = "ready";
  footerMain.classList.add("footer-directory");
  footerMain.innerHTML = `
    <div class="footer-directory-column footer-directory-brand-column">
      <a class="brand footer-brand footer-directory-brand" href="#top" aria-label="Rudrankaa home">
        <span class="brand-mark" aria-hidden="true">ॐ</span>
        <span class="brand-name">RUDRANKAA™</span>
      </a>
      <p class="footer-directory-tagline">DESTINY ARCHITECT</p>
      <p class="footer-directory-copy">
        Thoughtful numerology guidance for greater clarity, reflection and informed personal choices.
      </p>
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
        <a href="https://wa.me/919152376399?text=Namaste%2C%20I%20would%20like%20to%20book%20a%20Rudrankaa%20consultation."
           target="_blank" rel="noopener noreferrer">WhatsApp +91 91523 76399</a>
        <a href="mailto:contact@rudrankaa.com">contact@rudrankaa.com</a>
        <a href="#contact">Book a Consultation</a>
      </div>
    </div>
  `;

  if (footerBottom) {
    const currentYear = new Date().getFullYear();
    footerBottom.classList.add("footer-bottom-clean");
    footerBottom.innerHTML = `
      <div class="footer-legal-left">
        <span>© <span id="year">${currentYear}</span> Rudrankaa. All rights reserved.</span>
        <p class="trademark-notice">RUDRANKAA™ and the Rudrankaa logo are trademarks.</p>
      </div>
    `;
  }
})();
