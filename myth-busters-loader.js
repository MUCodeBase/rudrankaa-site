(() => {
  const gallery = document.querySelector("#myth-busters-grid[data-gallery-view=\"home\"]");
  if (!gallery) return;

  let loaded = false;
  let loadPromise = null;

  const loadGallery = () => {
    if (loadPromise) return loadPromise;

    loaded = true;
    loadPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "myth-busters.js?v=7";
      script.async = true;
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", resolve, { once: true });
      document.head.appendChild(script);
    });

    return loadPromise;
  };

  window.rudrankaaLoadMythBusters = loadGallery;

  if (!("IntersectionObserver" in window)) {
    window.addEventListener("load", loadGallery, { once: true });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      loadGallery();
    },
    { rootMargin: "700px 0px" },
  );

  observer.observe(gallery);
})();
