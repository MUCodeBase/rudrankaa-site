(() => {
  const gallery = document.querySelector("#myth-busters-grid[data-gallery-view=\"home\"]");
  if (!gallery) return;

  let loaded = false;
  const loadGallery = () => {
    if (loaded) return;
    loaded = true;
    const script = document.createElement("script");
    script.src = "myth-busters.js?v=7";
    script.async = true;
    document.head.appendChild(script);
  };

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
