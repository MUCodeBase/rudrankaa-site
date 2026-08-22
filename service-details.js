(() => {
  const serviceContent = new Map([
    [
      "Manifestation Grid Activation",
      {
        summary:
          "A personalised manifestation grid and 3-digit Lucky Number, calculated from your date of birth, to support focused intentions and purposeful action towards your goals.",
        paragraphs: [
          "A personalised Manifestation Grid is created using your date of birth and a unique combination of numbers. It can be used repeatedly, focusing on one wish or intention at a time, as a numerological aid alongside your own efforts.",
          "A personalised 3-digit Lucky Number is also calculated for you, giving you a simple number that can be carried or used in everyday life.",
          "The Manifestation Grid and Lucky Number are intended to complement your efforts, focus and positive intentions—not replace them—while pursuing your goals responsibly and without causing harm to others.",
        ],
      },
    ],
    [
      "Name Energy Alignment",
      {
        summary:
          "Align your name with your date of birth through layered numerological calculations and sound-vibration analysis, including personalised naming guidance for newborns.",
        paragraphs: [
          "Your date of birth is fixed and carries its own numerical pattern. Your name, however, can be consciously reviewed and, where appropriate, adjusted to create greater numerological harmony.",
          "Name Energy Alignment combines multiple layers of numerological calculations with the sound vibrations associated with individual alphabets to assess and create balanced name combinations.",
          "The service also includes creating numerologically aligned names for newborn babies, taking the child’s date of birth into consideration.",
          "The objective is to identify a name whose numerical pattern is more supportive and harmonious with the individual.",
        ],
      },
    ],
    [
      "Personal Numerology Guidance",
      {
        summary:
          "A detailed personal numerology review covering name alignment, current numerical cycles, favourable timing, important numbers, relationships and customised guidance.",
        paragraphs: [
          "Personal Numerology Guidance helps you understand the numerical influences relevant to different areas of your life.",
          "The consultation may include alignment of your name with your date of birth, your current Name & Number Mahadasha, your Personal Year and its opportunities and cautions, and the compatibility of your mobile number with your date of birth.",
          "It can also help identify more favourable periods for specific tasks, goals or important decisions, allowing you to consider timing as part of your planning.",
          "Where relevant, the consultation may include marriage compatibility for people planning marriage, along with personalised numerological remedies or recommendations based on the overall analysis.",
        ],
      },
    ],
    [
      "Business & Career Numerology",
      {
        summary:
          "Numerology-based guidance for career direction, business and brand naming, partnership compatibility and the timing of important career or business decisions.",
        paragraphs: [
          "Business & Career Numerology uses your numerical profile to provide additional perspective when considering important professional and business decisions.",
          "It may include identifying suitable career directions based on your date of birth, guidance for business and brand naming, and assessment of numerological compatibility between business partners.",
          "The consultation can also examine timing for starting a new venture, changing career direction or taking important business decisions, helping you identify periods that may be considered more favourable from a numerological perspective.",
        ],
      },
    ],
    [
      "Critical Number Alignment",
      {
        summary:
          "Check how important everyday numbers—such as your mobile, house, vehicle and bank-account numbers—align with your date of birth.",
        paragraphs: [
          "Numbers surround us in everyday life—from our mobile and house numbers to vehicle and bank-account numbers.",
          "Critical Number Alignment assesses the compatibility of these important numbers with your date of birth, helping identify combinations considered more supportive within the Rudrankaa numerological framework and highlighting combinations that may warrant reconsideration.",
          "The guidance can also help you evaluate more favourable number combinations when choosing or changing important numbers in everyday life.",
        ],
      },
    ],
    [
      "Rudraksha Consultancy",
      {
        displayTitle: "Rudraksha, Crystal & Yantra Guidance",
        summary:
          "Personalised guidance for selecting Rudraksha, crystals and yantras based on your date of birth and intended purpose, with emphasis on authenticity and trusted sourcing.",
        paragraphs: [
          "Rudraksha, crystals and yantras have traditionally been used for different spiritual and personal intentions.",
          "Rudraksha is referenced in traditional scriptures and associated with different purposes according to its type. Crystals are traditionally used in practices relating to energy and chakra balance, while yantras are associated with particular intentions and spiritual practices.",
          "Based on your date of birth and the purpose for which guidance is sought, Rudrankaa helps you identify an appropriate Rudraksha, crystal and/or yantra within this traditional and numerological framework.",
          "As authenticity is particularly important for such products, we recommend purchasing Rudraksha and crystals only from reliable and trusted sources.",
        ],
      },
    ],
  ]);

  const cards = Array.from(document.querySelectorAll(".service-card"));
  if (!cards.length) return;

  const dialog = document.createElement("dialog");
  dialog.className = "service-details-dialog";
  dialog.setAttribute("aria-labelledby", "service-details-title");
  dialog.innerHTML = `
    <div class="service-dialog-shell">
      <button class="service-dialog-close" type="button" aria-label="Close service details">×</button>
      <p class="service-dialog-eyebrow">Service details</p>
      <h2 id="service-details-title"></h2>
      <div class="service-dialog-copy"></div>
      <a class="service-dialog-cta" href="#contact">Book a Consultation <span aria-hidden="true">→</span></a>
    </div>
  `;
  document.body.appendChild(dialog);

  const dialogTitle = dialog.querySelector("#service-details-title");
  const dialogCopy = dialog.querySelector(".service-dialog-copy");
  const closeButton = dialog.querySelector(".service-dialog-close");
  const consultationLink = dialog.querySelector(".service-dialog-cta");

  const openService = (title, content) => {
    dialogTitle.textContent = content.displayTitle || title;
    dialogCopy.replaceChildren();

    content.paragraphs.forEach((paragraph) => {
      const copy = document.createElement("p");
      copy.textContent = paragraph;
      dialogCopy.appendChild(copy);
    });

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  };

  cards.forEach((card) => {
    const titleElement = card.querySelector("h3");
    const description = card.querySelector("p");
    const originalTitle = titleElement?.textContent.trim();
    const content = originalTitle ? serviceContent.get(originalTitle) : null;

    if (!content || !titleElement || !description) return;

    titleElement.textContent = content.displayTitle || originalTitle;
    description.textContent = content.summary;
    description.classList.add("service-summary");

    const existingTrigger = card.querySelector(".service-details-trigger");
    if (existingTrigger) existingTrigger.remove();

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "service-details-trigger";
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.textContent = "View details";
    trigger.addEventListener("click", () => openService(originalTitle, content));
    card.appendChild(trigger);
  });

  closeButton?.addEventListener("click", () => dialog.close());

  consultationLink?.addEventListener("click", () => {
    if (dialog.open) dialog.close();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
})();
