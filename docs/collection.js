const pageMatch = location.pathname.match(/collection-(\d+)\.html$/);
const collectionId = pageMatch ? pageMatch[1].padStart(2, "0") : "01";
const detail = document.querySelector("#collection-detail");
const loadingMessage = document.querySelector("#loading-message");
const content = document.querySelector("#collection-content");
const menuButton = document.querySelector(".menu-button");
const globalMenu = document.querySelector(".global-menu");
const menuLinks = globalMenu.querySelectorAll("a");
const backButton = document.querySelector(".back-button");

backButton.addEventListener("click", () => {
  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "index.html";
    }
  };

  if (window.startPageTransition) {
    window.startPageTransition(goBack);
  } else {
    goBack();
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

function setText(id, value) {
  const element = document.querySelector(`#${id}`);

  if (!element) {
    console.warn(`表示先の要素「#${id}」が見つかりません。`);
    return;
  }

  element.textContent = value || "";
}

function setLink(id, url) {
  const link = document.querySelector(`#${id}`);

  if (!link) {
    console.warn(`リンク要素「#${id}」が見つかりません。`);
    return;
  }

  if (!url) {
    link.hidden = true;
    return;
  }

  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
}

function setImage(id, src, productName, number) {
  const image = document.querySelector(`#${id}`);

  if (!image) {
    console.warn(`画像要素「#${id}」が見つかりません。`);
    return;
  }

  if (!src) {
    image.hidden = true;
    return;
  }

  image.src = src;
  image.alt = `${productName}の写真${number}`;
}

function setMapLink(address) {
  const mapLink = document.querySelector("#map-link");

  if (!mapLink) {
    console.warn("地図リンク要素「#map-link」が見つかりません。");
    return;
  }

  if (!address) {
    mapLink.hidden = true;
    return;
  }

  mapLink.href =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  mapLink.target = "_blank";
  mapLink.rel = "noopener noreferrer";
  mapLink.setAttribute("aria-label", `${address}をGoogleマップで見る`);
}

function setMapPosition(x, y) {
  const mapPin = document.querySelector("#map-link");

  if (!mapPin) {
    return;
  }

  mapPin.style.setProperty("--pin-x", `${x ?? 50}%`);
  mapPin.style.setProperty("--pin-y", `${y ?? 50}%`);
}

//横スクロール
function renderCollectionCarousel(interiors) {
  const otherCollections = interiors
    .map((item) => ({
      ...item,
      number: String(item.id).padStart(2, "0")
    }))
    .filter((item) => item.number !== collectionId);

  if (!otherCollections.length) {
    return;
  }

  const carousel = document.createElement("section");
  carousel.className = "collection-carousel";
  carousel.setAttribute("aria-labelledby", "other-collections-title");
  carousel.innerHTML = `
    <h2 id="other-collections-title">OTHER COLLECTIONS</h2>
    <div class="carousel-layout">
      <button class="carousel-button carousel-button-prev" type="button"
        aria-label="前のコレクションを見る">&lt;</button>
      <div class="carousel-viewport">
        <div class="carousel-track">
          ${otherCollections.map((item) => `
            <a class="carousel-item" href="collection-${item.number}.html"
              aria-label="Collection ${item.number}：${item.product_name}">
              <img src="${item["image-1"]}" alt="${item.product_name}">
            </a>
          `).join("")}
        </div>
      </div>
      <button class="carousel-button carousel-button-next" type="button"
        aria-label="次のコレクションを見る">&gt;</button>
    </div>
  `;

  detail.append(carousel);

  const viewport = carousel.querySelector(".carousel-viewport");
  const items = [...carousel.querySelectorAll(".carousel-item")];

  function getCurrentIndex() {
    return items.reduce((closestIndex, item, index) => {
      const currentDistance = Math.abs(items[closestIndex].offsetLeft - viewport.scrollLeft);
      const itemDistance = Math.abs(item.offsetLeft - viewport.scrollLeft);
      return itemDistance < currentDistance ? index : closestIndex;
    }, 0);
  }

  function move(direction) {
    const currentIndex = getCurrentIndex();
    const nextIndex = (currentIndex + direction + items.length) % items.length;

    viewport.scrollTo({
      left: items[nextIndex].offsetLeft,
      behavior: "smooth"
    });
  }

  carousel.querySelector(".carousel-button-prev")
    .addEventListener("click", () => move(-1));
  carousel.querySelector(".carousel-button-next")
    .addEventListener("click", () => move(1));
}

function initializeScrollReveal() {
  const targets = document.querySelectorAll(".scroll-reveal");

  if (!targets.length) {
    return;
  }

  document.body.classList.add("reveal-ready");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.4,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  targets.forEach((target) => observer.observe(target));
}

async function loadCollection() {
  try {
    const response = await fetch("data/interiors.json");

    if (!response.ok) {
      throw new Error(`JSONの取得に失敗しました: ${response.status}`);
    }

    const interiors = await response.json();
    const item = interiors.find(
      (interior) => String(interior.id).padStart(2, "0") === collectionId
    );

    if (!item) {
      throw new Error(`コレクション${collectionId}のデータが見つかりません。`);
    }

    setText("product-name", item.product_name);
    setText("copy", item.copy);
    setText("comment", item.comment);
    setText("material", item.material);
    setText("brand", item.brand);
    setText("designer", item.designer);
    setText("genre", item.genre);
    setText("place-name", item.place_name);
    setText("address", item.address);
    setText("member-initials", item.member_initials);

    setImage("image-1", item["image-1"], item.product_name, 1);
    setImage("image-2", item["image-2"], item.product_name, 2);
    setLink("item-link", item.item_link);
    setLink("shop-link", item.shop_link);
    setLink("instagram-link", item.instagram_link);
    setMapLink(item.address);
    setMapPosition(item.map_x, item.map_y);
    renderCollectionCarousel(interiors);

    document.title =
      `${item.product_name} | Collection ${collectionId}`;
    loadingMessage.hidden = true;
    content.hidden = false;
    initializeScrollReveal();
  } catch (error) {
    loadingMessage.textContent = error.message;
    console.error(error);
  }
}

loadCollection();
