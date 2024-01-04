import products from "..//coffee-house/products.json" assert { type: "json" };

const menu = document.querySelector(".menu__grid");
const overlay = document.querySelector(".overlay");

let product = null;

menu.addEventListener("click", openCardhandler);
overlay.addEventListener("click", closeCardHandler);

function openCardhandler(e) {
  const clickedCardContainer = e.target.closest(".menu__card-container");

  if (!clickedCardContainer) {
    return;
  }

  const id = clickedCardContainer.parentElement.dataset.id;

  toggleCardHandler();
  product = getProductById(id);
  const markup = createMarkup(product);
  overlay.innerHTML = markup;
  const size = document.querySelector(".modal__size");
  const s = size.children[1].children[0];
  s.classList.add("modal__size-item_active");
  const button = document.querySelector(".modal__button");
  button.addEventListener("click", toggleCardHandler);
  size.children[1].addEventListener("click", changeSizeHandler);
  const additives = document.querySelector(".modal__additives");
  additives.children[1].addEventListener("click", changeAdditivesHandler);
}

function toggleCardHandler() {
  document.body.classList.toggle("hidden");
  overlay.classList.toggle("overlay__hidden");
}

function closeCardHandler(e) {
  if (e.currentTarget === e.target) {
    toggleCardHandler();
  }
}

function changeSizeHandler(e) {
  if (!e.target.closest("li")) {
    return;
  }

  const prevSize = document.querySelector(".modal__size-item_active");
  prevSize.classList.remove("modal__size-item_active");

  const nextSize = e.target.closest("li");
  nextSize.classList.add("modal__size-item_active");

  const key = nextSize.children[0].textContent;
  const price = product.price;
  const add = product.sizes[key]["add-price"];
  let result = (Number(price) + Number(add)).toFixed(2);

  const additives = Array.from(document.querySelectorAll(".modal__additives-item_active"));

  additives.forEach((additive) => {
    const label = additive.children[1].textContent;

    product.additives.forEach((item) => {
      const [name, value] = Object.values(item);
      if (name === label) {
        result = (Number(result) + Number(value)).toFixed(2);
      }
    });
  });

  const total = document.querySelector(".modal__price");
  total.textContent = `$${result}`;
}

function changeAdditivesHandler(e) {
  if (!e.target.closest("li")) {
    return;
  }
  const nextAdditive = e.target.closest("li");
  nextAdditive.classList.toggle("modal__additives-item_active");

  const size = document.querySelector(".modal__size-item_active");
  const key = size.children[0].textContent;
  const price = product.price;
  const add = product.sizes[key]["add-price"];
  let result = (Number(price) + Number(add)).toFixed(2);

  const additives = Array.from(document.querySelectorAll(".modal__additives-item_active"));
  additives.forEach((additive) => {
    const label = additive.children[1].textContent;

    product.additives.forEach((item) => {
      const [name, value] = Object.values(item);
      if (name === label) {
        result = (Number(result) + Number(value)).toFixed(2);
      }
    });
  });

  const total = document.querySelector(".modal__price");
  total.textContent = `$${result}`;
}

function getProductById(id) {
  return products.find((product) => product.id === Number(id));
}

function createMarkup(product) {
  const { name, description, price, image, sizes, additives } = product;
  return `<div class="modal">
        <div class="modal__pic">
          <img src="../coffee-house/assets/img/menu-coffee/${image}" alt="${name}">
        </div>
        <div class="modal__content">
          <div class="modal__name">
            <h3>${name}</h3>
            <p>${description}</p>
          </div>
          <div class="modal__size">
            <p>Size</p>
            <ul>
              ${Object.entries(sizes)
                .map(
                  ([key, value]) =>
                    `<li class="modal__size-item">
                       <div>${key}</div>
                       <span>${value.size}</span>
                     </li>`
                )
                .join("")}
            </ul>
          </div>
          <div class="modal__additives">
            <p>Additives</p>
            <ul>
            ${additives
              .map(
                (additive, index) =>
                  `<li class="modal__additives-item">
                    <div>${index + 1}</div>
                    <span>${additive.name}</span>
                  </li>`
              )
              .join("")}
            </ul>
          </div>
          <div class="modal__bill">
            <span class="modal__total">Total:</span>
            <span class="modal__price">$${price}</span>
          </div>
          <div class="modal__info">
            <svg width="16" height="16">
              <use href="./assets/sprite.svg#icon-info"></use>
            </svg>
            <p>
              The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.
            </p>
          </div>
          <button type="button" class="modal__button">Close</button>
        </div>
      </div>`;
}
