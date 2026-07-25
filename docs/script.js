const menuButton = document.querySelector(".menu-button");
const globalMenu = document.querySelector(".global-menu");
const menuLinks = globalMenu.querySelectorAll("a");

const collectionGrid = document.querySelector(".collection-grid");
const map = document.querySelector(".map");
const heroImages = [...document.querySelectorAll(".top-image")];

function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(src);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

async function startHeroSlideshow(interiors) {
  const sources = interiors.map((item) => item["image-1"]).filter(Boolean);
  const slides = (await Promise.all(sources.map(loadImage))).filter(Boolean);

  if (!slides.length) {
    return;
  }

  heroImages[0].src = slides[0];

  if (slides.length === 1 || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  let slideIndex = 0;
  let visibleImageIndex = 0;

  setInterval(() => {
    slideIndex = (slideIndex + 1) % slides.length;
    const nextImageIndex = visibleImageIndex === 0 ? 1 : 0;

    heroImages[nextImageIndex].src = slides[slideIndex];
    heroImages[nextImageIndex].classList.add("is-visible");
    heroImages[visibleImageIndex].classList.remove("is-visible");
    visibleImageIndex = nextImageIndex;
  }, 5000);
}

async function renderCollections() {
  try {
    const response = await fetch("data/interiors.json");

    if (!response.ok) {
      throw new Error(`JSONの取得に失敗しました: ${response.status}`);
    }

    const interiors = await response.json();
    startHeroSlideshow(interiors);
    const collections = [...interiors]
      .sort((a, b) => Number(a.id) - Number(b.id))
      .map((item) => {
        return {
          placeId: item.place_id || item.address,
          placeName: item.place_name,
          number: String(item.id).padStart(2, "0"),
          image: item["image-1"],
          name: item.product_name,
          x: item.map_x ?? 50,
          y: item.map_y ?? 50
        };
      });

    collectionGrid.innerHTML = collections.map(({ number, image, name }) => `
      <a class="collection-item" href="collection-${number}.html">
        <img src="${image}" alt="${name}">
      </a>
    `).join("");

    const places = [...collections.reduce((groups, collection) => {
      const place = groups.get(collection.placeId);

      if (place) {
        place.collections.push(collection);
      } else {
        groups.set(collection.placeId, {
          id: collection.placeId,
          name: collection.placeName,
          x: collection.x,
          y: collection.y,
          collections: [collection]
        });
      }

      return groups;
    }, new Map()).values()];
    
    //mappin編集
    map.insertAdjacentHTML("beforeend", places.map((place) => {
      const hasMultipleCollections = place.collections.length > 1;

      return `
        <div class="map-location" style="--pin-x: ${place.x}%; --pin-y: ${place.y}%;">
          <button class="map-pin" type="button" aria-expanded="false"
            aria-label="${place.name}のコレクションを表示">
            <span class="map-pin-marker" aria-hidden="true">
              ${hasMultipleCollections
                ? `<span class="map-pin-count">${place.collections.length}</span>`
                : `<span class="map-pin-center"></span>`}
            </span>
          </button>
          <div class="map-popup">
            <strong>${place.name}</strong>
            ${place.collections.map((item) => `
              <a href="collection-${item.number}.html">
                ${item.name}
              </a>
            `).join("")}
          </div>
        </div>
      `;
    }).join(""));
  } catch (error) {
    collectionGrid.textContent = error.message;
    console.error(error);
  }
}

renderCollections();

function closeMapPopups() {
  document.querySelectorAll(".map-location.is-open").forEach((location) => {
    location.classList.remove("is-open");
    location.querySelector(".map-pin").setAttribute("aria-expanded", "false");
  });
}

map.addEventListener("click", (event) => {
  const button = event.target.closest("button.map-pin");

  if (!button) {
    return;
  }

  const location = button.closest(".map-location");
  const willOpen = !location.classList.contains("is-open");
  closeMapPopups();

  if (willOpen) {
    button.setAttribute("aria-expanded", "true");
    location.classList.add("is-open");
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".map-location")) {
    closeMapPopups();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMapPopups();
  }
});

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
  if (!siteLogo || !menuButton || !hero) {
    return;
  }

  const logoCenter =
    siteLogo.getBoundingClientRect().top + siteLogo.offsetHeight / 2;
  const menuCenter =
    menuButton.getBoundingClientRect().top + menuButton.offsetHeight / 2;
  const isOverHeroImage = hero.getBoundingClientRect().bottom > logoCenter;
  const isMenuOverHeroImage = hero.getBoundingClientRect().bottom > menuCenter;

  siteLogo.classList.toggle("is-dark", !isOverHeroImage);
  menuButton.classList.toggle("is-dark", !isMenuOverHeroImage);
}

updateLogoColor();
window.addEventListener("scroll", updateLogoColor, { passive: true });
window.addEventListener("resize", updateLogoColor);
