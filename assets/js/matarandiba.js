(() => {
  "use strict";

  const revealElements = document.querySelectorAll(".mat-reveal");
  const sections = document.querySelectorAll("[data-page-section]");
  const navLinks = document.querySelectorAll("[data-mat-section-nav] a");
  const lightbox = document.querySelector("[data-mat-lightbox]");
  const lightboxImage = document.querySelector("[data-mat-lightbox-image]");
  const lightboxCaption = document.querySelector("[data-mat-lightbox-caption]");
  const lightboxClose = document.querySelector("[data-mat-lightbox-close]");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visibleEntries.length) return;
        const currentId = visibleEntries[0].target.id;

        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${currentId}`;
          link.classList.toggle("is-active", active);
          if (active) {
            link.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
          }
        });
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: [0.02, 0.2, 0.5] }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  document.querySelectorAll("[data-mat-lightbox-src]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!lightbox || !lightboxImage || !lightboxCaption) return;

      const source = button.dataset.matLightboxSrc;
      const caption = button.dataset.matLightboxCaption || "";
      const thumbnail = button.querySelector("img");

      lightboxImage.src = source;
      lightboxImage.alt = thumbnail?.alt || caption;
      lightboxCaption.textContent = caption;

      if (typeof lightbox.showModal === "function") lightbox.showModal();
    });
  });

  function closeLightbox() {
    if (!lightbox?.open) return;
    lightbox.close();
    lightboxImage?.removeAttribute("src");
  }

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });
})();
