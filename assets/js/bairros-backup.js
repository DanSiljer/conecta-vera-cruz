(() => {
  'use strict';

  /* Carrossel de patrimônios */
  const carousel = document.querySelector('[data-heritage-carousel]');
  const slides = [...document.querySelectorAll('[data-heritage-slide]')];
  const dots = [...document.querySelectorAll('[data-heritage-dot]')];
  const previousButton = document.querySelector('[data-heritage-previous]');
  const nextButton = document.querySelector('[data-heritage-next]');
  const pauseButton = document.querySelector('[data-heritage-pause]');
  const pauseLabel = document.querySelector('[data-pause-label]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let activeSlide = 0;
  let carouselTimer = null;
  let isPaused = reducedMotion;

  function showHeritageSlide(index) {
    if (!slides.length) return;

    activeSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeSlide;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));

      const link = slide.querySelector('a');
      if (link) link.tabIndex = isActive ? 0 : -1;
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeSlide;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-current', String(isActive));
    });
  }

  function stopCarouselTimer() {
    window.clearInterval(carouselTimer);
    carouselTimer = null;
  }

  function startCarouselTimer() {
    stopCarouselTimer();

    if (!isPaused && slides.length > 1) {
      carouselTimer = window.setInterval(() => {
        showHeritageSlide(activeSlide + 1);
      }, 7000);
    }
  }

  function updatePauseButton() {
    if (!pauseButton || !pauseLabel) return;

    pauseButton.setAttribute('aria-pressed', String(isPaused));
    pauseButton.querySelector('[aria-hidden="true"]').textContent = isPaused ? '▶' : 'Ⅱ';
    pauseLabel.textContent = isPaused ? 'Continuar' : 'Pausar';
  }

  previousButton?.addEventListener('click', () => {
    showHeritageSlide(activeSlide - 1);
    startCarouselTimer();
  });

  nextButton?.addEventListener('click', () => {
    showHeritageSlide(activeSlide + 1);
    startCarouselTimer();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showHeritageSlide(index);
      startCarouselTimer();
    });
  });

  pauseButton?.addEventListener('click', () => {
    isPaused = !isPaused;
    updatePauseButton();
    startCarouselTimer();
  });

  carousel?.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showHeritageSlide(activeSlide - 1);
      startCarouselTimer();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showHeritageSlide(activeSlide + 1);
      startCarouselTimer();
    }
  });

  carousel?.addEventListener('mouseenter', stopCarouselTimer);
  carousel?.addEventListener('mouseleave', startCarouselTimer);
  carousel?.addEventListener('focusin', stopCarouselTimer);
  carousel?.addEventListener('focusout', startCarouselTimer);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopCarouselTimer();
    else startCarouselTimer();
  });

  showHeritageSlide(0);
  updatePauseButton();
  startCarouselTimer();

  /* Pesquisa e filtros das comunidades */
  const search = document.querySelector('[data-bairro-search]');
  const filterButtons = [...document.querySelectorAll('[data-bairro-filter]')];
  const cards = [...document.querySelectorAll('[data-bairro-card]')];
  const resultCount = document.querySelector('[data-results-count]');
  const emptyState = document.querySelector('[data-bairro-empty]');
  const randomButton = document.querySelector('[data-random-community]');

  let activeFilter = 'todos';

  function normalizeText(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('pt-BR');
  }

  function updateCommunityResults() {
    const query = normalizeText(search?.value.trim());
    let visible = 0;

    cards.forEach(card => {
      const searchableText = normalizeText([
        card.dataset.name,
        card.dataset.tags,
        card.textContent
      ].join(' '));

      const matchesSearch = !query || searchableText.includes(query);
      const matchesFilter = activeFilter === 'todos' || normalizeText(card.dataset.tags).includes(activeFilter);
      const shouldShow = matchesSearch && matchesFilter;

      card.hidden = !shouldShow;
      if (shouldShow) visible += 1;
    });

    if (resultCount) {
      resultCount.textContent = visible === 1
        ? '1 comunidade encontrada'
        : `${visible} comunidades encontradas`;
    }

    if (emptyState) emptyState.hidden = visible !== 0;
  }

  search?.addEventListener('input', updateCommunityResults);

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.bairroFilter || 'todos';

      filterButtons.forEach(filterButton => {
        const isActive = filterButton === button;
        filterButton.classList.toggle('is-active', isActive);
        filterButton.setAttribute('aria-pressed', String(isActive));
      });

      updateCommunityResults();
    });
  });

  randomButton?.addEventListener('click', () => {
    const visibleCards = cards.filter(card => !card.hidden);
    const pool = visibleCards.length ? visibleCards : cards;
    const chosenCard = pool[Math.floor(Math.random() * pool.length)];

    if (chosenCard?.dataset.url) {
      randomButton.disabled = true;
      randomButton.innerHTML = '<span aria-hidden="true">✦</span> Destino escolhido!';

      window.setTimeout(() => {
        window.location.href = chosenCard.dataset.url;
      }, 450);
    }
  });

  updateCommunityResults();
})();
