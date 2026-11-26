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
    if (normalizedPath.endsWith("/esportes.html")) return "esportes";
    if (normalizedPath.endsWith("/meio-amb.html") || normalizedPath.endsWith("/meio-ambiente.html")) return "meio-amb";
    if (normalizedPath.endsWith("/turismo.html")) return "turismo";
    if (normalizedPath.endsWith("/missao-aprender.html")) return "missao-aprender";
    if (normalizedPath.endsWith("/o-projeto.html") || normalizedPath.endsWith("/nossa-historia.html")) return "o-projeto";
    if (normalizedPath.endsWith("/rematricula-escolar.html")) return "rematricula";
    if (normalizedPath.endsWith("/direcao-rematriculas.html")) return "direcao";

    return "inicio";
  })();

  const links = [
    ["inicio", "Início", "index.html"],
    ["historia", "História", "historia.html"],
    ["bairros", "Bairros", "bairros.html"],
    ["esportes", "Esportes", "esportes.html"],
    ["meio-amb", "Meio Amb", "meio-amb.html"],
    ["blog", "Blog", "blog.html"],
    ["turismo", "Turismo", "turismo.html"],
    ["missao-aprender", "Missão Aprender", "missao-aprender.html"],
    ["o-projeto", "O Projeto", "o-projeto.html"]
  ];

  const navLinks = links.map(([key, label, href]) => {
    const active = currentSection === key;
    return `<a class="cv-nav__link${active ? " is-active" : ""}"${active ? ' aria-current="page"' : ""} href="${url(href)}">${label}</a>`;
  }).join("");

  const schoolLinks = `
    <a class="cv-nav__link cv-nav__link--enroll-mobile" href="${url("rematricula-escolar.html")}">Rematrícula 2027"</a>`;

  const schoolStyle = document.createElement("style");
  schoolStyle.id = "cv-school-header-styles";
  schoolStyle.textContent = `
    .cv-nav__link--enroll-mobile { display:none !important; }
    .cv-nav__link--direction { font-size:12px; white-space:nowrap; text-decoration:none; }
    .cv-header__cta--school { white-space:nowrap; flex-shrink:0; }
    .cv-header__inner { gap: clamp(8px, 1.2vw, 20px); }
    .cv-nav { gap: clamp(5px, .8vw, 16px); }
    .cv-nav__link { white-space: nowrap; }
    @media (min-width: 1351px) {
      .cv-header__inner { grid-template-columns: 156px minmax(0, 1fr) auto; width: min(1480px, calc(100% - 28px)); }
      .cv-brand { width: 150px; }
      .cv-nav { gap: 2px; flex-wrap:wrap; }
      .cv-nav__link { font-size: 12px; padding-inline: 7px; }
      .cv-header__cta--school { font-size: 12px; padding-inline: 13px; }
      .cv-brand { flex-shrink:1; min-width: 140px; }
    }
    @media (max-width:1350px) {
      .cv-header { position:relative; }
      .cv-header__inner { position:relative; }
      .cv-menu-toggle { display:flex !important; flex-shrink:0; order:3; }
      .cv-nav {
        position:absolute !important; left:12px !important; right:12px !important;
        top:calc(100% - 1px) !important; width:auto !important;
        max-height:min(75vh,650px); overflow-y:auto;
        padding:14px !important; border-radius:0 0 16px 16px;
        background:#fff !important; box-shadow:0 18px 35px #082b2b25;
        display:none !important; flex-direction:column !important;
        align-items:stretch !important; gap:2px !important;
        z-index:10000 !important;
      }
      .cv-nav.is-open { display:flex !important; }
      .cv-nav__link { display:flex !important; font-size:14px !important; padding:11px 14px !important; }
      .cv-nav__link--enroll-mobile { display:flex !important; }
      .cv-header__cta--school { margin-left:auto; order:2; }
      .cv-brand { order:1; }
    }
    @media (max-width:600px) {
      .cv-header__cta--school { display:none !important; }
      .cv-menu-toggle { margin-left:auto; }
      .cv-brand { max-width:65%; }
    }
  `;
  if (!document.getElementById(schoolStyle.id)) document.head.appendChild(schoolStyle);

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
            ${schoolLinks}
          </nav>

          <a class="cv-header__cta cv-header__cta--school" href="${url("rematricula-escolar.html")}">Rematrícula 2027</a>
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
            <a class="cv-footer__study" href="${url("aprenda-ae/")}">Aprenda Aê</a>
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

  const ensureSchoolMenu = () => {
    const h = document.querySelector("[data-cv-header-ready]");
    if (!h) return;
    const cta = h.querySelector(".cv-header__cta");
    if (cta) {
      cta.textContent = "Rematrícula 2027";
      cta.href = url("rematricula-escolar.html");
      cta.classList.add("cv-header__cta--school");
    }
    const menu = h.querySelector("[data-cv-nav]");
    if (!menu) return;
    h.querySelectorAll("a").forEach((link) => {
      if (link.textContent.trim().replace(/\s+/g, " ").toLocaleLowerCase("pt-BR") === "visite vera cruz") {
        link.remove();
      }
    });
    const ensureLink = (href, label, className) => {
      const target = url(href);
      let a = [...menu.querySelectorAll("a")].find(el => el.href === target);
      if (!a) {
        a = document.createElement("a");
        menu.appendChild(a);
      }
      a.className = className;
      a.href = target;
      a.textContent = label;
    };
    ensureLink("rematricula-escolar.html", "Rematrícula 2027", "cv-nav__link cv-nav__link--enroll-mobile");
    
  };
  ensureSchoolMenu();
  window.addEventListener("pageshow", ensureSchoolMenu);

  if (currentSection === "blog") {
    import(url("assets/js/blog-comments-loader.js?v=20260806-1")).catch((error) => {
      console.error("Não foi possível iniciar as mensagens do blog:", error);
    });
  }
})();