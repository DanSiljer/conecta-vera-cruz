document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {
  const reveals = [...document.querySelectorAll('.reveal')];
  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 })
    : null;

  reveals.forEach((node) => {
    if (observer) observer.observe(node);
    else node.classList.add('is-visible');
  });

  const navLinks = [...document.querySelectorAll('[data-section-nav] a')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + visible.target.id);
      });
    }, { rootMargin: '-32% 0px -58% 0px', threshold: [0, .1, .3, .6] });
    sections.forEach((section) => navObserver.observe(section));
  }

  const dialog = document.querySelector('[data-lightbox]');
  const dialogImage = dialog && dialog.querySelector('[data-lightbox-image]');
  const dialogCaption = dialog && dialog.querySelector('[data-lightbox-caption]');
  const close = dialog && dialog.querySelector('.lightbox-close');

  document.querySelectorAll('[data-lightbox-src]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!dialog || !dialogImage) return;
      dialogImage.src = button.dataset.lightboxSrc || '';
      dialogImage.alt = button.querySelector('img')?.alt || '';
      if (dialogCaption) dialogCaption.textContent = button.dataset.lightboxCaption || '';
      if (typeof dialog.showModal === 'function') dialog.showModal();
    });
  });

  if (close) close.addEventListener('click', () => dialog.close());
  if (dialog) {
    dialog.addEventListener('click', (event) => {
      const rect = dialog.getBoundingClientRect();
      const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
      if (outside) dialog.close();
    });
  }
});
