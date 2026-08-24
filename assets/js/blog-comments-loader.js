(() => {
  "use strict";

  let coreLoaded = false;
  let loadingCore = null;

  function featuredSlug() {
    const posts = Array.isArray(window.CONECTA_BLOG_POSTS)
      ? window.CONECTA_BLOG_POSTS
      : [];
    const featured = posts.find(post => post.destaque) || posts[0];
    return String(featured?.slug || "publicacao");
  }

  function prepare(section) {
    if (!(section instanceof Element)) return;
    if (!section.matches(".blog-featured-comments")) return;

    section.dataset.blogComments = "";
    section.dataset.postSlug = featuredSlug();

    if (!loadingCore) {
      loadingCore = import("./blog-comments.js?v=20260806-1")
        .then(() => {
          coreLoaded = true;
        })
        .catch(error => {
          console.error("Não foi possível carregar as mensagens compartilhadas:", error);
          const status = section.querySelector(".blog-comment-status");
          if (status) status.textContent = "Não foi possível conectar as mensagens.";
        });
      return;
    }

    if (coreLoaded) {
      const pulse = document.createElement("span");
      pulse.hidden = true;
      section.appendChild(pulse);
      pulse.remove();
    }
  }

  function scan(root = document) {
    if (root.matches?.(".blog-featured-comments")) prepare(root);
    root.querySelectorAll?.(".blog-featured-comments").forEach(prepare);
  }

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) scan(node);
      });
    });
  });

  scan();
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
