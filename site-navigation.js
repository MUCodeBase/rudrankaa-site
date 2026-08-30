const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".nav-toggle");
const navigation = document.querySelector(".site-nav");
const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const updateHeader = () => {
  header?.classList.toggle("scrolled", window.scrollY > 16);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation?.classList.toggle("open", !isOpen);
});

document.addEventListener(
  "click",
  (event) => {
    if (menuButton?.getAttribute("aria-expanded") !== "true" || !navigation) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (navigation.contains(target) || menuButton.contains(target)) return;
    event.preventDefault();
    event.stopPropagation();
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  },
  true
);

const actionCloseMenu = () => {
  navigation?.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "Open navigation");
};

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", actionCloseMenu);
});

const consultationLink = navigation?.querySelector("a.nav-cta[href=\"#contact\"]");

consultationLink?.addEventListener(
  "click",
  (event) => {
    const target = document.getElementById("contact");
    if (!target) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const isMobileMenuOpen = menuButton?.getAttribute("aria-expanded") === "true";
    actionCloseMenu();

    // Closing the mobile menu changes the navigation layout. Do not leave the
    // CTA focused while that happens: mobile browsers may scroll the focused
    // element back into view and override the pending Contact navigation.
    if (isMobileMenuOpen && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    const finishNavigation = () => {
      window.history.replaceState(null, "", "#contact");

      const rootStyle = document.documentElement.style;
      const previousScrollBehavior = rootStyle.scrollBehavior;
      const previousRootOverflowAnchor = rootStyle.overflowAnchor;
      const previousBodyOverflowAnchor = document.body.style.overflowAnchor;

      rootStyle.scrollBehavior = "auto";
      rootStyle.overflowAnchor = "none";
      document.body.style.overflowAnchor = "none";

      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(0, targetTop),
        left: 0,
        behavior: "auto",
      });

      window.requestAnimationFrame(() => {
        rootStyle.scrollBehavior = previousScrollBehavior;
        rootStyle.overflowAnchor = previousRootOverflowAnchor;
        document.body.style.overflowAnchor = previousBodyOverflowAnchor;
      });
    };

    const preloadMythBusters = window.rudrankaaLoadMythBusters;
    if (typeof preloadMythBusters === "function") {
      preloadMythBusters().then(finishNavigation);
    } else {
      finishNavigation();
    }
  },
  true
);
