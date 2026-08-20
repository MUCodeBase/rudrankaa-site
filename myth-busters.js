(() => {
  const gallery = document.querySelector("#myth-busters-grid");
  const dialog = document.querySelector("#myth-buster-dialog");
  const dialogImage = dialog?.querySelector(".myth-buster-dialog-image");
  const dialogTitle = dialog?.querySelector("#myth-buster-dialog-title");
  const dialogClose = dialog?.querySelector(".myth-buster-dialog-close");

  const createZoomButton = (className, action, label, text) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.dataset.zoomAction = action;
    button.setAttribute("aria-label", label);
    button.textContent = text;
    return button;
  };

  const prepareDialogViewer = () => {
    if (!dialog || !dialogImage || !dialogClose) {
      return {};
    }

    const dialogBar = dialog.querySelector(".myth-buster-dialog-bar");
    const dialogViewport = document.createElement("div");
    const dialogCanvas = document.createElement("div");
    const dialogActions = document.createElement("div");
    const zoomControls = document.createElement("div");
    const zoomOut = createZoomButton("myth-buster-zoom-button", "out", "Zoom out", "−");
    const zoomReset = createZoomButton(
      "myth-buster-zoom-level",
      "reset",
      "Reset zoom to 100%",
      "100%",
    );
    const zoomIn = createZoomButton("myth-buster-zoom-button", "in", "Zoom in", "+");

    dialogViewport.className = "myth-buster-dialog-viewport";
    dialogCanvas.className = "myth-buster-dialog-canvas";
    dialogActions.className = "myth-buster-dialog-actions";
    zoomControls.className = "myth-buster-zoom-controls";
    zoomControls.setAttribute("role", "group");
    zoomControls.setAttribute("aria-label", "Flyer zoom controls");

    dialogImage.replaceWith(dialogViewport);
    dialogViewport.appendChild(dialogCanvas);
    dialogCanvas.appendChild(dialogImage);
    zoomControls.append(zoomOut, zoomReset, zoomIn);
    dialogActions.append(zoomControls, dialogClose);
    dialogBar?.appendChild(dialogActions);

    return { dialogViewport, dialogCanvas, zoomOut, zoomReset, zoomIn };
  };

  const { dialogViewport, dialogCanvas, zoomOut, zoomReset, zoomIn } = prepareDialogViewer();

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

  const minimumZoom = 1;
  const maximumZoom = 3;
  const zoomStep = 0.25;
  let zoom = minimumZoom;
  let fittedWidth = 0;
  let fittedHeight = 0;

  const updateZoomControls = () => {
    if (zoomReset) {
      zoomReset.textContent = `${Math.round(zoom * 100)}%`;
      zoomReset.setAttribute("aria-label", `Reset zoom to 100%. Current zoom ${Math.round(zoom * 100)}%`);
    }

    if (zoomOut) {
      zoomOut.disabled = zoom <= minimumZoom;
    }

    if (zoomIn) {
      zoomIn.disabled = zoom >= maximumZoom;
    }
  };

  const renderZoom = (nextZoom, preserveCenter = true) => {
    if (!dialogViewport || !dialogCanvas || !fittedWidth || !fittedHeight) {
      return;
    }

    const previousWidth = fittedWidth * zoom;
    const previousHeight = fittedHeight * zoom;
    const centerX = previousWidth > dialogViewport.clientWidth
      ? (dialogViewport.scrollLeft + dialogViewport.clientWidth / 2) / previousWidth
      : 0.5;
    const centerY = previousHeight > dialogViewport.clientHeight
      ? (dialogViewport.scrollTop + dialogViewport.clientHeight / 2) / previousHeight
      : 0.5;

    zoom = Math.min(maximumZoom, Math.max(minimumZoom, nextZoom));
    const nextWidth = Math.round(fittedWidth * zoom);
    const nextHeight = Math.round(fittedHeight * zoom);
    dialogCanvas.style.width = `${nextWidth}px`;
    dialogCanvas.style.height = `${nextHeight}px`;
    updateZoomControls();

    requestAnimationFrame(() => {
      if (zoom === minimumZoom || !preserveCenter) {
        dialogViewport.scrollTo({ left: 0, top: 0 });
        return;
      }

      dialogViewport.scrollTo({
        left: Math.max(0, centerX * nextWidth - dialogViewport.clientWidth / 2),
        top: Math.max(0, centerY * nextHeight - dialogViewport.clientHeight / 2),
      });
    });
  };

  const fitFlyer = () => {
    if (
      !dialog?.open ||
      !dialogImage?.naturalWidth ||
      !dialogImage?.naturalHeight ||
      !dialogViewport
    ) {
      return;
    }

    const fitScale = Math.min(
      dialogViewport.clientWidth / dialogImage.naturalWidth,
      dialogViewport.clientHeight / dialogImage.naturalHeight,
      1,
    );
    fittedWidth = Math.max(1, Math.floor(dialogImage.naturalWidth * fitScale));
    fittedHeight = Math.max(1, Math.floor(dialogImage.naturalHeight * fitScale));
    zoom = minimumZoom;
    renderZoom(minimumZoom, false);
  };

  const openFlyer = (imageSource, label) => {
    if (!dialog || !dialogImage || !dialogTitle || typeof dialog.showModal !== "function") {
      window.open(imageSource, "_blank", "noopener,noreferrer");
      return;
    }

    dialogImage.src = imageSource;
    dialogImage.alt = label;
    dialogTitle.textContent = label;
    dialog.showModal();
    requestAnimationFrame(fitFlyer);
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
  zoomOut?.addEventListener("click", () => renderZoom(zoom - zoomStep));
  zoomReset?.addEventListener("click", () => renderZoom(minimumZoom, false));
  zoomIn?.addEventListener("click", () => renderZoom(zoom + zoomStep));
  dialogImage?.addEventListener("load", fitFlyer);
  window.addEventListener("resize", fitFlyer);

  dialog?.addEventListener("keydown", (event) => {
    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      renderZoom(zoom + zoomStep);
    } else if (event.key === "-") {
      event.preventDefault();
      renderZoom(zoom - zoomStep);
    } else if (event.key === "0") {
      event.preventDefault();
      renderZoom(minimumZoom, false);
    }
  });

  dialog?.addEventListener("close", () => {
    zoom = minimumZoom;
    fittedWidth = 0;
    fittedHeight = 0;
    dialogCanvas?.removeAttribute("style");
    updateZoomControls();
  });

  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  updateZoomControls();
})();
