document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.getElementById(".menu-item");

    menuItems.forEach(menuItem => {
        menuItem.addEventListener("click", function (event) {
            event.stopPropagation();

            // Close other open mega menus
            menuItems.forEach(item => {
                if (item !== menuItem) {
                    item.classList.remove("active");
                }
            });

            // Toggle current menu
            menuItem.classList.toggle("active");
        });
    });

    // Close all menus when clicking outside
    document.addEventListener("click", function (event) {
        menuItems.forEach(menuItem => {
            if (!menuItem.contains(event.target)) {
                menuItem.classList.remove("active");
            }
        });
    });
});
