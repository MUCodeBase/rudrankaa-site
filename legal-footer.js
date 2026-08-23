(() => {
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

      .testimonial-experience-note {
        max-width: 760px;
        margin: 1.35rem auto 0;
        color: var(--ink-soft);
        font-size: 0.78rem;
        line-height: 1.55;
        text-align: center;
      }
    `;
    document.head.appendChild(compactFooterStyles);
  }

  // Keep the existing FAQ questions while aligning their answers with the
  // site's service, privacy and legal wording.
  const faqAnswers = new Map([
    [
      "What information is needed for a consultation?",
      "Your relevant name and date-of-birth details, together with the question or area where you are seeking clarity. Depending on the Service requested, additional details relevant to the numerological analysis may be needed. Please provide only information reasonably necessary for the consultation."
    ],
    [
      "Are consultations private?",
      "Rudrankaa treats consultation details with care and confidentiality and uses personal information only as reasonably necessary to provide and administer the requested Service, in accordance with the Rudrankaa Privacy Policy."
    ],
    [
      "Does numerology predict every outcome?",
      "Numerology is an interpretive discipline that may highlight patterns, cycles and tendencies. It does not determine or guarantee future events or outcomes, and personal choice and free will remain important."
    ],
    [
      "Can one consultation cover more than one area?",
      "Yes. Depending on the scope of the consultation, you may bring together relevant insights across personal, name, career, business or number-alignment themes. The appropriate scope can be discussed when arranging the consultation."
    ],
    [
      "How can I book?",
      "Use WhatsApp, phone or email from the consultation section below to share your question and arrange a suitable time. A request does not by itself guarantee availability; a consultation is confirmed when Rudrankaa communicates confirmation."
    ]
  ]);

  document.querySelectorAll("#faq details").forEach((item) => {
    const question = item.querySelector("summary")?.textContent.trim();
    const answer = question ? faqAnswers.get(question) : null;
    const answerElement = item.querySelector("p");

    if (answer && answerElement) {
      if (question === "Are consultations private?") {
        answerElement.replaceChildren();
        answerElement.append(
          "Rudrankaa treats consultation details with care and confidentiality and uses personal information only as reasonably necessary to provide and administer the requested Service, in accordance with the Rudrankaa "
        );

        const privacyLink = document.createElement("a");
        privacyLink.href = "privacy.html";
        privacyLink.textContent = "Privacy Policy";
        answerElement.append(privacyLink, ".");
      } else {
        answerElement.textContent = answer;
      }
    }
  });

  // Preserve client testimonial wording exactly as supplied; add only a quiet
  // context note clarifying that individual experiences can differ.
  const testimonialsSection = document.querySelector("#testimonials");
  const firstTestimonial = testimonialsSection?.querySelector(".testimonial-card");
  const testimonialGrid = firstTestimonial?.parentElement;

  if (testimonialGrid && !testimonialsSection.querySelector(".testimonial-experience-note")) {
    const testimonialNote = document.createElement("p");
    testimonialNote.className = "testimonial-experience-note";
    testimonialNote.textContent = "Testimonials reflect individual experiences and do not guarantee similar outcomes.";
    testimonialGrid.insertAdjacentElement("afterend", testimonialNote);
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
