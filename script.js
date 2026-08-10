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

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
  });
});
