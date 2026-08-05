(function () {
  "use strict";

  const menuButton = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-site-nav]");
  const header = document.querySelector("[data-site-header]");

  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("is-open", !open);
      document.body.classList.toggle("menu-open", !open);
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menuButton.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
        document.body.classList.remove("menu-open");
      });
    });
  }

  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries, currentObserver) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  let previousY = window.scrollY;

  window.addEventListener(
    "scroll",
    function () {
      if (!header) return;
      const currentY = window.scrollY;

      if (currentY > 140) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }

      previousY = currentY;
    },
    { passive: true }
  );
})();
