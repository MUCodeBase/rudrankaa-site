(() => {
  const birthNumberRefinementStyles = document.createElement("style");
  birthNumberRefinementStyles.textContent = `
    /* Keep the revealed number meaning comfortably below the sticky header,
       while leaving enough of the following section visible to signal that
       the page continues. */
    .birth-number-detail {
      position: relative;
      padding-bottom: 28px !important;
      scroll-margin-top: 118px;
    }

    .birth-detail-card {
      padding: clamp(1.65rem, 3.4vw, 2.8rem) !important;
    }

    .birth-detail-number {
      font-size: clamp(5rem, 9vw, 7.8rem) !important;
    }

    .birth-detail-actions {
      margin-top: 1.2rem;
    }

    .birth-detail-back {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0;
      border: 0;
      border-bottom: 1px solid currentColor;
      background: transparent;
      color: var(--maroon);
      font-family: var(--sans);
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.035em;
      line-height: 1.5;
      cursor: pointer;
      text-underline-offset: 5px;
    }

    .birth-detail-back:hover,
    .birth-detail-back:focus-visible {
      color: var(--maroon-deep);
      outline: none;
    }

    .birth-trust-note {
      max-width: 680px;
      margin: 0.72rem auto 1.9rem;
      padding: 0 1.25rem;
      color: var(--ink-soft);
      font-family: var(--serif);
      font-size: 0.86rem;
      font-style: italic;
      font-weight: 500;
      line-height: 1.55;
      text-align: center;
    }

    .birth-scroll-cue {
      position: absolute;
      left: 50%;
      bottom: 2px;
      z-index: 2;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 0.12rem;
      transform: translateX(-50%);
      padding: 0.3rem 0.8rem;
      border: 0;
      background: rgba(255, 253, 249, 0.94);
      color: var(--maroon);
      font-family: var(--sans);
      font-size: 0.8rem;
      font-weight: 750;
      letter-spacing: 0.035em;
      line-height: 1.3;
      cursor: pointer;
      opacity: 0;
      pointer-events: none;
      transition: opacity 220ms ease, transform 220ms ease;
    }

    .birth-scroll-cue::before {
      content: "⌄⌄";
      display: block;
      color: var(--gold);
      font-size: 1.12rem;
      line-height: 0.8;
      letter-spacing: -0.1em;
      animation: birth-scroll-nudge 1.6s ease-in-out 2;
    }

    .birth-scroll-cue.is-visible {
      opacity: 1;
      pointer-events: auto;
    }

    .birth-scroll-cue.is-hidden {
      opacity: 0;
      pointer-events: none;
      transform: translate(-50%, 6px);
    }

    @keyframes birth-scroll-nudge {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(4px); }
    }

    @media (prefers-reduced-motion: reduce) {
      .birth-scroll-cue::before { animation: none; }
      .birth-scroll-cue { transition: none; }
    }

    @media (max-width: 640px) {
      .birth-number-detail {
        padding-bottom: 32px !important;
        scroll-margin-top: 88px;
      }

      .birth-detail-card {
        padding: 1.65rem 1.2rem 1.9rem !important;
        gap: 1.2rem !important;
      }

      .birth-detail-number {
        font-size: 4.9rem !important;
      }

      .birth-detail-actions {
        margin-top: 1.1rem;
      }

      .birth-trust-note {
        margin: 0.65rem auto 2rem;
        padding: 0 1.15rem;
        font-size: 0.8rem;
        line-height: 1.5;
      }

      .birth-scroll-cue {
        bottom: 3px;
        padding: 0.28rem 0.65rem;
        font-size: 0.75rem;
      }

      .birth-scroll-cue::before {
        font-size: 1.05rem;
      }
    }
  `;
  document.head.appendChild(birthNumberRefinementStyles);

  const birthDayInputRefinement = document.querySelector("#birth-day");
  if (birthDayInputRefinement) {
    // Make the visible example actionable: clicking Find my number immediately
    // calculates 12 unless the visitor replaces it with their own birth day.
    if (!birthDayInputRefinement.value) {
      birthDayInputRefinement.value = "12";
    }

    birthDayInputRefinement.addEventListener("focus", () => {
      window.setTimeout(() => birthDayInputRefinement.select(), 0);
    });
  }

  const detailSectionRefinement = document.querySelector(".birth-number-detail");
  const detailDescriptionRefinement = detailSectionRefinement?.querySelector(".birth-detail-description");
  const detailShellRefinement = detailSectionRefinement?.querySelector(".shell");
  const numberCardRefinement = document.querySelector(".number-card");
  const siteHeaderRefinement = document.querySelector(".site-header");

  if (
    detailDescriptionRefinement &&
    numberCardRefinement &&
    !document.querySelector(".birth-detail-back")
  ) {
    const actions = document.createElement("div");
    actions.className = "birth-detail-actions";

    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "birth-detail-back";
    backButton.textContent = "← Explore another number";

    backButton.addEventListener("click", () => {
      const headerHeight = siteHeaderRefinement?.getBoundingClientRect().height || 0;
      const cardTop = numberCardRefinement.getBoundingClientRect().top + window.scrollY;
      const targetTop = Math.max(0, cardTop - headerHeight - 24);

      window.scrollTo({
        top: targetTop,
        behavior: "smooth"
      });

      window.setTimeout(() => {
        birthDayInputRefinement?.focus({ preventScroll: true });
      }, 450);
    });

    actions.appendChild(backButton);
    detailDescriptionRefinement.insertAdjacentElement("afterend", actions);
  }

  if (
    detailSectionRefinement &&
    detailShellRefinement &&
    !detailSectionRefinement.querySelector(".birth-trust-note")
  ) {
    const trustNote = document.createElement("p");
    trustNote.className = "birth-trust-note";
    trustNote.textContent = "Numbers reveal patterns. Your choices shape your path.";
    detailShellRefinement.insertAdjacentElement("afterend", trustNote);
  }

  if (
    detailSectionRefinement &&
    detailShellRefinement &&
    !detailSectionRefinement.querySelector(".birth-scroll-cue")
  ) {
    const scrollCue = document.createElement("button");
    scrollCue.type = "button";
    scrollCue.className = "birth-scroll-cue";
    scrollCue.textContent = "Scroll to discover more";
    scrollCue.setAttribute("aria-label", "Scroll to discover more content");
    detailSectionRefinement.appendChild(scrollCue);

    const hideScrollCue = () => {
      scrollCue.classList.remove("is-visible");
      scrollCue.classList.add("is-hidden");
    };

    const showScrollCue = () => {
      scrollCue.classList.remove("is-hidden");
      scrollCue.classList.add("is-visible");
    };

    const scrollToNextSection = () => {
      hideScrollCue();
      const nextSection = detailSectionRefinement.nextElementSibling;
      if (!nextSection) return;

      const headerHeight = siteHeaderRefinement?.getBoundingClientRect().height || 0;
      const nextTop = nextSection.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(0, nextTop - headerHeight - 16),
        behavior: "smooth"
      });
    };

    scrollCue.addEventListener("click", scrollToNextSection);

    const userScrollKeys = new Set(["ArrowDown", "PageDown", "End", " "]);
    window.addEventListener("wheel", hideScrollCue, { passive: true });
    window.addEventListener("touchmove", hideScrollCue, { passive: true });
    window.addEventListener("keydown", (event) => {
      if (userScrollKeys.has(event.key)) hideScrollCue();
    });

    const visibilityObserver = new MutationObserver(() => {
      if (!detailSectionRefinement.hidden) {
        window.setTimeout(showScrollCue, 650);
      } else {
        hideScrollCue();
      }
    });

    visibilityObserver.observe(detailSectionRefinement, {
      attributes: true,
      attributeFilter: ["hidden"]
    });

    if (!detailSectionRefinement.hidden) {
      window.setTimeout(showScrollCue, 650);
    }
  }
})();