(() => {
  'use strict';

  const carousel = document.querySelector('[data-bairros-carousel]');
  const slides = [...document.querySelectorAll('[data-bairros-slide]')];
  const dots = [...document.querySelectorAll('[data-bairros-dot]')];
  const previousButton = document.querySelector('[data-bairros-prev]');
  const nextButton = document.querySelector('[data-bairros-next]');
  const pauseButton = document.querySelector('[data-bairros-pause]');
  const pauseText = document.querySelector('[data-pause-text]');
  const pauseIcon = document.querySelector('[data-pause-icon]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let activeIndex = 0;
  let isPaused = reduceMotion;
  let timer = null;
  let touchStartX = 0;

  function normalizeIndex(index) {
    if (!slides.length) return 0;
    return (index + slides.length) % slides.length;
  }

  function showSlide(index) {
    if (!slides.length) return;

    activeIndex = normalizeIndex(index);

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-current', String(isActive));
    });
  }

  function stopTimer() {
    window.clearInterval(timer);
    timer = null;
  }

  function startTimer() {
    stopTimer();

    if (!isPaused && slides.length > 1 && !document.hidden) {
      timer = window.setInterval(() => {
        showSlide(activeIndex + 1);
      }, 6500);
    }
  }

  function restartTimer() {
    startTimer();
  }

  function updatePauseButton() {
    if (!pauseButton) return;

    pauseButton.setAttribute('aria-pressed', String(isPaused));
    if (pauseText) pauseText.textContent = isPaused ? 'Continuar' : 'Pausar';
    if (pauseIcon) pauseIcon.textContent = isPaused ? '▶' : 'Ⅱ';
  }

  previousButton?.addEventListener('click', () => {
    showSlide(activeIndex - 1);
    restartTimer();
  });

  nextButton?.addEventListener('click', () => {
    showSlide(activeIndex + 1);
    restartTimer();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      restartTimer();
    });
  });

  pauseButton?.addEventListener('click', () => {
    isPaused = !isPaused;
    updatePauseButton();
    startTimer();
  });

  carousel?.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showSlide(activeIndex - 1);
      restartTimer();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(activeIndex + 1);
      restartTimer();
    }
  });

  carousel?.addEventListener('touchstart', event => {
    touchStartX = event.changedTouches[0]?.clientX || 0;
  }, { passive: true });

  carousel?.addEventListener('touchend', event => {
    const touchEndX = event.changedTouches[0]?.clientX || 0;
    const distance = touchEndX - touchStartX;

    if (Math.abs(distance) < 55) return;

    showSlide(distance > 0 ? activeIndex - 1 : activeIndex + 1);
    restartTimer();
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopTimer();
    else startTimer();
  });

  document.querySelectorAll('.bairros-hero__slide > img').forEach(image => {
    image.addEventListener('error', () => {
      image.hidden = true;
      image.closest('.bairros-hero__slide')?.classList.add('is-image-missing');
    });
  });

  document.querySelectorAll('.bairro-card__media img').forEach(image => {
    image.addEventListener('error', () => {
      image.hidden = true;
      image.closest('.bairro-card__media')?.classList.add('is-image-missing');
    });
  });

  showSlide(0);
  updatePauseButton();
  startTimer();
})();
