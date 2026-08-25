(function () {
  "use strict";

const root = document.getElementById("mariaBookFlipbook");
if (!root) return;



  ...Array.from({ length: 20 }, function (_, index) {
    const number = String(index + 1).padStart(2, "0");

    return {
      src: "assets/img/livros/maria-felipa/pagina-" + number + ".webp",
      title: "Página " + (index + 1),
      alt: "Página " + (index + 1) + " do livro infantil Quem sou eu? Maria Felipa"
    };
  })
];



  const stage = document.getElementById("mariaBookStage");
  const paper = document.getElementById("mariaBookPaper");
  const image = document.getElementById("mariaBookImage");
  const title = document.getElementById("mariaBookPageTitle");
  const counter = document.getElementById("mariaBookCounter");
  const progress = document.getElementById("mariaBookProgressBar");
  const picker = document.getElementById("mariaBookPagePicker");
  const prev = document.getElementById("mariaBookPrev");
  const next = document.getElementById("mariaBookNext");
  const prevBottom = document.getElementById("mariaBookPrevBottom");
  const nextBottom = document.getElementById("mariaBookNextBottom");
  const fullscreen = document.getElementById("mariaBookFullscreen");

  let current = 0;
  let animating = false;
  let touchStartX = 0;
  let touchStartY = 0;

  pages.slice(1, 4).forEach(function (page) {
    const preload = new Image();
    preload.src = page.src;
  });

  function buildPicker() {
    pages.forEach(function (_, index) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = index === 0 ? "Capa" : String(index);
      button.setAttribute("aria-label", index === 0 ? "Ir para a capa" : "Ir para a página " + (index + 1));
      button.addEventListener("click", function () {
        goTo(index, index >= current ? "next" : "prev");
      });
      picker.appendChild(button);
    });
  }

  function updateUi() {
    const page = pages[current];
    root.dataset.bookCurrent = String(current);
    title.textContent = page.title;
    counter.textContent =
      (current === 0 ? "Capa" : "Página " + current) +
      " · " + (current + 1) + " de " + pages.length;
    progress.style.width = (((current + 1) / pages.length) * 100).toFixed(2) + "%";

    prev.disabled = current === 0;
    prevBottom.disabled = current === 0;
    next.disabled = current === pages.length - 1;
    nextBottom.disabled = current === pages.length - 1;

    picker.querySelectorAll("button").forEach(function (button, index) {
      const active = index === current;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-current", active ? "page" : "false");
      if (active) button.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
  }

  function swapPage(index) {
    current = index;
    image.src = pages[current].src;
    image.alt = pages[current].alt;
    updateUi();
  }

  function goTo(index, direction) {
    if (animating || index === current || index < 0 || index >= pages.length) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      swapPage(index);
      return;
    }
    animating = true;
    const className = direction === "prev" ? "is-turning-prev" : "is-turning-next";
    paper.classList.add(className);
    window.setTimeout(function () { swapPage(index); }, 270);
    window.setTimeout(function () {
      paper.classList.remove(className);
      animating = false;
    }, 560);
  }

  function nextPage() { goTo(current + 1, "next"); }
  function prevPage() { goTo(current - 1, "prev"); }

  prev.addEventListener("click", prevPage);
  prevBottom.addEventListener("click", prevPage);
  next.addEventListener("click", nextPage);
  nextBottom.addEventListener("click", nextPage);

  stage.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight" || event.key === "PageDown") {
      event.preventDefault();
      nextPage();
    }
    if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      prevPage();
    }
  });

  stage.addEventListener("touchstart", function (event) {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });

  stage.addEventListener("touchend", function (event) {
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) nextPage();
    else prevPage();
  }, { passive: true });

  fullscreen.addEventListener("click", async function () {
    try {
      if (!document.fullscreenElement) await root.requestFullscreen();
      else await document.exitFullscreen();
    } catch (error) {}
  });

  document.addEventListener("fullscreenchange", function () {
    fullscreen.textContent = document.fullscreenElement ? "✕" : "⛶";
    fullscreen.setAttribute("aria-label", document.fullscreenElement ? "Sair da tela cheia" : "Abrir livro em tela cheia");
  });

  buildPicker();
  swapPage(0);
})();