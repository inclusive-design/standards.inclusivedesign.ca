const menuButton = document.getElementById("navigation-toggle");
menuButton.addEventListener("click", () => {
    const ariaExpanded = menuButton.ariaExpanded === "false";
    menuButton.ariaExpanded = ariaExpanded;
    const menu = document.getElementById("navigation-menu");
    menu.classList.toggle("visually-hidden");
});
