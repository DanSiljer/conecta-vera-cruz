/* Exibe as três publicações mais recentes na página inicial.
 * Usa os cards e estilos originais; não altera o leitor do blog.
 */
(() => {
  "use strict";

  function initHomePosts() {
    const grid = document.querySelector("[data-home-blog-posts]");
    if (!grid) return;

    const posts = Array.isArray(window.CONECTA_BLOG_POSTS)
      ? window.CONECTA_BLOG_POSTS.filter(post => post && post.slug && post.titulo)
      : [];

    posts.sort((a, b) =>
      String(b.data || "").localeCompare(String(a.data || ""))
    );

    const recent = posts.slice(0, 3);
    if (!recent.length) {
      grid.replaceChildren();
      const fallback = document.createElement("p");
      fallback.className = "home-blog-loading";
      fallback.textContent = "Confira as notícias e histórias no blog.";
      const link = document.createElement("a");
      link.href = "blog.html";
      link.textContent = " Acessar o blog";
      fallback.appendChild(link);
      grid.appendChild(fallback);
      grid.setAttribute("aria-busy", "false");
      return;
    }

    const fragment = document.createDocumentFragment();
    for (const post of recent) {
      const article = document.createElement("article");
      article.className = "home-post-card";

      const link = document.createElement("a");
      link.href = "blog.html#noticia=" + encodeURIComponent(post.slug);
      link.className = "home-post-image";
      link.setAttribute("aria-label", "Ler: " + post.titulo);

      if (post.imagem) {
        const image = document.createElement("img");
        image.src = post.imagem;
        image.alt = post.imagemAlt || post.titulo;
        image.loading = "lazy";
        image.decoding = "async";
        link.appendChild(image);
      }

      const body = document.createElement("div");
      body.className = "home-post-body";
      const category = document.createElement("span");
      category.className = "post-category";
      category.textContent = post.categoria || "Notícias";

      const title = document.createElement("h3");
      const titleLink = document.createElement("a");
      titleLink.href = link.href;
      titleLink.textContent = post.titulo;
      title.appendChild(titleLink);

      const summary = document.createElement("p");
      summary.textContent = post.resumo || post.subtitulo || "";

      body.append(category, title, summary);
      article.append(link, body);
      fragment.appendChild(article);
    }
    grid.replaceChildren(fragment);
    grid.setAttribute("aria-busy", "false");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHomePosts, { once: true });
  } else {
    initHomePosts();
  }
})();
