(() => {
  const serviceContent = new Map([
    ["manifestation-grid", { title: "Manifestation Grid Activation", paragraphs: ["A personalised Manifestation Grid is created using your date of birth and a unique combination of numbers. It can be used repeatedly, focusing on one wish or intention at a time, as a numerological aid alongside your own efforts.", "A personalised 3-digit Lucky Number is also calculated for you, giving you a simple number that can be carried or used in everyday life.", "The Manifestation Grid and Lucky Number are intended to complement your efforts, focus and positive intentions—not replace them—while pursuing your goals responsibly and without causing harm to others."] }],
    ["name-energy", { title: "Name Energy Alignment", paragraphs: ["Your date of birth is fixed and carries its own numerical pattern. Your name, however, can be consciously reviewed and, where appropriate, adjusted to create greater numerological harmony.", "Name Energy Alignment brings together Chaldean numerology and pronology, combining layered numerical calculations with the sound, pronunciation and vibrational qualities of individual alphabets to assess and create balanced name combinations.", "The service also includes creating numerologically and phonetically aligned names for newborn babies, taking the child’s date of birth into consideration.", "The objective is to identify a name considered more supportive, harmonious and well aligned within the Rudrankaa numerological framework."] }],
    ["personal-numerology", { title: "Personal Numerology Guidance", paragraphs: ["Personal Numerology Guidance helps you understand the numerical influences relevant to different areas of your life.", "The consultation may include alignment of your name with your date of birth, your current Name & Number Mahadasha, your Personal Year and its opportunities and cautions, and the compatibility of your mobile number with your date of birth.", "It can also help identify periods considered more favourable from a numerological perspective for specific tasks, goals or important decisions, allowing you to consider timing as part of your planning.", "Where relevant, the consultation may also include marriage compatibility for those planning marriage, helping assess numerical compatibility between partners."], conclusion: "The overall analysis is brought together into personalised numerological guidance, with customised remedies or recommendations where appropriate." }],
    ["business-career", { title: "Business & Career Numerology", paragraphs: ["Business & Career Numerology uses your numerical profile to provide additional perspective when considering important professional and business decisions.", "It may include identifying career directions considered more compatible with your numerical profile, guidance for business and brand naming, and assessment of numerological compatibility between business partners.", "The consultation can also examine timing for starting a new venture, changing career direction or taking important business decisions, helping you identify periods that may be considered more favourable from a numerological perspective."] }],
    ["critical-number", { title: "Critical Number Alignment", paragraphs: ["Numbers surround us in everyday life—from our mobile and house numbers to vehicle and bank-account numbers.", "Critical Number Alignment assesses the compatibility of these important numbers with your date of birth, helping identify combinations considered more supportive within the Rudrankaa numerological framework and highlighting combinations that may warrant reconsideration.", "The guidance can also help you evaluate number combinations considered more favourable within the numerological framework when choosing or changing important numbers in everyday life."] }],
    ["rudraksha-crystal-yantra", { title: "Rudraksha, Crystal & Yantra Guidance", paragraphs: ["Rudraksha, crystals and yantras have traditionally been used for different spiritual and personal intentions.", "Rudraksha is referenced in traditional scriptures and associated with different purposes according to its type. Crystals are traditionally associated with practices relating to energy and chakra balance, while yantras are associated with particular intentions and spiritual practices.", "Based on your date of birth and the purpose for which guidance is sought, Rudrankaa provides guidance on Rudraksha, crystal and/or yantra selections considered appropriate within this traditional and numerological framework.", "As authenticity is particularly important for such products, we recommend purchasing Rudraksha and crystals only from reliable and trusted sources."] }]
  ]);

  const triggers = Array.from(document.querySelectorAll(".service-details-trigger[data-service-key]"));
  if (!triggers.length) return;

  const dialog = document.createElement("dialog");
  dialog.className = "service-details-dialog";
  dialog.setAttribute("aria-labelledby", "service-details-title");
  dialog.innerHTML = `<div class="service-dialog-shell"><button class="service-dialog-close" type="button" aria-label="Close service details">×</button><p class="service-dialog-eyebrow">Service details</p><h2 id="service-details-title"></h2><div class="service-dialog-copy"></div><a class="service-dialog-cta" href="#contact">Book a Consultation <span aria-hidden="true">→</span></a></div>`;
  document.body.appendChild(dialog);

  const dialogTitle = dialog.querySelector("#service-details-title");
  const dialogCopy = dialog.querySelector(".service-dialog-copy");
  const closeButton = dialog.querySelector(".service-dialog-close");
  const consultationLink = dialog.querySelector(".service-dialog-cta");
  let lockedScrollY = 0;
  let scrollLockSnapshot = null;

  const lockPageScroll = () => {
    if (scrollLockSnapshot) return;
    const rootStyle = document.documentElement.style;
    const bodyStyle = document.body.style;
    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    lockedScrollY = window.scrollY;
    scrollLockSnapshot = { rootOverflow: rootStyle.overflow, rootOverscrollBehavior: rootStyle.overscrollBehavior, bodyPosition: bodyStyle.position, bodyTop: bodyStyle.top, bodyLeft: bodyStyle.left, bodyRight: bodyStyle.right, bodyWidth: bodyStyle.width, bodyOverflow: bodyStyle.overflow, bodyPaddingRight: bodyStyle.paddingRight };
    rootStyle.overflow = "hidden";
    rootStyle.overscrollBehavior = "none";
    bodyStyle.position = "fixed";
    bodyStyle.top = `-${lockedScrollY}px`;
    bodyStyle.left = "0";
    bodyStyle.right = "0";
    bodyStyle.width = "100%";
    bodyStyle.overflow = "hidden";
    if (scrollbarWidth > 0) bodyStyle.paddingRight = `${scrollbarWidth}px`;
  };

  const unlockPageScroll = () => {
    if (!scrollLockSnapshot) return;
    const rootStyle = document.documentElement.style;
    const bodyStyle = document.body.style;
    const previousRootScrollBehavior = rootStyle.scrollBehavior;
    const snapshot = scrollLockSnapshot;
    scrollLockSnapshot = null;
    rootStyle.overflow = snapshot.rootOverflow;
    rootStyle.overscrollBehavior = snapshot.rootOverscrollBehavior;
    bodyStyle.position = snapshot.bodyPosition;
    bodyStyle.top = snapshot.bodyTop;
    bodyStyle.left = snapshot.bodyLeft;
    bodyStyle.right = snapshot.bodyRight;
    bodyStyle.width = snapshot.bodyWidth;
    bodyStyle.overflow = snapshot.bodyOverflow;
    bodyStyle.paddingRight = snapshot.bodyPaddingRight;
    rootStyle.scrollBehavior = "auto";
    window.scrollTo(0, lockedScrollY);
    rootStyle.scrollBehavior = previousRootScrollBehavior;
  };

  const openService = (content) => {
    dialogTitle.textContent = content.title;
    dialogCopy.replaceChildren();
    content.paragraphs.forEach((paragraph) => { const copy = document.createElement("p"); copy.textContent = paragraph; dialogCopy.appendChild(copy); });
    if (content.conclusion) { const conclusion = document.createElement("p"); conclusion.className = "service-dialog-conclusion"; conclusion.textContent = content.conclusion; dialogCopy.appendChild(conclusion); }
    lockPageScroll();
    try { if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", ""); }
    catch (error) { unlockPageScroll(); throw error; }
  };

  triggers.forEach((trigger) => { const content = serviceContent.get(trigger.dataset.serviceKey); if (content) trigger.addEventListener("click", () => openService(content)); });
  dialog.addEventListener("close", unlockPageScroll);
  closeButton?.addEventListener("click", () => dialog.close());

  consultationLink?.addEventListener("click", (event) => {
    const target = document.getElementById("contact");
    if (!target) return;
    event.preventDefault();
    event.stopImmediatePropagation();

    const navigateToContact = () => {
      window.history.replaceState(null, "", "#contact");
      const rootStyle = document.documentElement.style;
      const previousScrollBehavior = rootStyle.scrollBehavior;
      rootStyle.scrollBehavior = "auto";
      window.requestAnimationFrame(() => {
        const targetTop = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: Math.max(0, targetTop), left: 0, behavior: "auto" });
        rootStyle.scrollBehavior = previousScrollBehavior;
      });
    };

    if (dialog.open) dialog.close();
    const preloadMythBusters = window.rudrankaaLoadMythBusters;
    if (typeof preloadMythBusters === "function") preloadMythBusters().then(navigateToContact);
    else navigateToContact();
  }, true);
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
})();
