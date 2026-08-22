const birthNumberStyles = document.createElement("style");
birthNumberStyles.textContent = `
  .birth-number-form { margin: -0.2rem 0 1.25rem; }
  .birth-number-label {
    display: block; margin-bottom: 0.25rem; color: var(--ink);
    font-family: var(--serif); font-size: 0.98rem; font-weight: 600; line-height: 1.35;
  }
  .birth-number-note {
    display: block; margin-bottom: 0.65rem; color: var(--ink-soft);
    font-size: 0.7rem; line-height: 1.45;
  }
  .birth-number-controls {
    display: grid; grid-template-columns: 72px minmax(0, 1fr); gap: 0.55rem;
  }
  .birth-day-input, .birth-number-submit { min-height: 42px; border-radius: 0; font: inherit; }
  .birth-day-input {
    width: 100%; border: 1px solid var(--line); background: var(--paper); color: var(--ink);
    padding: 0 0.7rem; text-align: center; outline: none;
  }
  .birth-day-input:focus { border-color: var(--gold); box-shadow: 0 0 0 2px rgba(185,133,60,.12); }
  .birth-day-input[aria-invalid="true"] { border-color: var(--maroon); }
  .birth-number-submit {
    border: 1px solid var(--maroon); background: var(--maroon); color: white;
    padding: 0.5rem 0.7rem; cursor: pointer; font-size: 0.72rem; font-weight: 800;
    letter-spacing: 0.035em; white-space: nowrap;
  }
  .birth-number-submit:hover, .birth-number-submit:focus-visible { background: var(--maroon-deep); }
  .birth-number-error {
    margin-top: 0.5rem; color: var(--maroon); font-size: 0.7rem; font-weight: 700; line-height: 1.4;
  }
  .birth-calculation {
    margin: 0.7rem 0 0; padding-left: 0.65rem; border-left: 2px solid var(--gold);
    color: var(--maroon); font-size: 0.74rem; font-weight: 750; line-height: 1.45;
  }
  .number-grid .number-tile {
    cursor: pointer; user-select: none;
    transition: border-color 160ms ease, background 160ms ease, color 160ms ease, transform 160ms ease;
  }
  .number-grid .number-tile:hover, .number-grid .number-tile:focus-visible {
    border-color: var(--gold); color: var(--maroon); transform: translateY(-1px); outline: none;
  }
  .number-grid .number-tile.is-selected,
  .number-grid .number-tile.is-selected:hover,
  .number-grid .number-tile.is-selected:focus-visible {
    border-color: var(--maroon); background: var(--maroon); color: white;
    font-size: 1.75rem; transform: none;
  }
  .number-card .birth-summary {
    color: var(--ink-soft); font-family: var(--serif); font-size: 1rem; line-height: 1.55;
  }
  .number-card .birth-summary strong {
    display: block; margin-bottom: 0.18rem; color: var(--maroon); font-family: var(--sans);
    font-size: 0.76rem; font-weight: 850; letter-spacing: 0.06em; text-transform: uppercase;
  }
  .birth-number-detail { padding: 0 0 72px; background: var(--paper); }
  .birth-number-detail[hidden] { display: none; }
  .birth-detail-card {
    display: grid; grid-template-columns: minmax(150px,.3fr) minmax(0,1fr);
    gap: clamp(2rem,6vw,5rem); align-items: start; padding: clamp(2rem,5vw,4.25rem);
    border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
    background: radial-gradient(circle at 10% 20%,rgba(217,183,121,.12),transparent 34%),
      linear-gradient(135deg,rgba(248,242,232,.72),rgba(255,253,249,.96));
  }
  .birth-detail-kicker {
    margin: 0 0 .7rem; color: var(--maroon); font-size: .7rem; font-weight: 850;
    letter-spacing: .16em; text-transform: uppercase;
  }
  .birth-detail-number {
    color: var(--maroon); font-family: var(--serif); font-size: clamp(5.5rem,11vw,9rem);
    font-weight: 400; line-height: .82;
  }
  .birth-detail-title {
    margin: 0 0 .55rem; color: var(--ink); font-family: var(--serif);
    font-size: clamp(2rem,4vw,3.3rem); font-weight: 500; letter-spacing: -.025em; line-height: 1.08;
  }
  .birth-detail-planet {
    display: inline-block; margin-bottom: .8rem; color: var(--gold); font-size: .77rem;
    font-weight: 850; letter-spacing: .12em; text-transform: uppercase;
  }
  .birth-detail-keywords {
    margin: 0 0 1.15rem; color: var(--maroon); font-size: .9rem; font-weight: 800; line-height: 1.55;
  }
  .birth-detail-description {
    max-width: 760px; margin: 0; color: var(--ink-soft); font-family: var(--serif);
    font-size: clamp(1.02rem,1.45vw,1.14rem); line-height: 1.85;
  }
  @media (max-width: 640px) {
    .birth-number-controls { grid-template-columns: 66px minmax(0,1fr); }
    .birth-number-submit { font-size: .68rem; letter-spacing: .02em; }
    .birth-number-detail { padding-bottom: 56px; }
    .birth-detail-card { grid-template-columns: 1fr; gap: 1.5rem; padding: 2rem 1.3rem 2.3rem; }
    .birth-detail-number { font-size: 5.4rem; }
    .birth-detail-description { font-size: 1rem; line-height: 1.75; }
  }
`;
document.head.appendChild(birthNumberStyles);

const birthNumberData = {
  1: {
    planet: "Sun",
    keywords: "Leadership · Authority · Individuality",
    description: "Number 1 carries the Sun’s energy of leadership, authority, and individuality, with a natural inclination to take charge and set direction. It is associated with the father, symbolising confidence, self-belief, guidance, and the ability to command. Its highest expression lies in initiating new beginnings, creating opportunities, and forging an independent path."
  },
  2: {
    planet: "Moon",
    keywords: "Intuition · Creativity · Emotional sensitivity",
    description: "Number 2 reflects the Moon’s receptive and nurturing nature, bringing intuition, creativity, and emotional sensitivity. It is associated with the mother, representing nurturing, care, emotional understanding, and an instinctive connection with people. Its strength lies in translating subtle perceptions and feelings into imagination, empathy, and creative expression."
  },
  3: {
    planet: "Jupiter · The Guru",
    keywords: "Wisdom · Learning · Higher knowledge · Expression",
    description: "Number 3 embodies Jupiter, the Guru, representing wisdom, learning, and higher knowledge. It gives a natural gift for expression, teaching, communication, and sharing ideas with others. Its expansive nature supports optimism, abundance, intellectual growth, and the ability to broaden horizons."
  },
  4: {
    planet: "Rahu",
    keywords: "Out-of-box thinking · Discipline · Jugaad · Risk appetite",
    description: "Number 4 carries the unconventional energy of Rahu, encouraging out-of-box thinking and the courage to question established methods. It combines discipline with practical jugaad, enabling innovative solutions when conventional approaches fall short. Its distinctive strength is a strong risk appetite, particularly when navigating unfamiliar or unconventional paths."
  },
  5: {
    planet: "Mercury",
    keywords: "Intelligence · Adaptability · Communication · Networking",
    description: "Number 5 is governed by Mercury, giving it sharp intelligence, adaptability, and quick thinking. Its natural strength lies in communication and networking, enabling it to connect people, ideas, information, and opportunities with ease. This makes Number 5 particularly aligned with business, trade, negotiation, and dynamic commercial environments."
  },
  6: {
    planet: "Venus",
    keywords: "Luxury · Beauty · Harmony · Relationships · Responsibility",
    description: "Number 6 expresses the refined energy of Venus, with a natural appreciation for luxury, beauty, harmony, and aesthetics. It places strong value on meaningful relationships, affection, companionship, and a balanced environment. Alongside its pursuit of comfort and refinement, Number 6 carries a deep sense of responsibility toward family, loved ones, and commitments."
  },
  7: {
    planet: "Ketu",
    keywords: "Research · Spirituality · Detachment · Intuition",
    description: "Number 7 reflects the introspective energy of Ketu, creating a natural inclination toward research, investigation, and deeper understanding. It is drawn to spirituality, contemplation, and subjects that require looking beyond the surface. Its journey is often marked by detachment, guided by a refined intuition that encourages inner exploration and the search for deeper truths."
  },
  8: {
    planet: "Saturn",
    keywords: "Financial acumen · Power · Position · Justice · Karma",
    description: "Number 8 carries the disciplined force of Saturn, developing financial acumen, power, and position through patience, structure, and sustained effort. It understands the value of authority, resources, systems, and long-term achievement. Its deeper dimension is governed by justice and karma, emphasising accountability, fairness, and the consequences of one’s actions."
  },
  9: {
    planet: "Mars",
    keywords: "Strength · Courage · Boldness · Execution · Humanitarian service",
    description: "Number 9 embodies the dynamic force of Mars, bringing strength, courage, and boldness with a powerful instinct to act. Its defining quality is execution—the ability to transform intention into decisive action, particularly in challenging circumstances. At its highest expression, this force becomes humanitarian, using personal strength and courage to protect, serve, and uplift others."
  }
};

const reduceToBirthNumber = (day) => {
  let value = day;
  while (value > 9) {
    value = String(value).split("").reduce((sum, digit) => sum + Number(digit), 0);
  }
  return value;
};

const buildCalculationTrace = (day) => {
  if (day < 10) return `${day} → Birth Number ${day}`;
  let value = day;
  let trace = `${day}`;
  while (value > 9) {
    const digits = String(value).split("").map(Number);
    const next = digits.reduce((sum, digit) => sum + digit, 0);
    trace += ` → ${digits.join(" + ")} = ${next}`;
    value = next;
  }
  return trace;
};

const numberCard = document.querySelector(".number-card");
const numberGrid = numberCard?.querySelector(".number-grid");
const heroSection = document.querySelector(".hero");

if (numberCard && numberGrid && heroSection && !numberCard.querySelector(".birth-number-form")) {
  const existingSummary = numberCard.querySelector("p");
  const numberTiles = [...numberGrid.querySelectorAll("span")];

  const form = document.createElement("form");
  form.className = "birth-number-form";
  form.noValidate = true;

  const label = document.createElement("label");
  label.className = "birth-number-label";
  label.htmlFor = "birth-day";
  label.textContent = "What day were you born?";

  const note = document.createElement("span");
  note.className = "birth-number-note";
  note.id = "birth-day-note";
  note.textContent = "Enter only the day of the month (1–31). No full birth date is required.";

  const controls = document.createElement("div");
  controls.className = "birth-number-controls";

  const input = document.createElement("input");
  input.className = "birth-day-input";
  input.id = "birth-day";
  input.name = "birth-day";
  input.type = "number";
  input.min = "1";
  input.max = "31";
  input.step = "1";
  input.inputMode = "numeric";
  input.autocomplete = "off";
  input.placeholder = "12";
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
    existingSummary.textContent = "Enter your birth day or choose a number to explore its energy.";
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
          <div class="birth-detail-number" aria-hidden="true"></div>
        </div>
        <div>
          <h3 class="birth-detail-title"></h3>
          <div class="birth-detail-planet"></div>
          <div class="birth-detail-keywords"></div>
          <p class="birth-detail-description"></p>
        </div>
      </div>
    </div>
  `;
  heroSection.insertAdjacentElement("afterend", detailSection);

  const detailNumber = detailSection.querySelector(".birth-detail-number");
  const detailTitle = detailSection.querySelector(".birth-detail-title");
  const detailPlanet = detailSection.querySelector(".birth-detail-planet");
  const detailKeywords = detailSection.querySelector(".birth-detail-keywords");
  const detailDescription = detailSection.querySelector(".birth-detail-description");
  const detailKicker = detailSection.querySelector(".birth-detail-kicker");

  const selectNumber = (number, source = "explore", day = null) => {
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

    if (existingSummary) {
      existingSummary.innerHTML = source === "birth"
        ? `<strong>Your Birth Number is ${number}</strong>${details.planet} · ${details.keywords}`
        : `<strong>Number ${number}</strong>${details.planet} · ${details.keywords}`;
    }

    if (source === "birth" && day !== null) {
      calculation.textContent = buildCalculationTrace(day);
      calculation.hidden = false;
    } else {
      calculation.hidden = true;
    }

    window.setTimeout(() => {
      const detailStyle = window.getComputedStyle(detailSection);
      const scrollMarginTop = Number.parseFloat(detailStyle.scrollMarginTop) || 0;
      const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height || 0;
      const detailTop = detailSection.getBoundingClientRect().top + window.scrollY;

      // Scroll only on the vertical axis. On mobile Safari, scrollIntoView can
      // also preserve or introduce a small horizontal offset when a descendant
      // has transformed glyph geometry (most visibly for Numbers 1 and 2).
      window.scrollTo({
        top: Math.max(0, detailTop - Math.max(scrollMarginTop, headerHeight)),
        left: 0,
        behavior: "smooth"
      });
    }, 120);
  };

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

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const day = Number(input.value);
    const valid = Number.isInteger(day) && day >= 1 && day <= 31;

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
    selectNumber(reduceToBirthNumber(day), "birth", day);
  });
}
