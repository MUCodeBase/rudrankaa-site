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

    /* Treat the large numeral and its planet as one identity unit. The fixed
       number box and fixed gap make the spacing independent of the individual
       Georgia glyph shape (1, 4, 5, 7, 9, etc.). */
    .birth-detail-identity {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.72rem;
    }

    .birth-detail-identity .birth-detail-number {
      width: 100%;
      height: 1em;
      min-height: 0 !important;
      display: flex;
      align-items: flex-end;
      margin: 0;
      line-height: 1 !important;
    }

    /* The live planet label remains secondary to the numeral but prominent
       enough to be immediately recognisable as the governing planet. */
    .birth-detail-identity .birth-detail-planet {
      display: block;
      margin: 0;
      color: var(--gold);
      font-size: 1rem;
      font-weight: 850;
      letter-spacing: 0.12em;
      line-height: 1.2;
      text-transform: uppercase;
    }

    @media (min-width: 1200px) {
      .hero .hero-grid > div:first-child {
        transform: translateY(-82px);
      }

      .hero .number-card,
      .hero .floating-symbol {
        transform: translateY(-228px);
      }
    }

    @media (min-width: 1000px) and (max-width: 1199px) {
      .hero .hero-grid > div:first-child {
        transform: translateY(-55px);
      }

      .hero .number-card,
      .hero .floating-symbol {
        transform: translateY(-155px);
      }
    }

    @media (min-width: 901px) and (max-width: 999px) {
      .hero .hero-grid > div:first-child {
        transform: translateY(-30px);
      }

      .hero .number-card,
      .hero .floating-symbol {
        transform: translateY(-100px);
      }
    }

    @media (max-width: 640px) {
      .birth-detail-identity {
        gap: 0.62rem;
      }

      .birth-detail-identity .birth-detail-planet {
        font-size: 0.94rem;
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

  // Reuse the existing live number and planet elements so the original
  // birth-number logic continues updating them for Numbers 1–9. Wrap them in
  // one fixed-gap identity stack instead of spacing the planet with margins.
  const buildNumberIdentity = () => {
    const detailNumber = document.querySelector(".birth-detail-number");
    const detailPlanet = document.querySelector(".birth-detail-planet");

    if (!detailNumber || !detailPlanet) return false;

    let identity = document.querySelector(".birth-detail-identity");

    if (!identity) {
      identity = document.createElement("div");
      identity.className = "birth-detail-identity";
      detailNumber.parentElement?.insertBefore(identity, detailNumber);
    }

    if (detailNumber.parentElement !== identity) {
      identity.appendChild(detailNumber);
    }

    if (detailPlanet.parentElement !== identity) {
      identity.appendChild(detailPlanet);
    }

    return true;
  };

  if (!buildNumberIdentity()) {
    const detailObserver = new MutationObserver(() => {
      if (buildNumberIdentity()) {
        detailObserver.disconnect();
      }
    });

    detailObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();
