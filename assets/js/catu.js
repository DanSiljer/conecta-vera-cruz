(() => {
  "use strict";

  const revealElements = document.querySelectorAll(".catu-reveal");
  const sections = document.querySelectorAll("[data-catu-section]");
  const links = document.querySelectorAll("[data-catu-nav] a");
  const navigation = document.querySelector("[data-catu-nav]");

  function revealEverything() {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.06,
        rootMargin: "0px 0px -6% 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => {
            return second.intersectionRatio - first.intersectionRatio;
          })[0];

        if (!activeEntry) return;

        links.forEach((link) => {
          const active =
            link.getAttribute("href") === `#${activeEntry.target.id}`;

          link.classList.toggle("is-active", active);

          /*
           * Importante:
           * não usar link.scrollIntoView(), pois esse comando pode mover
           * a página verticalmente e criar a sensação de rolagem travada.
           * Aqui movimentamos somente a barra horizontal do menu interno.
           */
          if (active && navigation) {
            const desiredLeft =
              link.offsetLeft -
              navigation.clientWidth / 2 +
              link.clientWidth / 2;

            navigation.scrollTo({
              left: Math.max(0, desiredLeft),
              behavior: "smooth"
            });
          }
        });
      },
      {
        threshold: [0.02, 0.18, 0.45],
        rootMargin: "-25% 0px -60% 0px"
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  } else {
    revealEverything();
  }

  const dialog = document.querySelector("[data-catu-lightbox]");
  const image = document.querySelector("[data-catu-lightbox-image]");
  const caption = document.querySelector("[data-catu-lightbox-caption]");
  const closeButton = document.querySelector("[data-catu-lightbox-close]");

  document
    .querySelectorAll("[data-catu-lightbox-src]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        if (!dialog || !image) return;

        image.src = button.dataset.catuLightboxSrc || "";
        image.alt = button.querySelector("img")?.alt || "";

        if (caption) {
          caption.textContent =
            button.dataset.catuLightboxCaption || "";
        }

        if (typeof dialog.showModal === "function") {
          dialog.showModal();
        } else {
          dialog.setAttribute("open", "");
        }
      });
    });

  function closeLightbox() {
    if (!dialog) return;

    if (dialog.open && typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }

    image?.removeAttribute("src");
  }

  closeButton?.addEventListener("click", closeLightbox);

  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
})();
