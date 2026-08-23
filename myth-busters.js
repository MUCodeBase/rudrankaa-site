(() => {
  const gallery = document.querySelector("#myth-busters-grid");
  const dialog = document.querySelector("#myth-buster-dialog");
  const dialogImage = dialog?.querySelector(".myth-buster-dialog-image");
  const dialogTitle = dialog?.querySelector("#myth-buster-dialog-title");
  const dialogClose = dialog?.querySelector(".myth-buster-dialog-close");
  const loadMoreButton = document.querySelector("#myth-busters-load-more");
  const galleryCount = document.querySelector("#myth-busters-count");
  const mobileHomeGallery = window.matchMedia("(max-width: 640px)");

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
    dialogViewport.style.touchAction = "none";
    dialogViewport.style.scrollbarGutter = "stable";
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
  const encodeAssetPath = (relativePath) => relativePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  const minimumZoom = 1;
  const maximumZoom = 3;
  const zoomStep = 0.25;
  const doubleTapZoom = 2;
  const doubleTapDelay = 325;
  const doubleTapDistance = 44;
  const tapMovementLimit = 18;
  let zoom = minimumZoom;
  let fittedWidth = 0;
  let fittedHeight = 0;

  const activePointers = new Map();
  const pointerStartPoints = new Map();
  let panPointerId = null;
  let panLastPoint = null;
  let pinchState = null;
  let gestureHadMultiplePointers = false;
  let lastTouchTap = null;

  const clampZoom = (value) => Math.min(maximumZoom, Math.max(minimumZoom, value));

  const getPointerPair = () => Array.from(activePointers.values()).slice(0, 2);

  const getDistance = (firstPoint, secondPoint) => Math.hypot(
    secondPoint.x - firstPoint.x,
    secondPoint.y - firstPoint.y,
  );

  const getMidpoint = (firstPoint, secondPoint) => ({
    x: (firstPoint.x + secondPoint.x) / 2,
    y: (firstPoint.y + secondPoint.y) / 2,
  });

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

    zoom = clampZoom(nextZoom);
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

  const renderZoomAroundPoint = (nextZoom, clientX, clientY) => {
    if (!dialogViewport || !dialogCanvas || !fittedWidth || !fittedHeight) {
      return;
    }

    const previousWidth = fittedWidth * zoom;
    const previousHeight = fittedHeight * zoom;
    const viewportRect = dialogViewport.getBoundingClientRect();
    const viewportX = clientX - viewportRect.left;
    const viewportY = clientY - viewportRect.top;
    const contentX = dialogViewport.scrollLeft + viewportX;
    const contentY = dialogViewport.scrollTop + viewportY;
    const contentRatioX = previousWidth > 0 ? contentX / previousWidth : 0.5;
    const contentRatioY = previousHeight > 0 ? contentY / previousHeight : 0.5;

    zoom = clampZoom(nextZoom);
    const nextWidth = Math.round(fittedWidth * zoom);
    const nextHeight = Math.round(fittedHeight * zoom);
    dialogCanvas.style.width = `${nextWidth}px`;
    dialogCanvas.style.height = `${nextHeight}px`;
    updateZoomControls();

    requestAnimationFrame(() => {
      dialogViewport.scrollTo({
        left: Math.max(0, contentRatioX * nextWidth - viewportX),
        top: Math.max(0, contentRatioY * nextHeight - viewportY),
      });
    });
  };

  const beginPinch = () => {
    const [firstPoint, secondPoint] = getPointerPair();
    if (!firstPoint || !secondPoint) {
      pinchState = null;
      return;
    }

    const distance = getDistance(firstPoint, secondPoint);
    if (!distance) {
      pinchState = null;
      return;
    }

    pinchState = {
      distance,
      zoom,
    };
    gestureHadMultiplePointers = true;
    lastTouchTap = null;
    panPointerId = null;
    panLastPoint = null;
  };

  const handleTouchTap = (event) => {
    const startPoint = pointerStartPoints.get(event.pointerId);
    pointerStartPoints.delete(event.pointerId);

    if (!startPoint || gestureHadMultiplePointers || activePointers.size > 1) {
      lastTouchTap = null;
      return;
    }

    const endPoint = { x: event.clientX, y: event.clientY };
    if (getDistance(startPoint, endPoint) > tapMovementLimit) {
      lastTouchTap = null;
      return;
    }

    const currentTap = {
      time: event.timeStamp,
      x: event.clientX,
      y: event.clientY,
    };

    if (
      lastTouchTap &&
      currentTap.time - lastTouchTap.time <= doubleTapDelay &&
      getDistance(lastTouchTap, currentTap) <= doubleTapDistance
    ) {
      event.preventDefault();
      const targetZoom = zoom > minimumZoom ? minimumZoom : doubleTapZoom;
      if (targetZoom === minimumZoom) {
        renderZoom(minimumZoom, false);
      } else {
        renderZoomAroundPoint(targetZoom, event.clientX, event.clientY);
      }
      lastTouchTap = null;
      return;
    }

    lastTouchTap = currentTap;
  };

  const finishPointerGesture = (pointerId) => {
    activePointers.delete(pointerId);

    if (activePointers.size >= 2) {
      beginPinch();
      return;
    }

    pinchState = null;

    if (activePointers.size === 1) {
      const [remainingPointerId, remainingPoint] = activePointers.entries().next().value;
      panPointerId = remainingPointerId;
      panLastPoint = remainingPoint;
    } else {
      panPointerId = null;
      panLastPoint = null;
      gestureHadMultiplePointers = false;
    }
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

    const availableWidth = Math.max(1, dialogViewport.clientWidth);
    const fitScale = availableWidth / dialogImage.naturalWidth;
    fittedWidth = Math.floor(availableWidth);
    fittedHeight = Math.max(1, Math.round(dialogImage.naturalHeight * fitScale));
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
    const imageSource = `assets/myth-busters/${encodeAssetPath(entry.file)}`;
    const thumbnailSource = typeof entry.thumbnail === "string" && entry.thumbnail.length > 0
      ? `assets/myth-busters/${encodeAssetPath(entry.thumbnail)}`
      : imageSource;

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
    image.src = thumbnailSource;
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

  const parsePositiveInteger = (value, fallback) => {
    const parsedValue = Number.parseInt(value, 10);
    return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
  };

  const itemLabel = (count) => `${count} Myth Buster${count === 1 ? "" : "s"}`;

  const renderHomeGallery = (entries) => {
    const desktopItemLimit = parsePositiveInteger(gallery.dataset.itemLimit, 4);
    const mobileItemLimit = parsePositiveInteger(gallery.dataset.mobileItemLimit, 2);
    const itemLimit = mobileHomeGallery.matches ? mobileItemLimit : desktopItemLimit;
    gallery.replaceChildren(...entries.slice(0, itemLimit).map(createCard));
  };

  const renderArchiveGallery = (entries) => {
    const pageSize = parsePositiveInteger(gallery.dataset.pageSize, 8);
    let visibleCount = 0;

    const updateArchiveControls = () => {
      if (galleryCount) {
        galleryCount.textContent = visibleCount >= entries.length
          ? `Showing all ${itemLabel(entries.length)}`
          : `Showing ${visibleCount} of ${itemLabel(entries.length)}`;
      }

      if (loadMoreButton) {
        loadMoreButton.hidden = visibleCount >= entries.length;
      }
    };

    const showNextPage = () => {
      const nextEntries = entries.slice(visibleCount, visibleCount + pageSize);
      gallery.append(...nextEntries.map(createCard));
      visibleCount += nextEntries.length;
      updateArchiveControls();
    };

    gallery.replaceChildren();
    loadMoreButton?.addEventListener("click", showNextPage);
    showNextPage();
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

      if (gallery.dataset.galleryView === "home") {
        renderHomeGallery(entries);
        const rerenderHomeGallery = () => renderHomeGallery(entries);

        if (typeof mobileHomeGallery.addEventListener === "function") {
          mobileHomeGallery.addEventListener("change", rerenderHomeGallery);
        } else {
          mobileHomeGallery.addListener(rerenderHomeGallery);
        }
      } else if (gallery.dataset.galleryView === "archive") {
        renderArchiveGallery(entries);
      } else {
        gallery.replaceChildren(...entries.map(createCard));
      }
    })
    .catch((error) => {
      console.error(error);
      gallery.innerHTML = '<p class="myth-busters-status">Myth Busters are temporarily unavailable.</p>';
      loadMoreButton?.setAttribute("hidden", "");
      if (galleryCount) {
        galleryCount.textContent = "";
      }
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

  dialogViewport?.addEventListener("pointerdown", (event) => {
    const pointerPoint = { x: event.clientX, y: event.clientY };
    activePointers.set(event.pointerId, pointerPoint);
    pointerStartPoints.set(event.pointerId, pointerPoint);
    dialogViewport.setPointerCapture?.(event.pointerId);

    if (activePointers.size >= 2) {
      beginPinch();
      return;
    }

    panPointerId = event.pointerId;
    panLastPoint = pointerPoint;
  });

  dialogViewport?.addEventListener("pointermove", (event) => {
    if (!activePointers.has(event.pointerId)) {
      return;
    }

    const currentPoint = { x: event.clientX, y: event.clientY };
    activePointers.set(event.pointerId, currentPoint);

    if (activePointers.size >= 2) {
      event.preventDefault();
      const [firstPoint, secondPoint] = getPointerPair();
      if (!firstPoint || !secondPoint) {
        return;
      }

      if (!pinchState) {
        beginPinch();
      }

      if (!pinchState) {
        return;
      }

      const distance = getDistance(firstPoint, secondPoint);
      const midpoint = getMidpoint(firstPoint, secondPoint);
      const nextZoom = pinchState.zoom * (distance / pinchState.distance);
      renderZoomAroundPoint(nextZoom, midpoint.x, midpoint.y);
      return;
    }

    const canScrollVertically = dialogViewport.scrollHeight > dialogViewport.clientHeight;

    if (
      panPointerId === event.pointerId &&
      panLastPoint &&
      (zoom > minimumZoom || canScrollVertically)
    ) {
      event.preventDefault();
      dialogViewport.scrollBy({
        left: zoom > minimumZoom ? panLastPoint.x - currentPoint.x : 0,
        top: panLastPoint.y - currentPoint.y,
      });
    }

    panLastPoint = currentPoint;
  });

  dialogViewport?.addEventListener("pointerup", (event) => {
    if (event.pointerType === "touch") {
      handleTouchTap(event);
    } else {
      pointerStartPoints.delete(event.pointerId);
    }
    finishPointerGesture(event.pointerId);
  });

  dialogViewport?.addEventListener("pointercancel", (event) => {
    pointerStartPoints.delete(event.pointerId);
    lastTouchTap = null;
    finishPointerGesture(event.pointerId);
  });

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
    activePointers.clear();
    pointerStartPoints.clear();
    panPointerId = null;
    panLastPoint = null;
    pinchState = null;
    gestureHadMultiplePointers = false;
    lastTouchTap = null;
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