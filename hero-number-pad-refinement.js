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

    /* Once the live planet label is moved beneath the large numeral, make it
       a slightly stronger secondary identifier without competing with the number. */
    .birth-detail-card > div:first-child .birth-detail-planet {
      display: block;
      margin: 0.9rem 0 0;
      color: var(--gold);
      font-size: 0.92rem;
      font-weight: 850;
      letter-spacing: 0.13em;
      line-height: 1.25;
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
      .birth-detail-card > div:first-child .birth-detail-planet {
        margin-top: 0.7rem;
        font-size: 0.86rem;
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

  // Reuse the existing live planet element so updates for Numbers 1–9 continue
  // to come from the original birth-number logic. If that section is still
  // being created, observe briefly and move it as soon as it exists.
  const placePlanetBelowNumber = () => {
    const detailNumber = document.querySelector(".birth-detail-number");
    const detailPlanet = document.querySelector(".birth-detail-planet");

    if (!detailNumber || !detailPlanet) return false;

    if (detailPlanet.parentElement !== detailNumber.parentElement) {
      detailNumber.insertAdjacentElement("afterend", detailPlanet);
    }

    return true;
  };

  if (!placePlanetBelowNumber()) {
    const detailObserver = new MutationObserver(() => {
      if (placePlanetBelowNumber()) {
        detailObserver.disconnect();
      }
    });

    detailObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();
