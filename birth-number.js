(() => {
  const birthNumberData = {
    1: {
      planet: "Sun",
      keywords: "Leadership · Authority · Individuality",
      description:
        "Number 1 carries the Sun’s energy of leadership, authority, and individuality, with a natural inclination to take charge and set direction. It is associated with the father, symbolising confidence, self-belief, guidance, and the ability to command. Its highest expression lies in initiating new beginnings, creating opportunities, and forging an independent path.",
    },
    2: {
      planet: "Moon",
      keywords: "Intuition · Creativity · Emotional sensitivity",
      description:
        "Number 2 reflects the Moon’s receptive and nurturing nature, bringing intuition, creativity, and emotional sensitivity. It is associated with the mother, representing nurturing, care, emotional understanding, and an instinctive connection with people. Its strength lies in translating subtle perceptions and feelings into imagination, empathy, and creative expression.",
    },
    3: {
      planet: "Jupiter",
      keywords: "Wisdom · Learning · Higher knowledge · Expression",
      description:
        "Number 3 embodies Jupiter, the Guru, representing wisdom, learning, and higher knowledge. It gives a natural gift for expression, teaching, communication, and sharing ideas with others. Its expansive nature supports optimism, abundance, intellectual growth, and the ability to broaden horizons.",
    },
    4: {
      planet: "Rahu",
      keywords: "Out-of-box thinking · Discipline · Jugaad · Risk appetite",
      description:
        "Number 4 carries the unconventional energy of Rahu, encouraging out-of-box thinking and the courage to question established methods. It combines discipline with practical jugaad, enabling innovative solutions when conventional approaches fall short. Its distinctive strength is a strong risk appetite, particularly when navigating unfamiliar or unconventional paths.",
    },
    5: {
      planet: "Mercury",
      keywords: "Intelligence · Adaptability · Communication · Networking",
      description:
        "Number 5 is governed by Mercury, giving it sharp intelligence, adaptability, and quick thinking. Its natural strength lies in communication and networking, enabling it to connect people, ideas, information, and opportunities with ease. This makes Number 5 particularly aligned with business, trade, negotiation, and dynamic commercial environments.",
    },
    6: {
      planet: "Venus",
      keywords: "Luxury · Beauty · Harmony · Relationships · Responsibility",
      description:
        "Number 6 expresses the refined energy of Venus, with a natural appreciation for luxury, beauty, harmony, and aesthetics. It places strong value on meaningful relationships, affection, companionship, and a balanced environment. Alongside its pursuit of comfort and refinement, Number 6 carries a deep sense of responsibility toward family, loved ones, and commitments.",
    },
    7: {
      planet: "Ketu",
      keywords: "Research · Spirituality · Detachment · Intuition",
      description:
        "Number 7 reflects the introspective energy of Ketu, creating a natural inclination toward research, investigation, and deeper understanding. It is drawn to spirituality, contemplation, and subjects that require looking beyond the surface. Its journey is often marked by detachment, guided by a refined intuition that encourages inner exploration and the search for deeper truths.",
    },
    8: {
      planet: "Saturn",
      keywords: "Financial acumen · Power · Position · Justice · Karma",
      description:
        "Number 8 carries the disciplined force of Saturn, developing financial acumen, power, and position through patience, structure, and sustained effort. It understands the value of authority, resources, systems, and long-term achievement. Its deeper dimension is governed by justice and karma, emphasising accountability, fairness, and the consequences of one’s actions.",
    },
    9: {
      planet: "Mars",
      keywords: "Strength · Courage · Boldness · Execution · Humanitarian service",
      description:
        "Number 9 embodies the dynamic force of Mars, bringing strength, courage, and boldness with a powerful instinct to act. Its defining quality is execution—the ability to transform intention into decisive action, particularly in challenging circumstances. At its highest expression, this force becomes humanitarian, using personal strength and courage to protect, serve, and uplift others.",
    },
  };

  const reduceToBirthNumber = (date) => {
    let value = date;
    while (value > 9) {
      value = String(value)
        .split("")
        .reduce((sum, digit) => sum + Number(digit), 0);
    }
    return value;
  };

  const buildCalculationTrace = (date) => {
    if (date < 10) return `${date} → Birth Number ${date}`;

    let value = date;
    let trace = `${date}`;
    while (value > 9) {
      const digits = String(value).split("").map(Number);
      const next = digits.reduce((sum, digit) => sum + digit, 0);
      trace += ` → ${digits.join(" + ")} = ${next}`;
      value = next;
    }
    return trace;
  };

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

    const referenceHeight = Math.max(
      ...["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(glyphHeight)
    );
    const currentHeight = glyphHeight(value);
    const scale = currentHeight > 0 ? referenceHeight / currentHeight : 1;
    const safeScale = Math.min(1.28, Math.max(0.96, scale));

    detailNumber.style.transform = `scale(${safeScale})`;
  };

  const numberCard = document.querySelector(".number-card");
  const numberGrid = numberCard?.querySelector(".number-grid");
  const heroSection = document.querySelector(".hero");
  const reassuranceSection = document.querySelector(".intro-band");
  const siteHeader = document.querySelector(".site-header");

  if (!numberCard || !numberGrid || !heroSection || numberCard.querySelector(".birth-number-form")) {
    return;
  }

  const existingSummary = numberCard.querySelector("p");
  const numberTiles = [...numberGrid.querySelectorAll("span")];

  const form = document.createElement("form");
  form.className = "birth-number-form";
  form.noValidate = true;

  const label = document.createElement("label");
  label.className = "birth-number-label";
  label.htmlFor = "birth-day";
  label.textContent = "What date were you born?";

  const note = document.createElement("span");
  note.className = "birth-number-note";
  note.id = "birth-day-note";
  note.textContent = "Enter only the date of the month (1–31). No full birth date is required.";

  const controls = document.createElement("div");
  controls.className = "birth-number-controls";

  const input = document.createElement("input");
  input.className = "birth-day-input is-default-example";
  input.id = "birth-day";
  input.name = "birth-day";
  input.type = "number";
  input.min = "1";
  input.max = "31";
  input.step = "1";
  input.inputMode = "numeric";
  input.autocomplete = "off";
  input.placeholder = "19";
  input.value = "19";
  input.setAttribute("aria-describedby", "birth-day-note birth-day-error");

  const submit = document.createElement("button");
  submit.className = "birth-number-submit";
  submit.type = "submit";
  submit.textContent = "Find my number";
  controls.append(input, submit);

  const error = document.createElement("div");
  error.className = "birth-number-error";
  error.id = "birth-day-error";
  error.hidden = true;
  error.setAttribute("role", "alert");

  const calculation = document.createElement("div");
  calculation.className = "birth-calculation";
  calculation.hidden = true;
  calculation.setAttribute("aria-live", "polite");

  form.append(label, note, controls, error, calculation);
  numberGrid.insertAdjacentElement("beforebegin", form);

  if (existingSummary) {
    existingSummary.classList.add("birth-summary");
    existingSummary.textContent = "Enter your birth date or choose a number to explore its energy.";
  }

  const detailSection = document.createElement("section");
  detailSection.className = "birth-number-detail";
  detailSection.hidden = true;
  detailSection.setAttribute("aria-live", "polite");
  detailSection.innerHTML = `
    <div class="shell">
      <div class="birth-detail-card">
        <div>
          <div class="birth-detail-kicker">Number energy</div>
          <div class="birth-detail-identity">
            <div class="birth-detail-number" aria-hidden="true"></div>
            <div class="birth-detail-planet"></div>
          </div>
        </div>
        <div>
          <h3 class="birth-detail-title"></h3>
          <div class="birth-detail-keywords"></div>
          <p class="birth-detail-description"></p>
          <div class="birth-detail-actions">
            <button class="birth-detail-back" type="button">← Explore another number</button>
          </div>
        </div>
      </div>
    </div>
  `;
  heroSection.insertAdjacentElement("afterend", detailSection);

  const cueWrap = document.createElement("div");
  cueWrap.className = "birth-scroll-cue-wrap";
  cueWrap.hidden = true;

  const scrollCue = document.createElement("button");
  scrollCue.type = "button";
  scrollCue.className = "birth-scroll-cue";
  scrollCue.textContent = "Scroll to discover more";
  scrollCue.setAttribute("aria-label", "Scroll to discover more content");
  cueWrap.appendChild(scrollCue);
  detailSection.insertAdjacentElement("afterend", cueWrap);

  const detailNumber = detailSection.querySelector(".birth-detail-number");
  const detailTitle = detailSection.querySelector(".birth-detail-title");
  const detailPlanet = detailSection.querySelector(".birth-detail-planet");
  const detailKeywords = detailSection.querySelector(".birth-detail-keywords");
  const detailDescription = detailSection.querySelector(".birth-detail-description");
  const detailKicker = detailSection.querySelector(".birth-detail-kicker");
  const backButton = detailSection.querySelector(".birth-detail-back");

  const hideScrollCue = () => {
    if (cueWrap.hidden || cueWrap.classList.contains("is-hidden")) return;
    cueWrap.classList.add("is-hidden");
  };

  const showScrollCue = () => {
    cueWrap.hidden = false;
    window.setTimeout(() => {
      cueWrap.classList.remove("is-hidden");
    }, 650);
  };

  const alignReassuranceBelowHeader = () => {
    if (!reassuranceSection) return;

    const headerBottom = Math.max(0, siteHeader?.getBoundingClientRect().bottom || 0);
    const reassuranceRect = reassuranceSection.getBoundingClientRect();
    const desiredBandTop = headerBottom + 4;
    const targetTop = window.scrollY + reassuranceRect.top - desiredBandTop;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth",
    });
  };

  const scrollToReassurance = () => {
    if (!reassuranceSection) return;

    cueWrap.hidden = true;
    cueWrap.classList.remove("is-hidden");

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(alignReassuranceBelowHeader);
    });
  };

  const selectNumber = (number, source = "explore", date = null) => {
    const details = birthNumberData[number];
    if (!details) return;

    numberTiles.forEach((tile) => {
      const selected = Number(tile.dataset.number) === number;
      tile.classList.toggle("is-selected", selected);
      tile.setAttribute("aria-pressed", String(selected));
    });

    detailNumber.textContent = String(number);
    detailTitle.textContent = `Number ${number}`;
    detailPlanet.textContent = details.planet;
    detailKeywords.textContent = details.keywords;
    detailDescription.textContent = details.description;
    detailKicker.textContent = source === "birth" ? "Your birth number" : "Explore number";
    detailSection.hidden = false;
    showScrollCue();

    if (existingSummary) {
      existingSummary.innerHTML =
        source === "birth"
          ? `<strong>Your Birth Number is ${number}</strong>${details.planet} · ${details.keywords}`
          : `<strong>Number ${number}</strong>${details.planet} · ${details.keywords}`;
    }

    if (source === "birth" && date !== null) {
      calculation.textContent = buildCalculationTrace(date);
      calculation.hidden = false;
    } else {
      calculation.hidden = true;
    }

    window.requestAnimationFrame(() => normaliseVisibleNumeralSize(detailNumber));

    window.setTimeout(() => {
      const detailStyle = window.getComputedStyle(detailSection);
      const scrollMarginTop = Number.parseFloat(detailStyle.scrollMarginTop) || 0;
      const headerHeight = siteHeader?.getBoundingClientRect().height || 0;
      const detailTop = detailSection.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: Math.max(0, detailTop - Math.max(scrollMarginTop, headerHeight)),
        left: 0,
        behavior: "smooth",
      });
    }, 120);
  };

  numberGrid.removeAttribute("aria-hidden");

  numberTiles.forEach((tile) => {
    tile.classList.remove("number-focus");
    tile.classList.add("number-tile");
    tile.dataset.number = tile.textContent.trim();
    tile.setAttribute("role", "button");
    tile.setAttribute("tabindex", "0");
    tile.setAttribute("aria-pressed", "false");
    tile.setAttribute("aria-label", `Explore Number ${tile.dataset.number}`);

    const activateTile = () => selectNumber(Number(tile.dataset.number), "explore");
    tile.addEventListener("click", activateTile);
    tile.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activateTile();
      }
    });
  });

  input.addEventListener("input", () => {
    input.classList.remove("is-default-example");
  });

  input.addEventListener("focus", () => {
    window.setTimeout(() => input.select(), 0);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    input.classList.remove("is-default-example");

    const date = Number(input.value);
    const valid = Number.isInteger(date) && date >= 1 && date <= 31;

    if (!valid) {
      input.setAttribute("aria-invalid", "true");
      error.textContent = "Please enter a whole-number day from 1 to 31.";
      error.hidden = false;
      calculation.hidden = true;
      input.focus();
      return;
    }

    input.removeAttribute("aria-invalid");
    error.hidden = true;
    selectNumber(reduceToBirthNumber(date), "birth", date);
  });

  backButton?.addEventListener("click", () => {
    const headerHeight = siteHeader?.getBoundingClientRect().height || 0;
    const cardTop = numberCard.getBoundingClientRect().top + window.scrollY;
    const targetTop = Math.max(0, cardTop - headerHeight - 24);

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });

    window.setTimeout(() => {
      input.focus({ preventScroll: true });
    }, 450);
  });

  scrollCue.addEventListener("click", scrollToReassurance);

  const userScrollKeys = new Set(["ArrowDown", "PageDown", "End", " "]);
  window.addEventListener("wheel", hideScrollCue, { passive: true });
  window.addEventListener("touchmove", hideScrollCue, { passive: true });
  window.addEventListener("keydown", (event) => {
    if (userScrollKeys.has(event.key)) hideScrollCue();
  });

  window.addEventListener(
    "resize",
    () => {
      if (!detailSection.hidden) normaliseVisibleNumeralSize(detailNumber);
    },
    { passive: true }
  );
})();