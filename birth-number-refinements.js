(() => {
  const birthNumberRefinementStyles = document.createElement("style");
  birthNumberRefinementStyles.textContent = `
    /* Keep the revealed number meaning close enough to the sticky header that
       the continuation cue remains naturally visible in the same viewport. */
    .birth-number-detail {
      padding-bottom: 12px !important;
      scroll-margin-top: 96px;
    }

    .birth-detail-card {
      padding: clamp(1.65rem, 3.4vw, 2.8rem) !important;
    }

    .birth-detail-number {
      font-size: clamp(5rem, 9vw, 7.8rem) !important;
    }

    .birth-day-input {
      transition: color 160ms ease;
    }

    .birth-day-input.is-default-example {
      color: #9a8f88;
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

    /* The continuation cue stays in normal document flow. Keeping this block
       compact avoids clipping while still leaving a graceful visual pause
       before the maroon reassurance band. */
    .birth-scroll-cue-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 72px;
      padding: 0.35rem 1rem 0.85rem;
      background: var(--paper);
      opacity: 1;
      overflow: visible;
      transition: opacity 220ms ease, min-height 220ms ease, padding 220ms ease;
    }

    .birth-scroll-cue-wrap[hidden] {
      display: none;
    }

    .birth-scroll-cue-wrap.is-hidden {
      min-height: 0;
      padding-top: 0;
      padding-bottom: 0;
      opacity: 0;
    }

    .birth-scroll-cue {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 0.14rem;
      padding: 0.18rem 0.85rem;
      border: 0;
      background: transparent;
      color: var(--maroon);
      font-family: var(--sans);
      font-size: 0.84rem;
      font-weight: 700;
      letter-spacing: 0.03em;
      line-height: 1.3;
      cursor: pointer;
    }

    .birth-scroll-cue::before {
      content: "⌄⌄";
      display: block;
      color: var(--gold);
      font-size: 1.22rem;
      line-height: 0.82;
      letter-spacing: -0.1em;
      animation: birth-scroll-nudge 1.6s ease-in-out 2;
    }

    .birth-scroll-cue:hover,
    .birth-scroll-cue:focus-visible {
      color: var(--maroon-deep);
      outline: none;
    }

    @keyframes birth-scroll-nudge {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(4px); }
    }

    @media (prefers-reduced-motion: reduce) {
      .birth-scroll-cue::before { animation: none; }
      .birth-scroll-cue-wrap { transition: none; }
    }

    @media (max-width: 640px) {
      .birth-number-detail {
        padding-bottom: 10px !important;
        scroll-margin-top: 72px;
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

      .birth-scroll-cue-wrap {
        min-height: 66px;
        padding: 0.3rem 0.8rem 0.72rem;
      }

      .birth-scroll-cue {
        padding: 0.15rem 0.65rem;
        font-size: 0.8rem;
      }

      .birth-scroll-cue::before {
        font-size: 1.14rem;
      }
    }
  `;
  document.head.appendChild(birthNumberRefinementStyles);

  const birthDayInputRefinement = document.querySelector("#birth-day");
  const birthDateLabelRefinement = document.querySelector(".birth-number-label");
  const birthDateNoteRefinement = document.querySelector(".birth-number-note");
  const birthSummaryRefinement = document.querySelector(".number-card .birth-summary");

  if (birthDateLabelRefinement) {
    birthDateLabelRefinement.textContent = "What date were you born?";
  }

  if (birthDateNoteRefinement) {
    birthDateNoteRefinement.textContent = "Enter only the date of the month (1–31). No full birth date is required.";
  }

  if (birthSummaryRefinement && !birthSummaryRefinement.querySelector("strong")) {
    birthSummaryRefinement.textContent = "Enter your birth date or choose a number to explore its energy.";
  }

  // Keep the planet naming format consistent with the other eight numbers.
  if (typeof birthNumberData !== "undefined" && birthNumberData[3]) {
    birthNumberData[3].planet = "Jupiter";
  }

  if (birthDayInputRefinement) {
    const defaultBirthDate = "19";
    const birthNumberFormRefinement = birthDayInputRefinement.closest(".birth-number-form");

    birthDayInputRefinement.placeholder = defaultBirthDate;

    if (!birthDayInputRefinement.value || birthDayInputRefinement.value === "12") {
      birthDayInputRefinement.value = defaultBirthDate;
    }

    if (birthDayInputRefinement.value === defaultBirthDate) {
      birthDayInputRefinement.classList.add("is-default-example");
    }

    birthDayInputRefinement.addEventListener("input", () => {
      birthDayInputRefinement.classList.remove("is-default-example");
    });

    birthNumberFormRefinement?.addEventListener("submit", () => {
      birthDayInputRefinement.classList.remove("is-default-example");
    });

    birthDayInputRefinement.addEventListener("focus", () => {
      window.setTimeout(() => birthDayInputRefinement.select(), 0);
    });
  }

  const detailSectionRefinement = document.querySelector(".birth-number-detail");
  const detailDescriptionRefinement = detailSectionRefinement?.querySelector(".birth-detail-description");
  const numberCardRefinement = document.querySelector(".number-card");
  const siteHeaderRefinement = document.querySelector(".site-header");

  // Remove the temporary duplicate reassurance line from the prior iteration.
  document.querySelector(".birth-trust-note")?.remove();

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
    !document.querySelector(".birth-scroll-cue-wrap")
  ) {
    // Capture the existing next section before inserting the cue. On the
    // current page this is the maroon reassurance band that should remain.
    const reassuranceSection = detailSectionRefinement.nextElementSibling;

    const cueWrap = document.createElement("div");
    cueWrap.className = "birth-scroll-cue-wrap";
    cueWrap.hidden = detailSectionRefinement.hidden;

    const scrollCue = document.createElement("button");
    scrollCue.type = "button";
    scrollCue.className = "birth-scroll-cue";
    scrollCue.textContent = "Scroll to discover more";
    scrollCue.setAttribute("aria-label", "Scroll to discover more content");

    cueWrap.appendChild(scrollCue);
    detailSectionRefinement.insertAdjacentElement("afterend", cueWrap);

    const hideScrollCue = () => {
      if (cueWrap.hidden || cueWrap.classList.contains("is-hidden")) return;
      cueWrap.classList.add("is-hidden");
    };

    const showScrollCue = () => {
      cueWrap.hidden = false;
      cueWrap.classList.remove("is-hidden");
    };

    const alignReassuranceBelowHeader = () => {
      if (!reassuranceSection) return;

      const headerBottom = Math.max(
        0,
        siteHeaderRefinement?.getBoundingClientRect().bottom || 0
      );
      const reassuranceRect = reassuranceSection.getBoundingClientRect();
      const desiredBandTop = headerBottom + 4;
      const targetTop = window.scrollY + reassuranceRect.top - desiredBandTop;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth"
      });
    };

    const scrollToReassurance = () => {
      if (!reassuranceSection) return;

      // Remove the cue from layout completely before measuring. Two animation
      // frames let the browser settle the new geometry reliably.
      cueWrap.hidden = true;
      cueWrap.classList.remove("is-hidden");

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(alignReassuranceBelowHeader);
      });
    };

    scrollCue.addEventListener("click", scrollToReassurance);

    const userScrollKeys = new Set(["ArrowDown", "PageDown", "End", " "]);
    window.addEventListener("wheel", hideScrollCue, { passive: true });
    window.addEventListener("touchmove", hideScrollCue, { passive: true });
    window.addEventListener("keydown", (event) => {
      if (userScrollKeys.has(event.key)) hideScrollCue();
    });

    const visibilityObserver = new MutationObserver(() => {
      if (!detailSectionRefinement.hidden) {
        cueWrap.hidden = false;
        window.setTimeout(showScrollCue, 650);
      } else {
        cueWrap.hidden = true;
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