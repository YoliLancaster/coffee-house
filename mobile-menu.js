const mobileMenu = document.querySelector(".mobile-menu");
const menuBtnOpen = document.querySelector(".menu-btn-open");
const menuBtnClose = document.querySelector(".menu-btn-close");
const burgerButton = document.querySelector(".button__burger-menu");

const toggleMenu = () => {
  mobileMenu.classList.toggle("is-open");
  const isMenuOpen = mobileMenu.classList.contains("is-open");

  if (isMenuOpen) {
    document.body.classList.add("no-scroll");
  } else {
    document.body.classList.remove("no-scroll");
  }

  burgerButton.classList.toggle("button__burger-menu--close");
};

menuBtnOpen.addEventListener("click", toggleMenu);
menuBtnClose.addEventListener("click", toggleMenu);
burgerButton.addEventListener("click", toggleMenu);

document.addEventListener("DOMContentLoaded", function () {
  const menuItems = document.querySelectorAll(".mobile-menu__item");

  menuItems.forEach((menuItem) => {
    menuItem.addEventListener("click", toggleMenu);
    menuBtnClose.addEventListener("click", toggleMenu);
  });
});

