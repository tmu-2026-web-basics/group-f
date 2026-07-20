document.documentElement.classList.add("js");

const filterButtons = document.querySelectorAll("[data-filter]");
const itemCards = document.querySelectorAll(".item-card");
const collectionCount = document.querySelector(".collection-count");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach((filterButton) => {
      const isSelected = filterButton === button;
      filterButton.classList.toggle("is-active", isSelected);
      filterButton.setAttribute("aria-pressed", String(isSelected));
    });

    itemCards.forEach((card) => {
      const shouldShow = selectedCategory === "all" || card.dataset.category === selectedCategory;
      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount += 1;
      }
    });

    collectionCount.textContent = `01—${String(visibleCount).padStart(2, "0")} / 2026`;
  });
});

const revealTargets = document.querySelectorAll(".hero-image-wrap, .hero-copy, .item-card");

revealTargets.forEach((target, index) => {
  target.classList.add("reveal-item");
  target.style.transitionDelay = `${Math.min(index * 45, 270)}ms`;
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

itemCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (card.getAttribute("href") === "#") {
      event.preventDefault();
    }
  });
});
