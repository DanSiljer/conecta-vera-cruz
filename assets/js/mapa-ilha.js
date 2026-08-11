document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  /* =========================================================
     ELEMENTOS PRINCIPAIS
     ========================================================= */

  const section = document.querySelector("#mapa-jogo");
  const hotspotLayer = document.querySelector("#islandMapHotspots");
  const mapImage = document.querySelector("#islandMapImage");

  if (!section || !hotspotLayer || !mapImage) {
    console.warn("Mapa-jogo: elementos principais não encontrados.");
    return;
  }

  /* =========================================================
     CONFIGURAÇÃO
     ========================================================= */

  const MAP_REFERENCE =
    "assets/img/jogos/mapa-ilha-referencia-v8.png";

  const MAP_CHALLENGE =
    "assets/img/jogos/mapa-ilha-desafio-v8.png";

  /*
   * false = jogo normal
   * true  = clicar no mapa para descobrir left/top
   */
  const CALIBRATION_MODE = false;

  const RESULT_KEY = "veraSaberResults";

  /* =========================================================
     LOCALIDADES
     ========================================================= */

  const PLACES = [
    {
      id: "itaparica",
      name: "Itaparica",
      municipality: "Itaparica",
      position: "Norte da ilha",
      left: 56.6,
      top: 2.0,
      clue: "Procure a sede histórica na parte norte da ilha.",
      description:
        "Sede do município de Itaparica."
    },

    {
      id: "ponta-de-areia",
      name: "Ponta de Areia",
      municipality: "Itaparica",
      position: "Extremo norte",
      left: 62.9,
      top: 5.5,
      clue: "Fica na faixa mais ao norte da ilha.",
      description:
        "Localidade litorânea do município de Itaparica."
    },

    {
      id: "amoreiras",
      name: "Amoreiras",
      municipality: "Itaparica",
      position: "Norte",
      left: 68.0,
      top: 8.0,
      clue: "Fica entre Ponta de Areia e Manguinhos.",
      description:
        "Comunidade localizada na porção norte da ilha."
    },

    {
      id: "manguinhos",
      name: "Manguinhos",
      municipality: "Itaparica",
      position: "Nordeste",
      left: 75.3,
      top: 9.7,
      clue: "Procure a costa nordeste da ilha.",
      description:
        "Localidade costeira do município de Itaparica."
    },

    {
      id: "porto-dos-santos",
      name: "Porto dos Santos",
      municipality: "Itaparica",
      position: "Nordeste",
      left: 77.0,
      top: 14.0,
      clue: "Fica abaixo de Manguinhos.",
      description:
        "Comunidade localizada na costa leste."
    },

    {
      id: "bom-despacho",
      name: "Bom Despacho",
      municipality: "Itaparica",
      position: "Leste / norte",
      left: 79.2,
      top: 17.8,
      clue: "Procure a região do ferry-boat.",
      description:
        "Importante ponto de chegada e saída da Ilha de Itaparica."
    },

    {
      id: "gameleira",
      name: "Gameleira",
      municipality: "Vera Cruz",
      position: "Leste / norte",
      left: 82.0,
      top: 23.3,
      clue: "Fica abaixo de Bom Despacho.",
      description:
        "Comunidade da costa leste de Vera Cruz."
    },

    {
      id: "buraco-do-boi",
      name: "Buraco do Boi",
      municipality: "Vera Cruz",
      position: "Leste / norte",
      left: 82.9,
      top: 26.1,
      clue: "Fica entre Gameleira e Jaburu.",
      description:
        "Localidade da faixa leste da ilha."
    },

    {
      id: "jaburu",
      name: "Jaburu",
      municipality: "Vera Cruz",
      position: "Leste",
      left: 85.1,
      top: 30.2,
      clue: "Fica acima de Mar Grande.",
      description:
        "Localidade da costa leste de Vera Cruz."
    },

    {
      id: "mar-grande",
      name: "Mar Grande",
      municipality: "Vera Cruz",
      position: "Leste / centro",
      left: 85.4,
      top: 33.1,
      clue: "É a sede do município de Vera Cruz.",
      description:
        "Sede administrativa de Vera Cruz."
    },

    {
      id: "ilhota",
      name: "Ilhota",
      municipality: "Vera Cruz",
      position: "Leste",
      left: 83.7,
      top: 35.5,
      clue: "Fica entre Mar Grande e Gamboa.",
      description:
        "Localidade da faixa leste de Vera Cruz."
    },

    {
      id: "gamboa",
      name: "Gamboa",
      municipality: "Vera Cruz",
      position: "Leste / centro",
      left: 82.8,
      top: 39.0,
      clue: "Fica abaixo de Mar Grande.",
      description:
        "Comunidade ligada à pesca, mariscagem e cultura popular."
    },

    {
      id: "penha",
      name: "Penha",
      municipality: "Vera Cruz",
      position: "Leste / centro",
      left: 81.8,
      top: 41.6,
      clue: "Procure a costa leste, abaixo de Gamboa.",
      description:
        "Localidade conhecida pela praia e pelo patrimônio histórico."
    },

    {
      id: "barra-do-gil",
      name: "Barra do Gil",
      municipality: "Vera Cruz",
      position: "Leste",
      left: 79.0,
      top: 44.0,
      clue: "Fica abaixo da Penha.",
      description:
        "Comunidade localizada na costa leste."
    },

    {
      id: "taipoca",
      name: "Taipoca",
      municipality: "Vera Cruz",
      position: "Leste",
      left: 77.0,
      top: 47.0,
      clue: "Procure abaixo de Barra do Gil.",
      description:
        "Localidade da região leste da ilha."
    },

    {
      id: "coroa",
      name: "Coroa",
      municipality: "Vera Cruz",
      position: "Leste",
      left: 75.0,
      top: 50.0,
      clue: "Fica abaixo de Taipoca.",
      description:
        "Localidade da costa de Vera Cruz."
    },

    {
      id: "barra-do-pote",
      name: "Barra do Pote",
      municipality: "Vera Cruz",
      position: "Leste",
      left: 72.6,
      top: 53.0,
      clue: "Fica entre Coroa e Conceição.",
      description:
        "Comunidade costeira de Vera Cruz."
    },

    {
      id: "conceicao",
      name: "Conceição",
      municipality: "Vera Cruz",
      position: "Centro-sul / leste",
      left: 69.0,
      top: 56.5,
      clue: "Procure a costa próxima à área do aeroporto.",
      description:
        "Comunidade conhecida por seu patrimônio histórico."
    },

    {
      id: "barra-grande",
      name: "Barra Grande",
      municipality: "Vera Cruz",
      position: "Sudeste",
      left: 63.5,
      top: 64.2,
      clue: "Procure a costa sudeste da ilha.",
      description:
        "Comunidade litorânea da parte sudeste."
    },

    {
      id: "ponta-da-cruz",
      name: "Ponta da Cruz",
      municipality: "Vera Cruz",
      position: "Centro-sul",
      left: 47.5,
      top: 72.8,
      clue: "Fica acima de Tairu.",
      description:
        "Localidade da região sul de Vera Cruz."
    },

    {
      id: "tairu",
      name: "Tairu",
      municipality: "Vera Cruz",
      position: "Sul / sudeste",
      left: 41.0,
      top: 76.0,
      clue: "Fica entre Ponta da Cruz e Aratuba.",
      description:
        "Localidade conhecida pela Praia de Tairu."
    },

    {
      id: "aratuba",
      name: "Aratuba",
      municipality: "Vera Cruz",
      position: "Sul",
      left: 31.5,
      top: 82.0,
      clue: "Fica entre Tairu e Berlinque.",
      description:
        "Comunidade da porção sul da ilha."
    },

    {
      id: "berlinque",
      name: "Berlinque",
      municipality: "Vera Cruz",
      position: "Sul",
      left: 27.0,
      top: 89.8,
      clue: "Procure a costa sul da ilha.",
      description:
        "Comunidade costeira de Vera Cruz."
    },

    {
      id: "catu",
      name: "Catu",
      municipality: "Vera Cruz",
      position: "Sudoeste",
      left: 12.9,
      top: 86.0,
      clue: "Fica na faixa sudoeste da ilha.",
      description:
        "Povoado histórico da região sul de Vera Cruz."
    },

    {
      id: "cacha-pregos",
      name: "Cacha-Pregos",
      municipality: "Vera Cruz",
      position: "Extremo sul",
      left: 13.4,
      top: 95.7,
      clue: "Procure a extremidade sul da ilha.",
      description:
        "Comunidade conhecida pela pesca, orla e regatas."
    },

    {
      id: "jiribatuba",
      name: "Jiribatuba",
      municipality: "Vera Cruz",
      position: "Sudoeste",
      left: 15.0,
      top: 76.8,
      clue: "Procure a costa sudoeste.",
      description:
        "Distrito ligado à pesca e à memória comunitária."
    },

    {
      id: "matarandiba",
      name: "Matarandiba",
      municipality: "Vera Cruz",
      position: "Oeste",
      left: 23.4,
      top: 49.3,
      clue: "Procure a área recortada por manguezais.",
      description:
        "Vila pesqueira e de marisqueiras."
    },

    {
      id: "ponta-grossa",
      name: "Ponta Grossa",
      municipality: "Vera Cruz",
      position: "Centro-oeste",
      left: 43.3,
      top: 47.0,
      clue: "Procure abaixo de Ponta dos Tatus.",
      description:
        "Localidade da região oeste."
    },

    {
      id: "baiacu",
      name: "Baiacu",
      municipality: "Vera Cruz",
      position: "Centro-oeste",
      left: 46.9,
      top: 45.2,
      clue: "Procure aproximadamente no meio da contracosta.",
      description:
        "Comunidade pesqueira de grande importância histórica."
    },


    {
      id: "misericordia",
      name: "Misericórdia",
      municipality: "Itaparica",
      position: "Norte / centro",
      left: 54.5,
      top: 18.4,
      clue: "Fica abaixo de Itaparica.",
      description:
        "Localidade da região norte da ilha."
    },

    {
      id: "juerana",
      name: "Juerana",
      municipality: "Vera Cruz",
      position: "Centro-norte",
      left: 59.0,
      top: 27.0,
      clue: "Procure entre Misericórdia e Vera Cruz.",
      description:
        "Comunidade situada na região centro-norte."
    },

    {
      id: "vera-cruz",
      name: "Vera Cruz",
      municipality: "Vera Cruz",
      position: "Centro-norte",
      left: 56.0,
      top: 30.0,
      clue: "Procure a região central acima de Baiacu.",
      description:
        "Localidade histórica que dá nome ao município."
    }
  ];

  /* =========================================================
     ELEMENTOS DA INTERFACE
     ========================================================= */

  const elements = {
    modeButtons: [
      ...section.querySelectorAll("[data-map-mode]")
    ],

    modeLabel:
      section.querySelector("#mapModeLabel"),

    scoreLabel:
      section.querySelector("#mapScoreLabel"),

    roundLabel:
      section.querySelector("#mapRoundLabel"),

    targetCard:
      section.querySelector("#mapTargetCard"),

    targetName:
      section.querySelector("#mapTargetName"),

    targetClue:
      section.querySelector("#mapTargetClue"),

    placeEyebrow:
      section.querySelector(".map-place-card__eyebrow"),

    placeName:
      section.querySelector("#mapPlaceName"),

    placeDescription:
      section.querySelector("#mapPlaceDescription"),

    placeMunicipality:
      section.querySelector("#mapPlaceMunicipality"),

    placePosition:
      section.querySelector("#mapPlacePosition"),

    settings:
      section.querySelector("#mapChallengeSettings"),

    difficulty:
      section.querySelector("#mapDifficulty"),

    rounds:
      section.querySelector("#mapRounds"),

    feedback:
      section.querySelector("#mapFeedback"),

    resetButton:
      section.querySelector("#resetMapGame")
  };

  /* =========================================================
     ESTADO
     ========================================================= */

  const state = {
    mode: "explore",

    started: false,

    difficulty: "medio",

    order: [],

    roundIndex: 0,

    score: 0,

    correct: 0,

    attemptsInRound: 0,

    locked: false,

    finished: false
  };

  /* =========================================================
     EMBARALHAR
     ========================================================= */

  function shuffle(items) {
    const copy = [...items];

    for (
      let index = copy.length - 1;
      index > 0;
      index -= 1
    ) {
      const randomIndex =
        Math.floor(
          Math.random() *
          (index + 1)
        );

      [
        copy[index],
        copy[randomIndex]
      ] = [
        copy[randomIndex],
        copy[index]
      ];
    }

    return copy;
  }

  /* =========================================================
     ESCAPAR HTML
     ========================================================= */

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  /* =========================================================
     FEEDBACK
     ========================================================= */

  function setFeedback(
    title,
    message,
    type = ""
  ) {
    if (!elements.feedback) {
      return;
    }

    elements.feedback.classList.remove(
      "is-success",
      "is-error"
    );

    if (type) {
      elements.feedback.classList.add(
        type
      );
    }

    elements.feedback.innerHTML =
      "<strong>" +
      escapeHtml(title) +
      "</strong>" +
      "<p>" +
      escapeHtml(message) +
      "</p>";
  }

  /* =========================================================
     MAPA CORRETO POR NÍVEL
     ========================================================= */

  function updateMapImage() {
    /*
     * EXPLORAR
     * mapa com nomes
     */

    if (state.mode === "explore") {
      mapImage.src =
        MAP_REFERENCE;

      section.dataset.mapStyle =
        "reference";

      return;
    }

    /*
     * FÁCIL
     * mapa com nomes
     */

    if (state.difficulty === "facil") {
      mapImage.src =
        MAP_REFERENCE;

      section.dataset.mapStyle =
        "reference";

      return;
    }

    /*
     * MÉDIO E DIFÍCIL
     * mapa sem nomes
     */

    mapImage.src =
      MAP_CHALLENGE;

    section.dataset.mapStyle =
      "challenge";
  }

  /* =========================================================
     INTERFACE DA DIFICULDADE
     ========================================================= */

  function updateDifficultyInterface() {
    section.dataset.difficulty =
      state.difficulty;

    /* FÁCIL */

    if (state.difficulty === "facil") {
      elements.modeLabel.textContent =
        "Fácil · nomes + pista";

      if (!state.started) {
        elements.placeEyebrow.textContent =
          "NÍVEL FÁCIL";

        elements.placeName.textContent =
          "Nomes + pista";

        elements.placeDescription.textContent =
          "O mapa mostra os nomes das localidades e também oferece uma pista.";
      }

      return;
    }

    /* MÉDIO */

    if (state.difficulty === "medio") {
      elements.modeLabel.textContent =
        "Médio · sem nomes + pista";

      if (elements.targetClue) {
        elements.targetClue.hidden = false;
        elements.targetClue.style.display = "block";
      }

      if (!state.started) {
        elements.placeEyebrow.textContent =
          "NÍVEL MÉDIO";

        elements.placeName.textContent =
          "Sem nomes + pista";

        elements.placeDescription.textContent =
          "O mapa fica sem nomes. Durante a rodada aparecem pista, município e posição aproximada.";
      }

      return;
    }

    /* DIFÍCIL */

    if (state.difficulty === "dificil") {
      elements.modeLabel.textContent =
        "Difícil · sem nomes e sem pista";

      if (elements.targetClue) {
        elements.targetClue.textContent = "";
        elements.targetClue.hidden = true;
        elements.targetClue.style.display = "none";
      }

      if (!state.started) {
        elements.placeEyebrow.textContent =
          "NÍVEL DIFÍCIL";

        elements.placeName.textContent =
          "Memória total";

        elements.placeDescription.textContent =
          "O mapa fica sem nomes. Não aparecem pista, município nem posição aproximada.";
      }
    }
  }

  /* =========================================================
     ATUALIZAR BOTÕES EXPLORAR / JOGAR
     ========================================================= */

  function updateModeButtons() {
    elements.modeButtons.forEach(
      function (button) {
        const active =
          button.dataset.mapMode ===
          state.mode;

        button.classList.toggle(
          "is-active",
          active
        );

        button.setAttribute(
          "aria-pressed",
          String(active)
        );
      }
    );
  }

  /* =========================================================
     CRIAR MARCADORES
     ========================================================= */

  function renderHotspots() {
    hotspotLayer.innerHTML = "";

    PLACES.forEach(function (place) {
      const button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

      button.className =
        "map-hotspot";

      button.dataset.placeId =
        place.id;

      button.dataset.label =
        place.name;

      button.style.left =
        place.left + "%";

      button.style.top =
        place.top + "%";

      /*
       * Só permite nome no title
       * em Explorar e Fácil.
       */

      const showName =
        state.mode === "explore" ||
        state.difficulty === "facil";

      if (showName) {
        button.title =
          place.name;

        button.setAttribute(
          "aria-label",
          place.name
        );
      } else {
        button.removeAttribute(
          "title"
        );

        button.setAttribute(
          "aria-label",
          "Ponto do mapa"
        );
      }

      button.addEventListener(
        "click",
        function () {
          handlePlaceClick(
            place,
            button
          );
        }
      );

      hotspotLayer.appendChild(
        button
      );
    });
  }

  /* =========================================================
     PEGAR MARCADOR
     ========================================================= */

  function getHotspot(id) {
    return hotspotLayer.querySelector(
      '[data-place-id="' +
      id +
      '"]'
    );
  }

  /* =========================================================
     LIMPAR MARCADORES
     ========================================================= */

  function clearHotspots() {
    hotspotLayer
      .querySelectorAll(
        ".map-hotspot"
      )
      .forEach(function (button) {
        button.classList.remove(
          "is-selected",
          "is-correct",
          "is-wrong"
        );

        button.disabled =
          false;
      });
  }

  /* =========================================================
     BLOQUEAR MARCADORES
     ========================================================= */

  function lockHotspots(value) {
    hotspotLayer
      .querySelectorAll(
        ".map-hotspot"
      )
      .forEach(function (button) {
        button.disabled =
          value;
      });
  }

  /* =========================================================
     MOSTRAR LOCALIDADE NO MODO EXPLORAR
     ========================================================= */

  function showPlace(place) {
    clearHotspots();

    const button =
      getHotspot(
        place.id
      );

    if (button) {
      button.classList.add(
        "is-selected"
      );
    }

    elements.placeEyebrow.textContent =
      "LOCALIDADE SELECIONADA";

    elements.placeName.textContent =
      place.name;

    elements.placeDescription.textContent =
      place.description;

    elements.placeMunicipality.textContent =
      place.municipality;

    elements.placePosition.textContent =
      place.position;

    setFeedback(
      "Exploração livre",
      "Observe a localização de " +
      place.name +
      "."
    );
  }

  /* =========================================================
     MODO EXPLORAR
     ========================================================= */

  function setExploreMode() {
    state.mode =
      "explore";

    state.started =
      false;

    state.finished =
      false;

    state.locked =
      false;

    state.score =
      0;

    state.correct =
      0;

    state.roundIndex =
      0;

    state.order =
      [];

    section.dataset.mode =
      "explore";

    section.dataset.difficulty =
      "explore";

    updateModeButtons();

    updateMapImage();

    renderHotspots();

    clearHotspots();

    elements.modeLabel.textContent =
      "Exploração livre";

    elements.scoreLabel.textContent =
      "0 pontos";

    elements.roundLabel.textContent =
      "Livre";

    elements.targetCard.hidden =
      true;

    elements.placeEyebrow.textContent =
      "COMECE EXPLORANDO";

    elements.placeName.textContent =
      "Clique em um ponto";

    elements.placeDescription.textContent =
      "Use o mapa com nomes para estudar as localidades.";

    elements.placeMunicipality.textContent =
      "Itaparica ou Vera Cruz";

    elements.placePosition.textContent =
      "Norte, centro ou sul";

    setFeedback(
      "Modo exploração",
      "Clique em qualquer marcador para conhecer a localidade."
    );
  }

  /* =========================================================
     PREPARAR MODO JOGO
     ========================================================= */

  function prepareChallengeMode() {
    state.mode =
      "challenge";

    state.started =
      false;

    state.finished =
      false;

    state.locked =
      false;

    state.difficulty =
      elements.difficulty
        ? elements.difficulty.value
        : "medio";

    state.score =
      0;

    state.correct =
      0;

    state.roundIndex =
      0;

    state.order =
      [];

    section.dataset.mode =
      "challenge";

    section.dataset.difficulty =
      state.difficulty;

    updateModeButtons();

    updateMapImage();

    renderHotspots();

    clearHotspots();

    updateDifficultyInterface();

    elements.scoreLabel.textContent =
      "0 pontos";

    elements.roundLabel.textContent =
      "Aguardando";

    elements.targetCard.hidden =
      true;

    setFeedback(
      "Configure a partida",
      "Escolha o nível e a quantidade de rodadas."
    );
  }

  /* =========================================================
     PONTUAÇÃO
     ========================================================= */

  function pointsPerCorrectAnswer() {
    if (state.difficulty === "facil") {
      return 10;
    }

    if (state.difficulty === "dificil") {
      return 25;
    }

    return 15;
  }

  /* =========================================================
     INICIAR JOGO
     ========================================================= */

  function startChallenge() {
    if (!elements.rounds) {
      return;
    }

    const requested =
      Number(
        elements.rounds.value
      );

    const total =
      Math.min(
        requested,
        PLACES.length
      );

    state.mode =
      "challenge";

    state.started =
      true;

    state.finished =
      false;

    state.locked =
      false;

    state.difficulty =
      elements.difficulty
        ? elements.difficulty.value
        : "medio";

    state.score =
      0;

    state.correct =
      0;

    state.roundIndex =
      0;

    state.attemptsInRound =
      0;

    state.order =
      shuffle(
        PLACES
      ).slice(
        0,
        total
      );

    section.dataset.mode =
      "challenge";

    section.dataset.difficulty =
      state.difficulty;

    updateModeButtons();

    updateMapImage();

    renderHotspots();

    updateDifficultyInterface();

    elements.scoreLabel.textContent =
      "0 pontos";

    showCurrentTarget();
  }

  /* =========================================================
     MOSTRAR RODADA
     ========================================================= */

  function showCurrentTarget() {
    clearHotspots();
    lockHotspots(false);

    state.locked = false;
    state.attemptsInRound = 0;

    const target = state.order[state.roundIndex];

    if (!target) {
      finishChallenge();
      return;
    }

    elements.roundLabel.textContent =
      (state.roundIndex + 1) + " de " + state.order.length;

    elements.targetName.textContent = target.name;
    elements.targetCard.hidden = false;

    elements.placeEyebrow.textContent =
      "DESAFIO EM ANDAMENTO";

    elements.placeName.textContent =
      "Encontre " + target.name;

    elements.placePosition.textContent =
      "Rodada " + (state.roundIndex + 1);

    /*
     * FÁCIL
     * mapa com nomes + pista completa
     */
    if (state.difficulty === "facil") {
      elements.modeLabel.textContent =
        "Fácil · nomes + pista";

      elements.targetClue.hidden = false;
      elements.targetClue.style.display = "block";
      elements.targetClue.textContent =
        "Pista: " + target.clue;

      elements.placeDescription.textContent =
        "Os nomes estão visíveis no mapa e a pista está disponível.";

      elements.placeMunicipality.textContent =
        target.municipality;

      elements.placePosition.textContent =
        target.position;

      setFeedback(
        "Nível Fácil",
        "Encontre " + target.name +
        ". Use os nomes do mapa e a pista.",
        ""
      );

      return;
    }

    /*
     * MÉDIO
     * mapa sem nomes + pista + município + região aproximada
     */
    if (state.difficulty === "medio") {
      elements.modeLabel.textContent =
        "Médio · sem nomes + pista";

      elements.targetClue.hidden = false;
      elements.targetClue.style.display = "block";
      elements.targetClue.textContent =
        "PISTA: " + target.clue;

      elements.placeDescription.textContent =
        "Os nomes estão escondidos. Use a pista, o município e a posição aproximada.";

      elements.placeMunicipality.textContent =
        target.municipality;

      elements.placePosition.textContent =
        target.position;

      setFeedback(
        "Nível Médio",
        "Pista: " + target.clue +
        " Município: " + target.municipality +
        ". Região: " + target.position + ".",
        ""
      );

      return;
    }

    /*
     * DIFÍCIL
     * mapa sem nomes + sem pista + sem município + sem posição
     */
    if (state.difficulty === "dificil") {
      elements.modeLabel.textContent =
        "Difícil · sem nomes e sem pista";

      elements.targetClue.textContent = "";
      elements.targetClue.hidden = true;
      elements.targetClue.style.display = "none";

      elements.placeDescription.textContent =
        "Use apenas sua memória para localizar a comunidade.";

      elements.placeMunicipality.textContent =
        "Oculto";

      elements.placePosition.textContent =
        "Oculto";

      setFeedback(
        "Nível Difícil",
        "Encontre " + target.name +
        ". Nenhuma pista, município ou posição será mostrada.",
        ""
      );
    }
  }

  /* =========================================================
     PRÓXIMA RODADA
     ========================================================= */

  function nextRound(delay) {
    window.setTimeout(
      function () {
        state.roundIndex +=
          1;

        if (
          state.roundIndex >=
          state.order.length
        ) {
          finishChallenge();
        } else {
          showCurrentTarget();
        }
      },
      delay
    );
  }

  /* =========================================================
     CLIQUE NO MARCADOR
     ========================================================= */

  function handlePlaceClick(
    place,
    button
  ) {
    /* EXPLORAÇÃO */

    if (state.mode === "explore") {
      showPlace(place);
      return;
    }

    /* PARTIDA NÃO INICIADA */

    if (!state.started) {
      setFeedback(
        "Inicie o jogo",
        "Escolha o nível e clique em Iniciar jogo.",
        "is-error"
      );

      return;
    }

    if (
      state.finished ||
      state.locked
    ) {
      return;
    }

    const target =
      state.order[
        state.roundIndex
      ];

    if (!target) {
      return;
    }

    state.attemptsInRound +=
      1;

    const correct =
      place.id ===
      target.id;

    /* =====================================================
       ACERTO
       ===================================================== */

    if (correct) {
      state.locked =
        true;

      lockHotspots(true);

      state.correct +=
        1;

      let earned =
        pointsPerCorrectAnswer();

      /* MÉDIO */

      if (state.difficulty === "medio") {
        earned =
          Math.max(
            8,
            earned -
            (
              state.attemptsInRound -
              1
            ) *
            3
          );
      }

      /* DIFÍCIL */

      if (state.difficulty === "dificil") {
        earned =
          Math.max(
            10,
            earned -
            (
              state.attemptsInRound -
              1
            ) *
            4
          );
      }

      state.score +=
        earned;

      button.classList.add(
        "is-correct"
      );

      elements.scoreLabel.textContent =
        state.score +
        " pontos";

      setFeedback(
        "Resposta correta!",
        target.name +
        " localizado. +" +
        earned +
        " pontos.",
        "is-success"
      );

      nextRound(900);

      return;
    }

    /* =====================================================
       ERRO
       ===================================================== */

    button.classList.add(
      "is-wrong"
    );

    /* =====================================================
       ERRO NO FÁCIL

       mostra a resposta
       ===================================================== */

    if (state.difficulty === "facil") {
      state.locked =
        true;

      lockHotspots(true);

      const correctButton =
        getHotspot(
          target.id
        );

      if (correctButton) {
        correctButton.classList.add(
          "is-correct"
        );
      }

      setFeedback(
        "Quase!",
        "O ponto correto de " +
        target.name +
        " foi destacado.",
        "is-error"
      );

      nextRound(1400);

      return;
    }

    /* =====================================================
       ERRO NO MÉDIO

       primeira tentativa:
       deixa tentar novamente

       segunda tentativa:
       mostra a resposta
       ===================================================== */

    if (state.difficulty === "medio") {
      if (
        state.attemptsInRound <
        2
      ) {
        setFeedback(
          "Tente novamente",
          target.clue,
          "is-error"
        );

        window.setTimeout(
          function () {
            button.classList.remove(
              "is-wrong"
            );
          },
          500
        );

        return;
      }

      state.locked =
        true;

      lockHotspots(true);

      const correctButton =
        getHotspot(
          target.id
        );

      if (correctButton) {
        correctButton.classList.add(
          "is-correct"
        );
      }

      setFeedback(
        "Veja a posição",
        "Depois de duas tentativas, o ponto correto foi mostrado.",
        "is-error"
      );

      nextRound(1500);

      return;
    }

    /* =====================================================
       ERRO NO DIFÍCIL

       nunca revela a resposta
       ===================================================== */

    if (state.difficulty === "dificil") {
      setFeedback(
        "Não é esse ponto",
        "Continue tentando. Nenhuma pista ou resposta será mostrada.",
        "is-error"
      );

      window.setTimeout(
        function () {
          button.classList.remove(
            "is-wrong"
          );
        },
        500
      );

      return;
    }
  }

  /* =========================================================
     RESULTADOS
     ========================================================= */

  function loadResults() {
    try {
      const stored =
        JSON.parse(
          localStorage.getItem(
            RESULT_KEY
          ) || "[]"
        );

      return Array.isArray(stored)
        ? stored
        : [];
    } catch (error) {
      return [];
    }
  }

  /* =========================================================
     SALVAR RESULTADO
     ========================================================= */

  function saveResult() {
    const total =
      state.order.length;

    const percentage =
      total
        ? Math.round(
            (
              state.correct /
              total
            ) *
            100
          )
        : 0;

    const studentName =
      document.querySelector(
        "#studentName"
      );

    const studentClass =
      document.querySelector(
        "#studentClass"
      );

    const result = {
      id:
        Date.now(),

      student:
        studentName &&
        studentName.value.trim()
          ? studentName.value.trim()
          : "Visitante",

      className:
        studentClass &&
        studentClass.value.trim()
          ? studentClass.value.trim()
          : "Não informada",

      activity:
        "Mapa-jogo da Ilha de Itaparica",

      subject:
        "Geografia e História local",

      difficulty:
        state.difficulty,

      correct:
        state.correct,

      total:
        total,

      score:
        state.score,

      percentage:
        percentage,

      date:
        new Date()
          .toLocaleString(
            "pt-BR"
          )
    };

    const results =
      loadResults();

    results.unshift(
      result
    );

    localStorage.setItem(
      RESULT_KEY,
      JSON.stringify(
        results.slice(
          0,
          100
        )
      )
    );

    return result;
  }

  /* =========================================================
     FINALIZAR
     ========================================================= */

  function finishChallenge() {
    state.finished =
      true;

    state.locked =
      true;

    lockHotspots(false);

    elements.targetCard.hidden =
      true;

    const result =
      saveResult();

    elements.modeLabel.textContent =
      "Desafio concluído";

    elements.roundLabel.textContent =
      state.order.length +
      " rodadas";

    elements.placeEyebrow.textContent =
      "MISSÃO CONCLUÍDA";

    elements.placeName.textContent =
      result.percentage +
      "% de aproveitamento";

    elements.placeDescription.textContent =
      "Você acertou " +
      state.correct +
      " de " +
      state.order.length +
      " localidades.";

    elements.placeMunicipality.textContent =
      "Geografia e História local";

    elements.placePosition.textContent =
      result.date;

    setFeedback(
      "Missão concluída!",
      "Pontuação final: " +
      state.score +
      " pontos.",
      "is-success"
    );
  }

  /* =========================================================
     MODO CALIBRAÇÃO
     ========================================================= */

  function enableCalibrationMode() {
    if (!CALIBRATION_MODE) {
      return;
    }

    console.log(
      "=============================="
    );

    console.log(
      "MODO DE CALIBRAÇÃO ATIVADO"
    );

    console.log(
      "Clique no ponto exato do mapa."
    );

    console.log(
      "=============================="
    );

    mapImage.style.cursor =
      "crosshair";

    mapImage.addEventListener(
      "click",
      function (event) {
        const rect =
          mapImage.getBoundingClientRect();

        const x =
          event.clientX -
          rect.left;

        const y =
          event.clientY -
          rect.top;

        const left =
          (
            x /
            rect.width *
            100
          ).toFixed(2);

        const top =
          (
            y /
            rect.height *
            100
          ).toFixed(2);

        console.log(
          "COORDENADAS:"
        );

        console.log(
          "left:",
          left
        );

        console.log(
          "top:",
          top
        );

        console.log(
          `{ left: ${left}, top: ${top} }`
        );

        /* MARCADOR TEMPORÁRIO */

        const marker =
          document.createElement(
            "span"
          );

        marker.style.position =
          "absolute";

        marker.style.left =
          left + "%";

        marker.style.top =
          top + "%";

        marker.style.width =
          "18px";

        marker.style.height =
          "18px";

        marker.style.borderRadius =
          "50%";

        marker.style.background =
          "#ff0000";

        marker.style.border =
          "3px solid white";

        marker.style.boxShadow =
          "0 0 0 2px black";

        marker.style.transform =
          "translate(-50%, -50%)";

        marker.style.zIndex =
          "999";

        marker.style.pointerEvents =
          "none";

        hotspotLayer.appendChild(
          marker
        );
      }
    );
  }

  /* =========================================================
     EVENTO EXPLORAR / JOGAR
     ========================================================= */

  elements.modeButtons.forEach(
    function (button) {
      button.addEventListener(
        "click",
        function () {
          const mode =
            button.dataset.mapMode;

          if (mode === "challenge") {
            prepareChallengeMode();
          } else {
            setExploreMode();
          }
        }
      );
    }
  );

  /* =========================================================
     TROCAR DIFICULDADE

     ESTA PARTE CORRIGE O PROBLEMA
     ========================================================= */

  if (elements.difficulty) {
    elements.difficulty.addEventListener(
      "change",
      function () {
        state.difficulty =
          elements.difficulty.value;

        section.dataset.difficulty =
          state.difficulty;

        /*
         * Atualiza imediatamente
         * a interface.
         */

        updateDifficultyInterface();

        /*
         * Se estiver no modo jogo,
         * troca o mapa.
         */

        if (
          state.mode ===
          "challenge"
        ) {
          updateMapImage();

          renderHotspots();

          /*
           * Se a partida já começou,
           * atualiza a rodada atual.
           */

          if (
            state.started &&
            !state.finished
          ) {
            showCurrentTarget();
          }
        }
      }
    );
  }

  /* =========================================================
     INICIAR JOGO
     ========================================================= */

  if (elements.settings) {
    elements.settings.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();

        startChallenge();
      }
    );
  }

  /* =========================================================
     VOLTAR PARA EXPLORAR
     ========================================================= */

  if (elements.resetButton) {
    elements.resetButton.addEventListener(
      "click",
      function () {
        setExploreMode();
      }
    );
  }

  /* =========================================================
     INICIALIZAÇÃO
     ========================================================= */

  setExploreMode();

  enableCalibrationMode();
});