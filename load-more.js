import products from "..//coffee-house/products.json" assert { type: "json" };

const BREAKPOINT = 768;
const DEFAULT_CATEGORY = "coffee";
const PRODUCTS_PER_PAGE = 4;
const filters = document.querySelector(".menu__tabs");
const menu = document.querySelector(".menu__grid");
const loadMore = document.querySelector(".button__reload");

let cards = [];

initializeMenu();

filters.addEventListener("click", onFiltersHandler);
loadMore.addEventListener("click", onLoadMoreHandler);
window.addEventListener("resize", onResizeHandler);

function onFiltersHandler(e) {
  const clickedFilterButton = e.target.closest(".menu__tab-item");

  if (!clickedFilterButton) {
    return;
  }

  menu.innerHTML = "";

  const prevFilter = document.querySelector(".menu__tab-item.menu__filter-item_active");
  if (prevFilter) {
    prevFilter.classList.remove("menu__filter-item_active");
  }

  clickedFilterButton.classList.add("menu__filter-item_active");

  const category = clickedFilterButton.textContent.trim().toLowerCase();

  if (category !== null) {
    cards = getProducts(category);

    const markup = createMarkup(cards);
    menu.innerHTML = markup;

    onResizeHandler();
  }
}

function onLoadMoreHandler() {
  const items = Array.from(menu.children);
  items.forEach((item, index) => {
    if (index >= PRODUCTS_PER_PAGE) {
      item.classList.remove("menu__item_hidden");
    }
  });
  loadMore.classList.add("menu__refresh_hidden");
}

function onResizeHandler() {
  const items = Array.from(menu.children);
  if (window.innerWidth > BREAKPOINT) {
    items.forEach((item, index) => {
      if (index >= PRODUCTS_PER_PAGE) {
        item.classList.remove("menu__item_hidden");
      }
    });
  } else {
    items.forEach((item, index) => {
      if (index >= PRODUCTS_PER_PAGE) {
        item.classList.add("menu__item_hidden");
      }
    });
  }
  const hiddenMenu = Array.from(document.querySelectorAll(".menu__item_hidden"));
  if (window.innerWidth > BREAKPOINT || !hiddenMenu.length) {
    loadMore.classList.add("menu__refresh_hidden");
  } else {
    loadMore.classList.remove("menu__refresh_hidden");
  }
}

function getProducts(category) {
  return products.filter((product) => product.category === category);
}

function createMarkup(products) {
  return products
    .map(
      ({ id, image, name, description, price }) =>
        `<li class="menu__item" data-id="${id}">
            <div class="menu__card-container">
            <div class="menu__img-wrapper">
              <img src="../coffee-house/assets/img/menu-coffee/${image}" alt="${name}" class="menu__img" />
            </div>

            <div class="menu__card-bottom">
              <div class="menu__card-bottom--description">
                <h3 class="card-title">${name}</h3>
                <p class="card-text">
                  ${description}
                </p>
              </div>
              <div class="menu__card-bottom--price">
                <h3 class="card-title">${price}</h3>
              </div>
            </div>
          </div>
            </li>`
    )
    .join("");
}

function initializeMenu() {
  filters.children[0].classList.add("menu__filter-item_active");

  cards = getProducts(DEFAULT_CATEGORY);
  const markup = createMarkup(cards);
  menu.innerHTML = markup;

  onResizeHandler();
}
