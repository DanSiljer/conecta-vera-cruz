(() => {
  "use strict";

  const root = document.querySelector("[data-article-root]");
  const posts = Array.isArray(window.CONECTA_BLOG_POSTS) ? window.CONECTA_BLOG_POSTS : [];
  const slug = new URLSearchParams(window.location.search).get("post");
  const post = posts.find((item) => item.slug === slug);

  const assetPath = (path) => {
    if (!path) return "";
    if (/^(https?:|data:|\/)/.test(path)) return path;
    return `../${path}`;
  };

  const articleUrl = (item) => `artigo.html?post=${encodeURIComponent(item.slug)}`;

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function renderBlock(block) {
    switch (block.tipo) {
      case "titulo":
        return node("h2", "article-section-title", block.texto);

      case "citacao": {
        const quote = node("blockquote", "article-quote");
        quote.appendChild(node("p", "", block.texto));
        return quote;
      }

      case "lista": {
        const list = node("ul", "article-list");
        (block.itens || []).forEach((item) => list.appendChild(node("li", "", item)));
        return list;
      }

      case "nota":
        return node("aside", "article-note", block.texto);

      case "imagem": {
        const figure = node("figure", "article-figure");
        const image = document.createElement("img");
        image.src = assetPath(block.src);
        image.alt = block.alt || "";
        image.loading = "lazy";
        figure.appendChild(image);
        if (block.legenda) figure.appendChild(node("figcaption", "", block.legenda));
        return figure;
      }

      case "galeria": {
        const gallery = node("div", "article-gallery");
        (block.imagens || []).forEach((item) => {
          const figure = node("figure");
          const image = document.createElement("img");
          image.src = assetPath(item.src);
          image.alt = item.alt || "";
          image.loading = "lazy";
          figure.appendChild(image);
          if (item.legenda) figure.appendChild(node("figcaption", "", item.legenda));
          gallery.appendChild(figure);
        });
        return gallery;
      }

      case "paragrafo":
      default:
        return node("p", "article-paragraph", block.texto || "");
    }
  }

  function renderNotFound() {
    document.title = "Notícia não encontrada | Conecta Vera Cruz";
    const section = node("section", "article-not-found");
    const container = node("div", "container");
    container.append(
      node("span", "article-kicker", "Blog Conecta Vera Cruz"),
      node("h1", "", "Notícia não encontrada"),
      node("p", "", "O endereço pode estar incorreto ou a publicação foi movida.")
    );
    const back = node("a", "article-back", "← Voltar ao blog");
    back.href = "../blog.html";
    container.appendChild(back);
    section.appendChild(container);
    root?.replaceChildren(section);
  }

  function renderArticle() {
    if (!root || !post) {
      renderNotFound();
      return;
    }

    document.title = `${post.titulo} | Conecta Vera Cruz`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = post.resumo || post.subtitulo;

    const hero = node("header", "article-hero");
    const heroContainer = node("div", "container article-hero__container");
    const breadcrumbs = node("nav", "article-breadcrumbs");
    breadcrumbs.setAttribute("aria-label", "Navegação estrutural");
    const home = node("a", "", "Início");
    home.href = "../index.html";
    const blog = node("a", "", "Blog");
    blog.href = "../blog.html";
    breadcrumbs.append(home, node("span", "", "/"), blog, node("span", "", "/"), node("span", "", post.categoria));

    const kicker = node("span", "article-kicker", post.categoria);
    const title = node("h1", "", post.titulo);
    const subtitle = node("p", "article-subtitle", post.subtitulo);
    const meta = node("div", "article-meta");
    meta.append(
      node("span", "", post.dataTexto),
      node("span", "", post.autor),
      node("span", "", post.tempoLeitura)
    );
    heroContainer.append(breadcrumbs, kicker, title, subtitle, meta);
    hero.appendChild(heroContainer);

    const imageSection = node("div", "container article-cover-wrap");
    const cover = node("figure", "article-cover");
    const image = document.createElement("img");
    image.src = assetPath(post.imagem);
    image.alt = post.imagemAlt || "";
    image.width = 1500;
    image.height = 900;
    image.fetchPriority = "high";
    cover.appendChild(image);
    imageSection.appendChild(cover);

    const bodySection = node("section", "article-body-section");
    const layout = node("div", "container article-layout");
    const article = node("article", "article-content");
    (post.conteudo || []).forEach((block) => article.appendChild(renderBlock(block)));

    const tags = node("div", "article-tags");
    (post.tags || []).forEach((tag) => tags.appendChild(node("span", "", tag)));
    article.appendChild(tags);

    const aside = node("aside", "article-sidebar");
    const share = node("section", "article-side-card");
    share.append(
      node("span", "article-kicker", "Compartilhe"),
      node("h2", "", "Ajude esta história a circular"),
      node("p", "", "Copie o endereço desta página e envie para outras pessoas.")
    );
    const copyButton = node("button", "article-copy-button", "Copiar link");
    copyButton.type = "button";
    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        copyButton.textContent = "Link copiado";
      } catch {
        copyButton.textContent = "Copie pela barra do navegador";
      }
    });
    share.appendChild(copyButton);

    const backCard = node("section", "article-side-card article-side-card--green");
    backCard.append(
      node("span", "article-kicker", "Continue lendo"),
      node("h2", "", "Mais notícias de Vera Cruz"),
      node("p", "", "Acompanhe cultura, educação, memória e acontecimentos das comunidades.")
    );
    const back = node("a", "article-side-link", "Voltar ao blog →");
    back.href = "../blog.html";
    backCard.appendChild(back);
    aside.append(share, backCard);

    layout.append(article, aside);
    bodySection.appendChild(layout);

    const relatedSection = node("section", "article-related");
    const relatedContainer = node("div", "container");
    relatedContainer.appendChild(node("h2", "", "Leia também"));
    const relatedGrid = node("div", "article-related-grid");
    posts
      .filter((item) => item.slug !== post.slug)
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .slice(0, 3)
      .forEach((item) => {
        const card = node("article", "article-related-card");
        const cardLink = node("a", "article-related-card__media");
        cardLink.href = articleUrl(item);
        const cardImage = document.createElement("img");
        cardImage.src = assetPath(item.imagem);
        cardImage.alt = item.imagemAlt || "";
        cardImage.loading = "lazy";
        cardLink.appendChild(cardImage);
        const cardBody = node("div", "article-related-card__body");
        cardBody.append(
          node("span", "", item.categoria),
          node("h3", "", item.titulo)
        );
        const read = node("a", "", "Ler notícia →");
        read.href = articleUrl(item);
        cardBody.appendChild(read);
        card.append(cardLink, cardBody);
        relatedGrid.appendChild(card);
      });
    relatedContainer.appendChild(relatedGrid);
    relatedSection.appendChild(relatedContainer);

    root.replaceChildren(hero, imageSection, bodySection, relatedSection);
  }

  renderArticle();
})();
