const menuButton = document.querySelector(".menu-button");
const globalMenu = document.querySelector(".global-menu");
const menuLinks = globalMenu.querySelectorAll("a");

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "メニューを開く");
  globalMenu.classList.remove("is-open");
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";

  if (isOpen) {
    closeMenu();
  } else {
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "メニューを閉じる");
    globalMenu.classList.add("is-open");
  }
});

menuLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const siteLogo = document.querySelector(".site-logo");
const hero = document.querySelector(".hero");

function updateLogoColor() {
  if (!siteLogo || !hero) {
    return;
  }

  const logoCenter =
    siteLogo.getBoundingClientRect().top + siteLogo.offsetHeight / 2;
  const isOverHeroImage = hero.getBoundingClientRect().bottom > logoCenter;

  siteLogo.classList.toggle("is-dark", !isOverHeroImage);
}

updateLogoColor();
window.addEventListener("scroll", updateLogoColor, { passive: true });
window.addEventListener("resize", updateLogoColor);
