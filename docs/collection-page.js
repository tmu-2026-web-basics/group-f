document.body.innerHTML = `
  <a class="site-logo" href="index.html" aria-label="トップページへ">
    <img src="images/logo/group_f_logowth.png" alt="group F">
  </a>

  <button class="back-button" type="button" aria-label="前のページに戻る">←</button>

  <button
    class="menu-button"
    type="button"
    aria-label="メニューを開く"
    aria-expanded="false"
    aria-controls="global-menu"
  >
    <span></span><span></span><span></span>
  </button>

  <nav id="global-menu" class="global-menu" aria-label="メインメニュー">
    <a href="index.html#about-title">ABOUT</a>
    <a href="index.html#collection-title">COLLECTION</a>
  </nav>

  <main id="collection-detail">
    <p id="loading-message">データを読み込んでいます。</p>

    <article id="collection-content" hidden>
      <img id="image-1" class="scroll-reveal" src="" alt="">

      <div class="image-comment-row">
        <img id="image-2" class="scroll-reveal" src="" alt="">
        <p id="copy" class="scroll-reveal"></p>
      </div>

      <section class="collection-info">
        <h2>EXPLANATION</h2>

        <dl class="explanation-list">
          <dt>Product Name</dt><dd id="product-name"></dd>
          <dt>Brand</dt><dd id="brand"></dd>
          <dt>Designer</dt><dd id="designer"></dd>
          <dt>Material</dt><dd id="material"></dd>
          <dt>Genre</dt><dd id="genre"></dd>
          <p><a id="item-link" href="">Product Page</a></p>
        </dl>

        <h3 class="place-title">PLACE</h3>

        <div class="place-panel">
          <dl class="place-list">
            <dd id="place-name"></dd>
            <dd id="address"></dd>
            <dd class="place-links">
              <a class="place-link" id="shop-link" href="" aria-label="ショップを見る">HP</a>
              <a id="instagram-link" href="" aria-label="Instagramを見る">
                <img src="images/Instagram_Glyph_Black.png" alt="">
              </a>
            </dd>
          </dl>

          <div class="detail-map">
            <img class="map-image" src="images/map.jpg" alt="場所周辺の地図">
            <a
              id="map-link"
              class="detail-map-pin"
              href=""
              style="--pin-x: 70%; --pin-y: 63%;"
              aria-label="Googleマップで場所を見る"
            >
              <span class="detail-map-pin-center" aria-hidden="true"></span>
            </a>
          </div>
        </div>

        <div class="introducer-panel">
          <p id="comment"></p>
          <p class="found-by">
            <span>Found by</span>
            <span id="member-initials"></span>
          </p>
        </div>
      </section>
    </article>
  </main>

  <footer class="footer">
    <nav class="footer-menu" aria-label="フッターメニュー">
      <a class="footer-brand" href="index.html">Finterior</a>
      <div class="footer-links">
        <a href="index.html">TOP</a>
        <a href="index.html#about-title">ABOUT</a>
        <a href="index.html#collection-title">COLLECTION</a>
      </div>
    </nav>
    <a>group F</a>
  </footer>
`;

const transitionScript = document.createElement("script");
transitionScript.src = "page-transition.js";
transitionScript.onload = () => {
  const collectionScript = document.createElement("script");
  collectionScript.src = "collection.js";
  document.body.append(collectionScript);
};
document.body.append(transitionScript);
