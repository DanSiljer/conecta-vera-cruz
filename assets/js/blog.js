(() => {
  "use strict";

  const allPosts = Array.isArray(window.CONECTA_BLOG_POSTS)
    ? [...window.CONECTA_BLOG_POSTS]
    : [];

  const elements = {
    hero: document.querySelector("[data-blog-hero]"),
    grid: document.querySelector("[data-blog-grid]"),
    categories: document.querySelector("[data-blog-categories]"),
    sidebarCategories: document.querySelector("[data-sidebar-categories]"),
    archive: document.querySelector("[data-blog-archive]"),
    search: document.querySelector("[data-blog-search]"),
    results: document.querySelector("[data-blog-results]"),
    empty: document.querySelector("[data-blog-empty]"),
    loadMore: document.querySelector("[data-blog-load-more]"),
    categoryTotal: document.querySelector("[data-category-total]")
  };

  const PAGE_SIZE = 6;
  let activeCategory = "todas";
  let activeYear = "todos";
  let visibleLimit = PAGE_SIZE;

  const normalize = (value) => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");

  const sortedPosts = allPosts.sort((a, b) =>
    new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  const articleUrl = (post) => `blog/artigo.html?post=${encodeURIComponent(post.slug)}`;

  function createElement(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function renderHero() {
    if (!elements.hero || sortedPosts.length === 0) return;
    const post = sortedPosts.find((item) => item.destaque) || sortedPosts[0];
    const link = articleUrl(post);

    const article = createElement("article", "blog-lead-story");
    const mediaLink = createElement("a", "blog-lead-story__media");
    mediaLink.href = link;

    const image = document.createElement("img");
    image.src = post.imagem;
    image.alt = post.imagemAlt || "";
    image.width = 1200;
    image.height = 720;
    image.fetchPriority = "high";
    mediaLink.appendChild(image);

    const category = createElement("span", "blog-lead-story__category", post.categoria);
    mediaLink.appendChild(category);

    const content = createElement("div", "blog-lead-story__content");
    const meta = createElement("div", "blog-meta");
    meta.append(
      createElement("span", "", post.dataTexto),
      createElement("span", "", post.tempoLeitura)
    );

    const title = createElement("h2");
    const titleLink = createElement("a", "", post.titulo);
    titleLink.href = link;
    title.appendChild(titleLink);

    const summary = createElement("p", "", post.subtitulo || post.resumo);
    const read = createElement("a", "blog-read-link", "Ler reportagem");
    read.href = link;
    read.appendChild(createElement("span", "", "→"));

    content.append(meta, title, summary, read);
    article.append(mediaLink, content);
    elements.hero.replaceChildren(article);
  }

  function getCategoryCounts() {
    return sortedPosts.reduce((counts, post) => {
      const slug = post.categoriaSlug || "outros";
      const label = post.categoria || "Outros";
      if (!counts[slug]) counts[slug] = { label, total: 0 };
      counts[slug].total += 1;
      return counts;
    }, {});
  }

  function categoryButton(slug, label, total, sidebar = false) {
    const button = createElement("button", sidebar ? "sidebar-category" : "blog-category-chip");
    button.type = "button";
    button.dataset.category = slug;
    button.setAttribute("aria-pressed", String(activeCategory === slug));

    const text = createElement("span", "", label);
    const count = createElement("small", "", String(total));
    button.append(text, count);

    if (activeCategory === slug) button.classList.add("is-active");
    button.addEventListener("click", () => {
      activeCategory = slug;
      activeYear = "todos";
      visibleLimit = PAGE_SIZE;
      renderControls();
      renderPosts();
    });
    return button;
  }

  function renderControls() {
    const counts = getCategoryCounts();
    const entries = Object.entries(counts).sort((a, b) =>
      a[1].label.localeCompare(b[1].label, "pt-BR")
    );

    if (elements.categories) {
      elements.categories.replaceChildren(
        categoryButton("todas", "Todas", sortedPosts.length),
        ...entries.map(([slug, data]) => categoryButton(slug, data.label, data.total))
      );
    }

    if (elements.sidebarCategories) {
      elements.sidebarCategories.replaceChildren(
        categoryButton("todas", "Todas as publicações", sortedPosts.length, true),
        ...entries.map(([slug, data]) => categoryButton(slug, data.label, data.total, true))
      );
    }

    if (elements.categoryTotal) {
      elements.categoryTotal.textContent = `${entries.length} temas`;
    }

    renderArchive();
  }

  function renderArchive() {
    if (!elements.archive) return;
    const years = sortedPosts.reduce((map, post) => {
      const year = String(post.data).slice(0, 4);
      map[year] = (map[year] || 0) + 1;
      return map;
    }, {});

    const buttons = Object.entries(years)
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      .map(([year, total]) => {
        const button = createElement("button", "sidebar-archive");
        button.type = "button";
        button.classList.toggle("is-active", activeYear === year);
        button.append(
          createElement("span", "", year),
          createElement("small", "", `${total} publicações`)
        );
        button.addEventListener("click", () => {
          activeYear = activeYear === year ? "todos" : year;
          activeCategory = "todas";
          visibleLimit = PAGE_SIZE;
          renderControls();
          renderPosts();
        });
        return button;
      });

    elements.archive.replaceChildren(...buttons);
  }

  function filteredPosts() {
    const query = normalize(elements.search?.value.trim());
    return sortedPosts.filter((post) => {
      const categoryMatch = activeCategory === "todas" || post.categoriaSlug === activeCategory;
      const yearMatch = activeYear === "todos" || String(post.data).startsWith(activeYear);
      const searchable = normalize([
        post.titulo,
        post.subtitulo,
        post.resumo,
        post.categoria,
        ...(post.tags || [])
      ].join(" "));
      const searchMatch = !query || searchable.includes(query);
      return categoryMatch && yearMatch && searchMatch;
    });
  }

  function createPostCard(post, index) {
    const article = createElement("article", "blog-post-card");
    if (index === 0) article.classList.add("blog-post-card--featured");

    const link = articleUrl(post);
    const media = createElement("a", "blog-post-card__media");
    media.href = link;

    const image = document.createElement("img");
    image.src = post.imagem;
    image.alt = post.imagemAlt || "";
    image.loading = "lazy";
    image.width = 900;
    image.height = 600;
    media.appendChild(image);

    const content = createElement("div", "blog-post-card__content");
    const top = createElement("div", "blog-post-card__top");
    top.append(
      createElement("span", "blog-post-card__category", post.categoria),
      createElement("time", "", post.dataTexto)
    );

    const title = createElement("h3");
    const titleLink = createElement("a", "", post.titulo);
    titleLink.href = link;
    title.appendChild(titleLink);

    const summary = createElement("p", "", post.resumo);
    const footer = createElement("div", "blog-post-card__footer");
    footer.append(
      createElement("span", "", post.autor),
      createElement("span", "", post.tempoLeitura)
    );

    const read = createElement("a", "blog-post-card__read", "Ler notícia →");
    read.href = link;

    content.append(top, title, summary, footer, read);
    article.append(media, content);
    return article;
  }

  function renderPosts() {
    if (!elements.grid) return;
    const matches = filteredPosts();
    const shown = matches.slice(0, visibleLimit);

    elements.grid.replaceChildren(...shown.map(createPostCard));

    if (elements.results) {
      const suffix = matches.length === 1 ? "publicação" : "publicações";
      elements.results.textContent = `${matches.length} ${suffix}`;
    }

    if (elements.empty) elements.empty.hidden = matches.length !== 0;
    if (elements.loadMore) {
      elements.loadMore.hidden = shown.length >= matches.length;
    }
  }

  elements.search?.addEventListener("input", () => {
    visibleLimit = PAGE_SIZE;
    renderPosts();
  });

  elements.loadMore?.addEventListener("click", () => {
    visibleLimit += PAGE_SIZE;
    renderPosts();
  });

  renderHero();
  renderControls();
  renderPosts();
})();
