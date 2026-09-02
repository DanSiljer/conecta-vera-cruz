(() => {
  "use strict";

  const POST_SLUG = "fliver-feira-literaria-vera-cruz-2026";
  const LIKE_KEY = "conecta-blog-like:" + POST_SLUG;
  const host = document.querySelector("[data-blog-featured]");

  function liked() {
    try {
      return localStorage.getItem(LIKE_KEY) === "1";
    } catch {
      return false;
    }
  }

  function saveLiked(value) {
    try {
      if (value) localStorage.setItem(LIKE_KEY, "1");
      else localStorage.removeItem(LIKE_KEY);
    } catch {
      /* Mantém a interação visual mesmo se o navegador bloquear storage. */
    }
  }

  function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function buildSocial(article) {
    const content = article.querySelector(".blog-lead-story__content");
    const read = content?.querySelector(".blog-read-link");
    if (!content || !read) return;

    // Evita duplicação quando o destaque é redesenhado pelo blog-fliver.js.
    content.querySelector(".blog-fliver-social")?.remove();

    const social = make("div", "blog-fliver-social");

    const actions = make("div", "blog-fliver-social__actions");

    const like = make("button", "blog-fliver-social__button blog-fliver-social__like");
    like.type = "button";
    const heart = make("span", "blog-fliver-social__icon");
    heart.setAttribute("aria-hidden", "true");
    const likeText = make("span", "blog-fliver-social__label");
    const likeCount = make("strong", "blog-fliver-social__count");

    function paintLike() {
      const isLiked = liked();
      like.classList.toggle("is-liked", isLiked);
      like.setAttribute("aria-pressed", String(isLiked));
      heart.textContent = isLiked ? "♥" : "♡";
      likeText.textContent = isLiked ? "Curtido" : "Curtir";
      likeCount.textContent = isLiked ? "1" : "";
      like.setAttribute("aria-label", isLiked ? "Remover curtida" : "Curtir esta reportagem");
    }

    paintLike();
    like.append(heart, likeText, likeCount);
    like.addEventListener("click", () => {
      saveLiked(!liked());
      paintLike();
    });

    const commentsButton = make(
      "button",
      "blog-fliver-social__button blog-fliver-social__comments-button"
    );
    commentsButton.type = "button";
    commentsButton.setAttribute("aria-expanded", "false");
    commentsButton.innerHTML =
      '<span class="blog-fliver-social__comment-icon" aria-hidden="true"></span><span>Comentar</span>';

    actions.append(like, commentsButton);

    const panel = make("div", "blog-fliver-social__panel");
    panel.hidden = true;

    const comments = make("section", "blog-featured-comments blog-fliver-cover-comments");
    comments.dataset.blogComments = "";
    comments.dataset.postSlug = POST_SLUG;
    comments.setAttribute("aria-label", "Comentários sobre a reportagem em destaque");
    comments.appendChild(make("p", "blog-comment-empty", "Carregando comentários..."));
    panel.appendChild(comments);

    commentsButton.addEventListener("click", () => {
      const willOpen = panel.hidden;
      panel.hidden = !willOpen;
      commentsButton.classList.toggle("is-active", willOpen);
      commentsButton.setAttribute("aria-expanded", String(willOpen));
    });

    social.append(actions, panel);

    // Coloca Curtir/Comentar ANTES do link Ler reportagem.
    content.insertBefore(social, read);
  }

  function apply() {
    if (!host) return;
    const article = host.querySelector(".blog-lead-story--fliver");
    if (!article) return;
    if (!article.querySelector(".blog-fliver-social")) buildSocial(article);
  }

  // O blog-fliver.js redesenha o destaque algumas vezes. O observer garante
  // que Curtir e Comentar permaneçam na capa após cada redesenho.
  if (host) {
    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(apply);
    });
    observer.observe(host, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      apply();
      setTimeout(apply, 80);
      setTimeout(apply, 280);
      setTimeout(apply, 700);
    }, { once: true });
  } else {
    apply();
    setTimeout(apply, 80);
    setTimeout(apply, 280);
    setTimeout(apply, 700);
  }
})();
