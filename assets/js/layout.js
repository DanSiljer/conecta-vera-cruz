(() => {
  "use strict";

  const script = document.currentScript;
  if (!script) return;

  const scriptUrl = new URL(script.src, window.location.href);
  const rootUrl = new URL("../../", scriptUrl);
  const url = (path = "") => new URL(path, rootUrl).href;

  const normalizedPath = decodeURIComponent(window.location.pathname)
    .replace(/\\/g, "/")
    .toLowerCase();

  const currentSection = (() => {
    if (normalizedPath.includes("/bairros/") || normalizedPath.endsWith("/bairros.html")) return "bairros";
    if (normalizedPath.includes("/blog/") || normalizedPath.endsWith("/blog.html")) return "blog";
    if (normalizedPath.endsWith("/historia.html")) return "historia";
    if (normalizedPath.endsWith("/pousadas.html")) return "pousadas";
    if (normalizedPath.endsWith("/nossa-historia.html")) return "nossa-historia";
    if (normalizedPath.endsWith("/missao-aprender.html")) return "missao-aprender";
    return "inicio";
  })();

const links = [
  ["inicio", "Início", "index.html"],
  ["historia", "História de Vera Cruz", "historia.html"],
  ["bairros", "Bairros", "bairros.html"],
  ["missao-aprender", "Missão Aprender", "missao-aprender.html"],
  ["pousadas", "Pousadas", "pousadas.html"],
  ["blog", "Blog", "blog.html"],
  ["nossa-historia", "Nossa História", "nossa-historia.html"]
];

  const navLinks = links.map(([key, label, href]) => {
    const active = currentSection === key;
    return `<a class="cv-nav__link${active ? " is-active" : ""}"${active ? ' aria-current="page"' : ""} href="${url(href)}">${label}</a>`;
  }).join("");

  const headerTarget = document.querySelector("[data-cv-header]");
  if (headerTarget) {
    headerTarget.outerHTML = `
      <a class="cv-skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header class="cv-header" data-cv-header-ready>
        <div class="cv-header__inner">
          <a class="cv-brand" href="${url("index.html")}" aria-label="Conecta Vera Cruz, página inicial">
            <img src="${url("assets/img/logo-conecta-vera-cruz.webp")}" alt="Conecta Vera Cruz" width="900" height="393">
          </a>

          <button class="cv-menu-toggle" type="button" aria-expanded="false" aria-controls="cv-menu-principal" data-cv-menu-toggle>
            <span></span><span></span><span></span>
            <span class="cv-sr-only">Abrir menu</span>
          </button>

          <nav class="cv-nav" id="cv-menu-principal" aria-label="Menu principal" data-cv-nav>
            ${navLinks}
          </nav>

          <a class="cv-header__cta" href="${url("bairros.html")}">Visite Vera Cruz</a>
        </div>
      </header>`;
  }

  const footerTarget = document.querySelector("[data-cv-footer]");
  if (footerTarget) {
    footerTarget.outerHTML = `
      <footer class="cv-footer">
        <div class="cv-footer__inner">
          <div class="cv-footer__grid">
            <div class="cv-footer__brand">
              <a href="${url("index.html")}" aria-label="Conecta Vera Cruz, página inicial">
                <img src="${url("assets/img/logo-rodape.png")}" alt="Conecta Vera Cruz" width="1800" height="786" loading="lazy">
              </a>
              <p>Um projeto educativo que conecta história, cultura, natureza, turismo e memórias das comunidades de Vera Cruz.</p>
              <span class="cv-footer__tagline">Nossa História na Palma da Mão</span>
            </div>

            <nav class="cv-footer__column" aria-label="Páginas principais">
              <h2>Navegue</h2>
              ${links.map(([, label, href]) => `<a href="${url(href)}">${label}</a>`).join("")}
            </nav>

            <nav class="cv-footer__column" aria-label="Comunidades de Vera Cruz">
              <h2>Comunidades</h2>
              <a href="${url("bairros/jiribatuba/")}">Jiribatuba</a>
              <a href="${url("bairros/cacha-pregos/")}">Cacha-Pregos</a>
              <a href="${url("bairros/gamboa/")}">Gamboa</a>
              <a href="${url("bairros/baiacu/")}">Baiacu</a>
              <a href="${url("bairros/mar-grande/")}">Mar Grande</a>
              <a href="${url("bairros/matarandiba/")}">Matarandiba</a>
              <a href="${url("bairros/catu/")}">Catu</a>
              <a href="${url("bairros/penha/")}">Penha</a>
            </nav>

            <div class="cv-footer__column">
              <h2>Participe</h2>
              <p>Conheça o projeto, compartilhe memórias e ajude a valorizar as histórias do município.</p>
              <a class="cv-footer__button" href="${url("nossa-historia.html")}">Conheça o projeto</a>
            </div>
          </div>

          <div class="cv-footer__bottom">
            <span>© <span data-cv-year></span> Conecta Vera Cruz</span>
            <span>Escaneie. Conheça. Valorize. Preserve Vera Cruz.</span>
          </div>
        </div>
      </footer>`;
  }

  document.querySelectorAll("[data-cv-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const header = document.querySelector("[data-cv-header-ready]");
  const toggle = document.querySelector("[data-cv-menu-toggle]");
  const nav = document.querySelector("[data-cv-nav]");

  const closeMenu = () => {
    if (!toggle || !nav) return;
    toggle.classList.remove("is-open");
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("is-open")) return;
      if (!event.target.closest(".cv-header")) closeMenu();
    });
  }

  const updateHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 16);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (currentSection === "blog") {
    import(url("assets/js/blog-comments-loader.js?v=20260806-1")).catch((error) => {
      console.error("Não foi possível iniciar as mensagens do blog:", error);
    });
  }
})();
