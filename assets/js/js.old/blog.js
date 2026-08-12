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
    categoryTotal: document.querySelector("[data-category-total]"),
    reader: document.querySelector("[data-blog-reader]"),
    readerContent: document.querySelector("[data-blog-reader-content]")
  };

  const PAGE_SIZE = 6;
  let activeCategory = "todas";
  let activeYear = "todos";
  let visibleLimit = PAGE_SIZE;
  let openPostSlug = null;

  const normalize = (value) => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");

  const sortedPosts = allPosts.sort((a, b) =>
    new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  function createElement(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function postHash(post) {
    return `#noticia=${encodeURIComponent(post.slug)}`;
  }

  function postFromHash() {
    const match = window.location.hash.match(/^#noticia=(.+)$/);
    if (!match) return null;
    try {
      return sortedPosts.find((post) => post.slug === decodeURIComponent(match[1])) || null;
    } catch {
      return null;
    }
  }

  function attachOpenHandler(link, post) {
    link.href = postHash(post);
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openPost(post, true);
    });
  }

  function renderHero() {
    if (!elements.hero || sortedPosts.length === 0) return;
    const post = sortedPosts.find((item) => item.destaque) || sortedPosts[0];

    const article = createElement("article", "blog-lead-story");
    const mediaLink = createElement("a", "blog-lead-story__media");
    attachOpenHandler(mediaLink, post);

    const image = document.createElement("img");
    image.src = post.imagem;
    image.alt = post.imagemAlt || "";
    image.width = 1200;
    image.height = 720;
    image.fetchPriority = "high";
    image.addEventListener("error", () => {
      image.classList.add("is-broken");
      mediaLink.classList.add("has-broken-image");
    });
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
    attachOpenHandler(titleLink, post);
    title.appendChild(titleLink);

    const summary = createElement("p", "", post.subtitulo || post.resumo);
    const read = createElement("a", "blog-read-link", "Ler reportagem nesta página");
    attachOpenHandler(read, post);
    read.appendChild(createElement("span", "", "↓"));

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
      document.querySelector("#ultimas-noticias")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
          document.querySelector("#ultimas-noticias")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      const contentText = (post.conteudo || [])
        .flatMap((block) => [block.texto, ...(block.itens || [])])
        .join(" ");
      const searchable = normalize([
        post.titulo,
        post.subtitulo,
        post.resumo,
        post.categoria,
        contentText,
        ...(post.tags || [])
      ].join(" "));
      const searchMatch = !query || searchable.includes(query);
      return categoryMatch && yearMatch && searchMatch;
    });
  }

  function createPostCard(post, index) {
    const article = createElement("article", "blog-post-card");
    if (index === 0) article.classList.add("blog-post-card--featured");

    const media = createElement("a", "blog-post-card__media");
    attachOpenHandler(media, post);

    const image = document.createElement("img");
    image.src = post.imagem;
    image.alt = post.imagemAlt || "";
    image.loading = "lazy";
    image.width = 900;
    image.height = 600;
    image.addEventListener("error", () => media.classList.add("has-broken-image"));
    media.appendChild(image);

    const content = createElement("div", "blog-post-card__content");
    const top = createElement("div", "blog-post-card__top");
    top.append(
      createElement("span", "blog-post-card__category", post.categoria),
      createElement("time", "", post.dataTexto)
    );

    const title = createElement("h3");
    const titleLink = createElement("a", "", post.titulo);
    attachOpenHandler(titleLink, post);
    title.appendChild(titleLink);

    const summary = createElement("p", "", post.resumo);
    const footer = createElement("div", "blog-post-card__footer");
    footer.append(
      createElement("span", "", post.autor),
      createElement("span", "", post.tempoLeitura)
    );

    const read = createElement("a", "blog-post-card__read", "Ler notícia aqui ↓");
    attachOpenHandler(read, post);

    content.append(top, title, summary, footer, read);
    article.append(media, content);
    return article;
  }

  function renderBlock(block) {
    switch (block.tipo) {
      case "titulo":
        return createElement("h3", "inline-article__section-title", block.texto);

      case "citacao": {
        const quote = createElement("blockquote", "inline-article__quote");
        quote.appendChild(createElement("p", "", block.texto));
        return quote;
      }

      case "lista": {
        const list = createElement("ul", "inline-article__list");
        (block.itens || []).forEach((item) => list.appendChild(createElement("li", "", item)));
        return list;
      }

      case "nota":
        return createElement("aside", "inline-article__note", block.texto);

      case "imagem": {
        const figure = createElement("figure", "inline-article__figure");
        const image = document.createElement("img");
        image.src = block.src;
        image.alt = block.alt || "";
        image.loading = "lazy";
        figure.appendChild(image);
        if (block.legenda) figure.appendChild(createElement("figcaption", "", block.legenda));
        return figure;
      }

      case "galeria": {
        const gallery = createElement("div", "inline-article__gallery");
        (block.imagens || []).forEach((item) => {
          const figure = createElement("figure");
          const image = document.createElement("img");
          image.src = item.src;
          image.alt = item.alt || "";
          image.loading = "lazy";
          figure.appendChild(image);
          if (item.legenda) figure.appendChild(createElement("figcaption", "", item.legenda));
          gallery.appendChild(figure);
        });
        return gallery;
      }

      case "paragrafo":
      default:
        return createElement("p", "inline-article__paragraph", block.texto || "");
    }
  }

  function closePost(updateHistory = true) {
    if (!elements.reader || !elements.readerContent) return;
    elements.reader.hidden = true;
    elements.readerContent.replaceChildren();
    openPostSlug = null;
    document.body.classList.remove("is-reading-blog-post");

    if (updateHistory && window.location.hash.startsWith("#noticia=")) {
      history.pushState({}, "", `${window.location.pathname}${window.location.search}`);
    }
  }

  function openPost(post, updateHistory = false, shouldScroll = true) {
    if (!post || !elements.reader || !elements.readerContent) return;

    const wrapper = createElement("div", "inline-article");
    const toolbar = createElement("div", "inline-article__toolbar");
    const close = createElement("button", "inline-article__close", "← Voltar às notícias");
    close.type = "button";
    close.addEventListener("click", () => {
      closePost(true);
      document.querySelector("#ultimas-noticias")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    const share = createElement("button", "inline-article__share", "Copiar link");
    share.type = "button";
    share.addEventListener("click", async () => {
      const url = `${window.location.origin}${window.location.pathname}${postHash(post)}`;
      try {
        await navigator.clipboard.writeText(url);
        share.textContent = "Link copiado";
      } catch {
        share.textContent = "Use o endereço do navegador";
      }
    });
    toolbar.append(close, share);

    const header = createElement("header", "inline-article__header");
    header.appendChild(createElement("span", "inline-article__category", post.categoria));
    const title = createElement("h2", "", post.titulo);
    title.id = "blog-reader-title";
    header.appendChild(title);
    header.appendChild(createElement("p", "inline-article__subtitle", post.subtitulo || post.resumo));
    const meta = createElement("div", "inline-article__meta");
    meta.append(
      createElement("span", "", post.dataTexto),
      createElement("span", "", post.autor),
      createElement("span", "", post.tempoLeitura)
    );
    header.appendChild(meta);

    const cover = createElement("figure", "inline-article__cover");
    const coverImage = document.createElement("img");
    coverImage.src = post.imagem;
    coverImage.alt = post.imagemAlt || "";
    coverImage.width = 1500;
    coverImage.height = 900;
    coverImage.fetchPriority = "high";
    cover.appendChild(coverImage);

    const layout = createElement("div", "inline-article__layout");
    const body = createElement("div", "inline-article__body");
    (post.conteudo || []).forEach((block) => body.appendChild(renderBlock(block)));

    const tags = createElement("div", "inline-article__tags");
    (post.tags || []).forEach((tag) => tags.appendChild(createElement("span", "", tag)));
    body.appendChild(tags);

    const aside = createElement("aside", "inline-article__aside");
    aside.append(
      createElement("span", "blog-eyebrow", "Nesta página"),
      createElement("h3", "", "A notícia completa fica aqui"),
      createElement("p", "", "Você continua no Blog Conecta Vera Cruz. Feche a reportagem para voltar à lista de publicações.")
    );
    const asideClose = createElement("button", "inline-article__aside-button", "Voltar às notícias");
    asideClose.type = "button";
    asideClose.addEventListener("click", () => {
      closePost(true);
      document.querySelector("#ultimas-noticias")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    aside.appendChild(asideClose);

    layout.append(body, aside);
    wrapper.append(toolbar, header, cover, layout);
    elements.readerContent.replaceChildren(wrapper);
    elements.reader.hidden = false;
    openPostSlug = post.slug;
    document.body.classList.add("is-reading-blog-post");

    if (updateHistory) {
      history.pushState({ post: post.slug }, "", postHash(post));
    }

    if (shouldScroll) {
      elements.reader.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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

  window.addEventListener("popstate", () => {
    const post = postFromHash();
    if (post) {
      openPost(post, false, true);
    } else {
      closePost(false);
    }
  });

  renderHero();
  renderControls();
  renderPosts();

  const initialPost = postFromHash();
  if (initialPost) {
    window.requestAnimationFrame(() => openPost(initialPost, false, false));
  }
})();
