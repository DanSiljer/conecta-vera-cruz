(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-main-nav]');

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  menuButton?.addEventListener('click', () => {
    const open = menu?.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(Boolean(open)));
  });

  menu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      menuButton?.setAttribute('aria-expanded', 'false');
    });
  });

  document.querySelectorAll('[data-current-year]').forEach(el => {
    el.textContent = String(new Date().getFullYear());
  });

  const slides = [...document.querySelectorAll('[data-slide]')];
  const dots = [...document.querySelectorAll('[data-slide-dot]')];
  let current = 0;
  let timer;

  function showSlide(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
      dot.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
  }

  function startSlider() {
    window.clearInterval(timer);
    if (slides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timer = window.setInterval(() => showSlide(current + 1), 6500);
    }
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startSlider();
    });
  });
  showSlide(0);
  startSlider();

  const search = document.querySelector('[data-community-search]');
  const cards = [...document.querySelectorAll('[data-community-card]')];
  const noResults = document.querySelector('[data-no-results]');

  search?.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase('pt-BR');
    let visible = 0;
    cards.forEach(card => {
      const text = card.textContent.toLocaleLowerCase('pt-BR');
      const show = text.includes(query);
      card.hidden = !show;
      if (show) visible += 1;
    });
    noResults?.classList.toggle('is-visible', visible === 0);
  });


  const memoryForm = document.querySelector('[data-memory-form]');
  const memoryList = document.querySelector('[data-memory-list]');
  const memoryEmpty = document.querySelector('[data-memory-empty]');
  const memoryCount = document.querySelector('[data-memory-count]');
  const memoryStatus = document.querySelector('[data-memory-status]');
  const memoryStorageKey = 'conectaVeraCruzMemorias';

  function readMemories() {
    try {
      const stored = window.localStorage.getItem(memoryStorageKey);
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('Não foi possível ler as memórias salvas.', error);
      return [];
    }
  }

  function saveMemories(memories) {
    try {
      window.localStorage.setItem(memoryStorageKey, JSON.stringify(memories));
      return true;
    } catch (error) {
      console.warn('Não foi possível salvar a memória.', error);
      return false;
    }
  }

  function formatMemoryDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  }

  function renderMemories() {
    if (!memoryList) return;

    const memories = readMemories();
    memoryList.replaceChildren();

    memoryEmpty?.toggleAttribute('hidden', memories.length > 0);

    if (memoryCount) {
      memoryCount.textContent = `${memories.length} ${memories.length === 1 ? 'publicação' : 'publicações'}`;
    }

    memories.forEach(memory => {
      const card = document.createElement('article');
      card.className = 'memory-card';

      const story = document.createElement('p');
      story.textContent = memory.story;

      const footer = document.createElement('footer');
      const author = document.createElement('span');
      const authorName = document.createElement('strong');
      authorName.textContent = memory.name || 'Morador(a) de Vera Cruz';
      author.append(authorName, document.createTextNode(` · ${formatMemoryDate(memory.createdAt)}`));

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'memory-delete';
      deleteButton.textContent = 'Apagar';
      deleteButton.setAttribute('aria-label', `Apagar memória de ${memory.name || 'morador de Vera Cruz'}`);
      deleteButton.addEventListener('click', () => {
        const updated = readMemories().filter(item => item.id !== memory.id);
        saveMemories(updated);
        renderMemories();
      });

      footer.append(author, deleteButton);
      card.append(story, footer);
      memoryList.append(card);
    });
  }

  memoryForm?.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(memoryForm);
    const name = String(formData.get('name') || '').trim();
    const story = String(formData.get('story') || '').trim();
    const consent = formData.get('consent');

    if (!story || !consent) {
      if (memoryStatus) memoryStatus.textContent = 'Escreva a memória e confirme a autorização.';
      return;
    }

    const memories = readMemories();
    const id = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    memories.unshift({
      id,
      name: name || 'Morador(a) de Vera Cruz',
      story,
      createdAt: new Date().toISOString()
    });

    const saved = saveMemories(memories.slice(0, 20));
    if (!saved) {
      if (memoryStatus) memoryStatus.textContent = 'O navegador bloqueou o salvamento local.';
      return;
    }

    memoryForm.reset();
    if (memoryStatus) memoryStatus.textContent = 'Memória publicada neste navegador.';
    renderMemories();
  });

  renderMemories();

})();
