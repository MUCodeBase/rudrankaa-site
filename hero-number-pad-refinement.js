(() => {
  const heroPadStyles = document.createElement("style");
  heroPadStyles.textContent = `
    /* Desktop/tablet refinement for the expanded interactive number card.
       The original card was vertically centred before the birth-day controls
       were added. Lift the card and its floating accents together while
       preserving the orbit artwork and the established Rudrankaa visual theme. */

    @media (min-width: 901px) {
      .hero .number-card {
        padding: 2rem 2.15rem;
      }

      .hero .number-card .card-kicker {
        margin-bottom: 1.05rem;
      }

      .hero .birth-number-form {
        margin-bottom: 0.92rem;
      }

      .hero .birth-number-note {
        margin-bottom: 0.44rem;
      }

      .hero .number-grid {
        gap: 0.5rem;
      }
    }

    @media (min-width: 1200px) {
      .hero .number-card,
      .hero .floating-symbol {
        transform: translateY(-228px);
      }
    }

    @media (min-width: 1000px) and (max-width: 1199px) {
      .hero .number-card,
      .hero .floating-symbol {
        transform: translateY(-155px);
      }
    }

    @media (min-width: 901px) and (max-width: 999px) {
      .hero .number-card,
      .hero .floating-symbol {
        transform: translateY(-100px);
      }
    }
  `;

  document.head.appendChild(heroPadStyles);

  // Keep the existing maroon reassurance band and gold separator, changing
  // only its wording.
  const introBandInner = document.querySelector(".intro-band .intro-band-inner");
  const introBandLines = introBandInner ? [...introBandInner.querySelectorAll("p")] : [];

  if (introBandLines.length >= 2) {
    introBandLines[0].textContent = "Numbers reveal patterns.";
    introBandLines[1].textContent = "Your choices shape your path.";
  } else if (introBandLines.length === 1) {
    introBandLines[0].textContent = "Numbers reveal patterns. Your choices shape your path.";
  }
})();
