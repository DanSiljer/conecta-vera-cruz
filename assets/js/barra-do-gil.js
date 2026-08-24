(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = [...document.querySelectorAll('.reveal')];
  const navLinks = [...document.querySelectorAll('[data-section-nav] a')];
  const sections = [...document.querySelectorAll('[data-page-section]')];

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

    revealItems.forEach(item => revealObserver.observe(item));
  }

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`);
      });
    }, { threshold: [0.2, 0.45, 0.7], rootMargin: '-18% 0px -55%' });

    sections.forEach(section => sectionObserver.observe(section));
  }

  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImage = document.querySelector('[data-lightbox-image]');
  const lightboxCaption = document.querySelector('[data-lightbox-caption]');
  const closeButton = document.querySelector('.bdg-lightbox__close');

  document.querySelectorAll('[data-lightbox-src]').forEach(button => {
    button.addEventListener('click', () => {
      if (!lightbox || !lightboxImage) return;
      lightboxImage.src = button.dataset.lightboxSrc || '';
      lightboxImage.alt = button.querySelector('img')?.alt || 'Imagem ampliada de Barra do Gil';
      if (lightboxCaption) lightboxCaption.textContent = button.dataset.lightboxCaption || '';
      if (typeof lightbox.showModal === 'function') lightbox.showModal();
    });
  });

  function closeLightbox() {
    if (lightbox?.open) lightbox.close();
  }

  closeButton?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
})();
