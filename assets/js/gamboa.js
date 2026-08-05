(() => {
  "use strict";

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((item) => observer.observe(item));
  } else {
    reveals.forEach((item) => item.classList.add("is-visible"));
  }

  const progress = document.querySelector("[data-reading-progress]");
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, value))}%`;
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });

  const sectionLinks = [...document.querySelectorAll("[data-section-nav] a")];
  const sections = [...document.querySelectorAll("[data-page-section]")];
  if (sectionLinks.length && sections.length && "IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      sectionLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`));
    }, { rootMargin: "-28% 0px -58% 0px", threshold: [0.05, 0.2, 0.4] });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const dialog = document.querySelector("[data-lightbox]");
  const dialogImage = dialog?.querySelector("[data-lightbox-image]");
  const dialogCaption = dialog?.querySelector("[data-lightbox-caption]");
  const closeButton = dialog?.querySelector(".lightbox-close");

  document.querySelectorAll("[data-lightbox-src]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!dialog || !dialogImage || !dialogCaption) return;
      dialogImage.src = button.dataset.lightboxSrc || "";
      dialogImage.alt = button.querySelector("img")?.alt || "Fotografia ampliada da Gamboa";
      dialogCaption.textContent = button.dataset.lightboxCaption || "";
      if (typeof dialog.showModal === "function") dialog.showModal();
    });
  });
  closeButton?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (event) => {
    const box = dialog.getBoundingClientRect();
    const inside = event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
    if (!inside) dialog.close();
  });

  // Fallback do menu móvel, caso a versão atual de main.js não use as mesmas classes.
  const menuButton = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-main-nav]");
  menuButton?.addEventListener("click", () => {
    const isOpen = menu?.classList.toggle("is-open") || false;
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
