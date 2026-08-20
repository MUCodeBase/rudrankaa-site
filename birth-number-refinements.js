const birthNumberRefinementStyles = document.createElement("style");
birthNumberRefinementStyles.textContent = `
  /* Keep the revealed number meaning comfortably below the sticky header. */
  .birth-number-detail {
    scroll-margin-top: 118px;
  }

  .birth-detail-actions {
    margin-top: 1.55rem;
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

  @media (max-width: 640px) {
    .birth-number-detail {
      scroll-margin-top: 88px;
    }

    .birth-detail-actions {
      margin-top: 1.35rem;
    }
  }
`;
document.head.appendChild(birthNumberRefinementStyles);

const birthDayInput = document.querySelector("#birth-day");
if (birthDayInput) {
  // Make the visible example actionable: clicking Find my number immediately
  // calculates 12 unless the visitor replaces it with their own birth day.
  if (!birthDayInput.value) {
    birthDayInput.value = "12";
  }

  birthDayInput.addEventListener("focus", () => {
    window.setTimeout(() => birthDayInput.select(), 0);
  });
}

const detailDescription = document.querySelector(".birth-number-detail .birth-detail-description");
const numberCard = document.querySelector(".number-card");
const siteHeader = document.querySelector(".site-header");

if (detailDescription && numberCard && !document.querySelector(".birth-detail-back")) {
  const actions = document.createElement("div");
  actions.className = "birth-detail-actions";

  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.className = "birth-detail-back";
  backButton.textContent = "← Explore another number";

  backButton.addEventListener("click", () => {
    const headerHeight = siteHeader?.getBoundingClientRect().height || 0;
    const cardTop = numberCard.getBoundingClientRect().top + window.scrollY;
    const targetTop = Math.max(0, cardTop - headerHeight - 24);

    window.scrollTo({
      top: targetTop,
      behavior: "smooth"
    });

    window.setTimeout(() => {
      birthDayInput?.focus({ preventScroll: true });
    }, 450);
  });

  actions.appendChild(backButton);
  detailDescription.insertAdjacentElement("afterend", actions);
}
