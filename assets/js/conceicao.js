(() => {
  'use strict';

  const navigation = document.querySelector('[data-cc-nav]');
  const links = [...document.querySelectorAll('[data-cc-nav] a')];
  const sections = [...document.querySelectorAll('[data-cc-section]')];

  const headerOffset = () => {
    const globalHeader = document.querySelector('.cv-header');
    const innerNav = document.querySelector('.cc-nav-wrap');
    return (globalHeader?.offsetHeight || 78) + (innerNav?.offsetHeight || 58) + 10;
  };

  function activateLink(sectionId) {
    let activeLink = null;

    links.forEach((link) => {
      const active = link.getAttribute('href') === `#${sectionId}`;
      link.classList.toggle('is-active', active);
      if (active) activeLink = link;
    });

    if (!activeLink || !navigation) return;

    const desiredLeft =
      activeLink.offsetLeft -
      navigation.clientWidth / 2 +
      activeLink.clientWidth / 2;

    navigation.scrollTo({
      left: Math.max(0, desiredLeft),
      behavior: 'smooth'
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length) activateLink(visible[0].target.id);
      },
      {
        rootMargin: '-30% 0px -58% 0px',
        threshold: [0.02, 0.15, 0.4]
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      event.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset();

      window.scrollTo({
        top: Math.max(0, top),
        behavior: 'smooth'
      });

      history.replaceState(null, '', link.getAttribute('href'));
    });
  });

  const dialog = document.querySelector('[data-cc-dialog]');
  const dialogImage = document.querySelector('[data-cc-dialog-image]');
  const dialogCaption = document.querySelector('[data-cc-dialog-caption]');
  const closeButton = dialog?.querySelector('.cc-lightbox__close');

  function openDialog(button) {
    if (!dialog || !dialogImage || !dialogCaption) return;

    const image = button.querySelector('img');
    dialogImage.src = button.dataset.ccLightbox || '';
    dialogImage.alt = image?.alt || '';
    dialogCaption.textContent = button.dataset.ccCaption || '';

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  function closeDialog() {
    if (!dialog) return;

    if (dialog.open && typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }

    if (dialogImage) {
      dialogImage.src = '';
      dialogImage.alt = '';
    }
    if (dialogCaption) dialogCaption.textContent = '';
  }

  document.querySelectorAll('[data-cc-lightbox]').forEach((button) => {
    button.addEventListener('click', () => openDialog(button));
  });

  closeButton?.addEventListener('click', closeDialog);

  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeDialog();
  });
})();
