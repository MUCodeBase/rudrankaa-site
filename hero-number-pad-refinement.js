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

    /* Treat the large numeral and its planet as one identity unit. The number
       box has a fixed height and the planet follows with one fixed gap. */
    .birth-detail-identity {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      min-width: 0;
      max-width: 100%;
      gap: 0.72rem;
    }

    .birth-detail-identity .birth-detail-number {
      /* Scale only the numeral-sized box. Scaling a full-width box can extend
         the document beyond the viewport when Safari enlarges Number 1. */
      width: auto;
      max-width: 100%;
      align-self: flex-start;
      height: 1em;
      min-height: 0 !important;
      display: flex;
      align-items: flex-end;
      margin: 0;
      line-height: 1 !important;
      transform-origin: left bottom;
      will-change: transform;
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
      .birth-number-detail {
        overflow-x: clip;
      }

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

  /* Georgia uses different visible ink heights for different numeral glyphs.
     Equal CSS font-size therefore does not mean equal perceived numeral size.
     Measure the actual rendered glyphs and optically normalise the selected
     number to the tallest 1–9 reference while keeping its proportions intact. */
  const normaliseVisibleNumeralSize = (detailNumber) => {
    const value = detailNumber.textContent.trim();
    if (!/^[1-9]$/.test(value)) return;

    const style = window.getComputedStyle(detailNumber);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;

    const fontSize = Number.parseFloat(style.fontSize) || 100;
    const fontFamily = style.fontFamily || "Georgia, serif";
    const fontWeight = style.fontWeight || "400";
    const fontStyle = style.fontStyle || "normal";
    context.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

    const glyphHeight = (digit) => {
      const metrics = context.measureText(digit);
      const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.72;
      const descent = metrics.actualBoundingBoxDescent || 0;
      return ascent + descent;
    };

    const referenceHeight = Math.max(...["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(glyphHeight));
    const currentHeight = glyphHeight(value);
    const scale = currentHeight > 0 ? referenceHeight / currentHeight : 1;

    // Optical compensation remains bounded so browser/font differences cannot
    // create an unexpectedly oversized numeral.
    const safeScale = Math.min(1.28, Math.max(0.96, scale));
    detailNumber.style.transform = `scale(${safeScale})`;
  };

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

    normaliseVisibleNumeralSize(detailNumber);

    if (!detailNumber.dataset.opticalObserverAttached) {
      const numeralObserver = new MutationObserver(() => {
        normaliseVisibleNumeralSize(detailNumber);
      });

      numeralObserver.observe(detailNumber, {
        childList: true,
        characterData: true,
        subtree: true
      });
      detailNumber.dataset.opticalObserverAttached = "true";

      window.addEventListener("resize", () => normaliseVisibleNumeralSize(detailNumber), {
        passive: true
      });
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
