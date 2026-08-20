(() => {
  const gallery = document.querySelector("#myth-busters-grid");
  const dialog = document.querySelector("#myth-buster-dialog");
  const dialogImage = dialog?.querySelector(".myth-buster-dialog-image");
  const dialogTitle = dialog?.querySelector("#myth-buster-dialog-title");
  const dialogClose = dialog?.querySelector(".myth-buster-dialog-close");

  if (!gallery) {
    return;
  }

  const dateFormatter = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const formatDate = (isoDate) => dateFormatter.format(new Date(`${isoDate}T00:00:00Z`));

  const openFlyer = (imageSource, label) => {
    if (!dialog || !dialogImage || !dialogTitle || typeof dialog.showModal !== "function") {
      window.open(imageSource, "_blank", "noopener,noreferrer");
      return;
    }

    dialogImage.src = imageSource;
    dialogImage.alt = label;
    dialogTitle.textContent = label;
    dialog.showModal();
  };

  const createCard = (entry) => {
    const formattedDate = formatDate(entry.date);
    const label = `Rudrankaa Myth Buster published ${formattedDate}`;
    const imageSource = `assets/myth-busters/${encodeURIComponent(entry.file)}`;

    const figure = document.createElement("figure");
    figure.className = "myth-buster-card";

    const button = document.createElement("button");
    button.className = "myth-buster-open";
    button.type = "button";
    button.setAttribute("aria-label", `Open ${label}`);

    const imageFrame = document.createElement("span");
    imageFrame.className = "myth-buster-image-frame";

    const image = document.createElement("img");
    image.className = "myth-buster-image";
    image.src = imageSource;
    image.alt = label;
    image.width = 853;
    image.height = 1280;
    image.loading = "lazy";
    image.decoding = "async";

    const caption = document.createElement("span");
    caption.className = "myth-buster-caption";

    const captionTitle = document.createElement("strong");
    captionTitle.textContent = "Myth Buster";

    const date = document.createElement("time");
    date.dateTime = entry.date;
    date.textContent = formattedDate;

    imageFrame.appendChild(image);
    caption.append(captionTitle, date);
    button.append(imageFrame, caption);
    button.addEventListener("click", () => openFlyer(imageSource, label));
    figure.appendChild(button);

    return figure;
  };

  fetch("assets/myth-busters/manifest.json", { cache: "no-cache" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Myth Busters manifest returned ${response.status}`);
      }
      return response.json();
    })
    .then((entries) => {
      if (!Array.isArray(entries) || entries.length === 0) {
        gallery.innerHTML = '<p class="myth-busters-status">New Myth Busters will appear here soon.</p>';
        return;
      }

      gallery.replaceChildren(...entries.map(createCard));
    })
    .catch((error) => {
      console.error(error);
      gallery.innerHTML = '<p class="myth-busters-status">Myth Busters are temporarily unavailable.</p>';
    })
    .finally(() => {
      gallery.setAttribute("aria-busy", "false");
    });

  dialogClose?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
})();
