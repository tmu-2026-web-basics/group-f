const transitionDuration = matchMedia("(prefers-reduced-motion: reduce)").matches
  ? 0
  : 450;

requestAnimationFrame(() => {
  requestAnimationFrame(() => document.body.classList.add("page-ready"));
});

window.startPageTransition = (navigate) => {
  if (document.body.classList.contains("page-leaving")) {
    return;
  }

  document.body.classList.add("page-leaving");
  window.setTimeout(navigate, transitionDuration);
};

window.addEventListener("pageshow", () => {
  document.body.classList.remove("page-leaving");
});

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");

  if (
    !link ||
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    link.target === "_blank" ||
    link.hasAttribute("download")
  ) {
    return;
  }

  const url = new URL(link.href, location.href);
  const isSamePageAnchor =
    url.pathname === location.pathname &&
    url.search === location.search &&
    url.hash;

  if (url.origin !== location.origin || isSamePageAnchor) {
    return;
  }

  event.preventDefault();
  window.startPageTransition(() => {
    location.href = url.href;
  });
});
