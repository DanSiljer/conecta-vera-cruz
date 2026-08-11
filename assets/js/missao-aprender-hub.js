document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const app = document.querySelector(".missao-aprender-app");
  const hub = document.querySelector("#central-jogos");
  if (!app || !hub) return;

  const moduleIds = [
    "historia-local",
    "livro-karl-marx",
    "livro-maria-felipa",
    "mapa-jogo",
    "quebra-cabeca-regioes",
    "quebra-cabeca-estados-regioes",
    "quebra-cabecas-vera-cruz",
    "quebra-cabeca-igreja-vera-cruz",
    "quebra-cabeca-jaburu",
    "quebra-cabeca-bandeira-vera-cruz",
    "quebra-cabeca-sagrado-coracao",
    "disciplinas",
    "resultados"
  ];

  const modules = moduleIds
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  const gameLauncher = document.getElementById("gameLauncher");
  const gameArea = document.getElementById("gameArea");

  function scrollToHub() {
    hub.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function closeModules(options) {
    const settings = options || {};

    modules.forEach(function (section) {
      section.hidden = true;
      section.classList.remove("is-active-module");
    });

    if (!settings.keepQuiz) {
      if (gameLauncher) gameLauncher.hidden = true;
      if (gameArea) gameArea.hidden = true;
    }
  }

  function createBackbar(label) {
    const bar = document.createElement("div");
    bar.className = "module-backbar";
    bar.innerHTML =
      '<button type="button" class="module-backbar__back" data-back-to-games>' +
        '<span class="module-backbar__icon" aria-hidden="true">←</span>' +
        '<span>Jogos</span>' +
      '</button>' +
      '<div class="module-backbar__content">' +
        '<strong class="module-backbar__label">' + label + '</strong>' +
        '<small class="module-backbar__subtext">Voltar para a central de jogos e atividades.</small>' +
      '</div>' +
      '<span class="module-backbar__arrow" aria-hidden="true">›</span>';

    bar.querySelector("[data-back-to-games]").addEventListener("click", function () {
      closeModules();
      scrollToHub();
    });

    return bar;
  }

  function ensureBackbar(section, label) {
    if (!section || section.querySelector(":scope > .module-backbar")) return;
    section.prepend(createBackbar(label));
  }

  const labels = {
    "historia-local": "História de Vera Cruz e da Ilha de Itaparica",
    "livro-karl-marx": "Livro interativo · Quem sou eu? Karl Marx",
    "livro-maria-felipa": "Livro interativo · Quem sou eu? Maria Felipa",
    "mapa-jogo": "Mapa-jogo da Ilha de Itaparica",
    "quebra-cabeca-regioes": "Quebra-cabeça das Regiões do Brasil",
    "quebra-cabeca-estados-regioes": "Quebra-cabeça dos Estados por Região",
    "quebra-cabecas-vera-cruz": "Quebra-cabeças de Vera Cruz",
    "quebra-cabeca-igreja-vera-cruz": "Quebra-cabeça da Igreja Nosso Senhor da Vera Cruz",
    "quebra-cabeca-jaburu": "Quebra-cabeça da Capela do Jaburu",
    "quebra-cabeca-bandeira-vera-cruz": "Quebra-cabeça da Bandeira de Vera Cruz",
    "quebra-cabeca-sagrado-coracao": "Quebra-cabeça da Igreja Sagrado Coração de Jesus",
    "resultados": "Meu progresso nos jogos"
  };

  modules.forEach(function (section) {
    section.classList.add("hub-module");
    section.hidden = true;
    if (section.id !== "disciplinas") {
      ensureBackbar(section, labels[section.id] || "Missão Aprender");
    }
  });

  if (gameLauncher) ensureBackbar(gameLauncher, "Configure sua partida");
  if (gameArea) ensureBackbar(gameArea, "Jogo em andamento");

  function openModule(id) {
    const target = document.getElementById(id);
    if (!target) return;

    closeModules();
    target.hidden = false;
    target.classList.add("is-active-module");

    window.requestAnimationFrame(function () {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function openSubject(subject) {
    closeModules({ keepQuiz: true });

    const sourceButton = document.querySelector(
      '#disciplinas .subject-button[data-subject="' + subject + '"]'
    ) || document.querySelector(
      '.subject-button[data-subject="' + subject + '"]'
    );

    if (!sourceButton) {
      console.warn("Missão não encontrada:", subject);
      return;
    }

    sourceButton.click();

    window.requestAnimationFrame(function () {
      if (gameLauncher && !gameLauncher.hidden) {
        gameLauncher.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  document.querySelectorAll("[data-module-target]").forEach(function (button) {
    button.addEventListener("click", function () {
      openModule(button.dataset.moduleTarget);
    });
  });

  document.querySelectorAll("[data-subject-target]").forEach(function (button) {
    button.addEventListener("click", function () {
      openSubject(button.dataset.subjectTarget);
    });
  });

  document.querySelectorAll("[data-hub-open]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      const id = link.dataset.hubOpen;
      if (!id) return;
      event.preventDefault();
      openModule(id);
    });
  });

  /* Ao clicar em "Ver resultados" no modal do quiz, revela o módulo de progresso. */
  const closeResult = document.getElementById("closeResultModalButton");
  if (closeResult) {
    closeResult.addEventListener("click", function () {
      window.setTimeout(function () { openModule("resultados"); }, 20);
    });
  }

  /* Se um quiz for encerrado, voltamos para a central em vez de deixar um vazio grande. */
  const quitGame = document.getElementById("quitGameButton");
  if (quitGame) {
    quitGame.addEventListener("click", function () {
      window.setTimeout(function () {
        if (gameArea && gameArea.hidden) scrollToHub();
      }, 30);
    });
  }

  /* Links antigos que apontavam para módulos escondidos passam a abri-los corretamente. */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    const id = (link.getAttribute("href") || "").slice(1);
    if (!moduleIds.includes(id) || link.hasAttribute("data-hub-open")) return;
    link.addEventListener("click", function (event) {
      event.preventDefault();
      openModule(id);
    });
  });

  /* Caso a página seja aberta com #resultados, #mapa-jogo etc. */
  const initialId = window.location.hash.slice(1);
  if (moduleIds.includes(initialId) && initialId !== "disciplinas") {
    window.setTimeout(function () { openModule(initialId); }, 120);
  }
});
