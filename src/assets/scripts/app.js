const menuButton = document.getElementById("navigation-toggle");
menuButton.addEventListener("click", () => {
    const menu = document.getElementById("navigation-menu");
    menu.classList.toggle("visually-hidden");
});
