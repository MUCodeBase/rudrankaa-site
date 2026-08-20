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
        margin-bottom: 1.15rem;
      }

      .hero .birth-number-form {
        margin-bottom: 1rem;
      }

      .hero .birth-number-note {
        margin-bottom: 0.5rem;
      }

      .hero .number-grid {
        gap: 0.5rem;
      }
    }

    @media (min-width: 1200px) {
      .hero .number-card,
      .hero .floating-symbol {
        transform: translateY(-180px);
      }
    }

    @media (min-width: 1000px) and (max-width: 1199px) {
      .hero .number-card,
      .hero .floating-symbol {
        transform: translateY(-120px);
      }
    }

    @media (min-width: 901px) and (max-width: 999px) {
      .hero .number-card,
      .hero .floating-symbol {
        transform: translateY(-80px);
      }
    }
  `;

  document.head.appendChild(heroPadStyles);
})();
