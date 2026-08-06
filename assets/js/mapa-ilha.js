document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const section = document.querySelector("#mapa-jogo");
  const hotspotLayer = document.querySelector("#islandMapHotspots");

  if (!section || !hotspotLayer) return;

  const RESULT_KEY = "veraSaberResults";

  /*
   * Coordenadas recalibradas sobre a imagem quadrada 1266 × 1266.
   * Os pontos agora acompanham as localidades impressas no próprio mapa.
   */
  const PLACES = [
    {
      id: "itaparica",
      name: "Itaparica",
      municipality: "Itaparica",
      position: "Norte da ilha",
      left: 56.8,
      top: 12.0,
      clue: "Procure a área urbana no norte da ilha.",
      description: "Sede do município de Itaparica, na porção norte da ilha."
    },
    {
      id: "ponta-de-areia",
      name: "Ponta de Areia",
      municipality: "Itaparica",
      position: "Nordeste da ilha",
      left: 62.7,
      top: 5.9,
      clue: "Observe a parte superior e direita do mapa.",
      description: "Localidade situada na faixa nordeste da Ilha de Itaparica."
    },
    {
      id: "amoreiras",
      name: "Amoreiras",
      municipality: "Itaparica",
      position: "Nordeste da ilha",
      left: 67.4,
      top: 8.3,
      clue: "Fica próxima de Ponta de Areia.",
      description: "Comunidade litorânea do município de Itaparica."
    },
    {
      id: "manguinhos",
      name: "Manguinhos",
      municipality: "Itaparica",
      position: "Leste, porção norte",
      left: 76.8,
      top: 10.7,
      clue: "Procure o litoral leste, acima de Porto dos Santos.",
      description: "Localidade costeira na porção norte da ilha."
    },
    {
      id: "porto-dos-santos",
      name: "Porto dos Santos",
      municipality: "Itaparica",
      position: "Leste, porção norte",
      left: 81.5,
      top: 14.7,
      clue: "Fica na costa leste, abaixo de Manguinhos.",
      description: "Comunidade localizada na costa leste do município de Itaparica."
    },
    {
      id: "bom-despacho",
      name: "Bom Despacho",
      municipality: "Itaparica",
      position: "Leste da ilha",
      left: 81.8,
      top: 19.6,
      clue: "Procure a área do terminal do ferry-boat.",
      description: "Importante ponto de chegada e saída pelo sistema ferry-boat."
    },
    {
      id: "gameleira",
      name: "Gameleira",
      municipality: "Vera Cruz",
      position: "Leste, área norte de Vera Cruz",
      left: 82.9,
      top: 24.7,
      clue: "Fica abaixo de Bom Despacho, no lado leste.",
      description: "Comunidade de Vera Cruz próxima à costa leste da ilha."
    },
    {
      id: "jaburu",
      name: "Jaburu",
      municipality: "Vera Cruz",
      position: "Leste, área central",
      left: 85.0,
      top: 30.4,
      clue: "Procure o nome Jaburu na costa leste.",
      description: "Localidade ligada à Capela dos Velasques e ao Moinho das Mercês."
    },
    {
      id: "mar-grande",
      name: "Mar Grande",
      municipality: "Vera Cruz",
      position: "Leste, área central",
      left: 84.4,
      top: 33.2,
      clue: "Procure a sede de Vera Cruz na costa leste.",
      description: "Sede administrativa de Vera Cruz e importante ponto de travessia marítima."
    },
    {
      id: "gamboa",
      name: "Gamboa",
      municipality: "Vera Cruz",
      position: "Leste, área central",
      left: 82.6,
      top: 39.9,
      clue: "Fica abaixo de Mar Grande e próxima de Penha.",
      description: "Comunidade ligada à mariscagem, ao samba de roda e aos saberes do mar."
    },
    {
      id: "penha",
      name: "Penha",
      municipality: "Vera Cruz",
      position: "Leste, área central",
      left: 78.4,
      top: 42.8,
      clue: "Procure a costa leste, abaixo de Gamboa.",
      description: "Localidade conhecida pela praia, pelo rio e pelas ruínas do antigo forno de cal."
    },
    {
      id: "conceicao",
      name: "Conceição",
      municipality: "Vera Cruz",
      position: "Leste, área centro-sul",
      left: 68.7,
      top: 56.7,
      clue: "Procure o litoral leste, próximo ao aeroporto indicado no mapa.",
      description: "Comunidade conhecida pelas ruínas da Igreja de Nossa Senhora da Conceição."
    },
    {
      id: "baiacu",
      name: "Baiacu",
      municipality: "Vera Cruz",
      position: "Contracosta, área central",
      left: 47.1,
      top: 45.3,
      clue: "Observe a contracosta na parte central da ilha.",
      description: "Comunidade tradicional pesqueira ligada à antiga Vila do Senhor da Vera Cruz."
    },
    {
      id: "matarandiba",
      name: "Matarandiba",
      municipality: "Vera Cruz",
      position: "Oeste, porção central",
      left: 23.8,
      top: 45.9,
      clue: "Procure a localidade insular no lado oeste.",
      description: "Vila pesqueira e de marisqueiras com forte memória comunitária."
    },
    {
      id: "jiribatuba",
      name: "Jiribatuba",
      municipality: "Vera Cruz",
      position: "Sudoeste da ilha",
      left: 15.2,
      top: 76.9,
      clue: "Observe a parte inferior esquerda do mapa.",
      description: "Distrito marcado por paisagem costeira, fé, pesca e memória comunitária."
    },
    {
      id: "tairu",
      name: "Tairu",
      municipality: "Vera Cruz",
      position: "Centro-sul da ilha",
      left: 42.2,
      top: 77.0,
      clue: "Procure a localidade indicada acima de Aratuba.",
      description: "Localidade conhecida pela praia e pela ocupação litorânea."
    },
    {
      id: "catu",
      name: "Catu",
      municipality: "Vera Cruz",
      position: "Sul da ilha",
      left: 13.5,
      top: 90.2,
      clue: "Procure o nome Catu na faixa sudoeste.",
      description: "Povoado antigo ligado à Fazenda Santo Amaro do Catu e à Praia do Calado."
    },
    {
      id: "berlinque",
      name: "Berlinque",
      municipality: "Vera Cruz",
      position: "Sul da ilha",
      left: 27.7,
      top: 89.8,
      clue: "Fica abaixo de Aratuba, próximo ao litoral.",
      description: "Comunidade costeira localizada na porção sul de Vera Cruz."
    },
    {
      id: "cacha-pregos",
      name: "Cacha-Pregos",
      municipality: "Vera Cruz",
      position: "Extremo sul",
      left: 14.0,
      top: 97.2,
      clue: "Procure a extremidade inferior da ilha.",
      description: "Comunidade do extremo sul conhecida pela pesca, pela orla e pelas regatas."
    }
  ];

  const elements = {
    modeButtons: [...section.querySelectorAll("[data-map-mode]")],
    modeLabel: section.querySelector("#mapModeLabel"),
    scoreLabel: section.querySelector("#mapScoreLabel"),
    roundLabel: section.querySelector("#mapRoundLabel"),
    targetCard: section.querySelector("#mapTargetCard"),
    targetName: section.querySelector("#mapTargetName"),
    targetClue: section.querySelector("#mapTargetClue"),
    placeEyebrow: section.querySelector(".map-place-card__eyebrow"),
    placeName: section.querySelector("#mapPlaceName"),
    placeDescription: section.querySelector("#mapPlaceDescription"),
    placeMunicipality: section.querySelector("#mapPlaceMunicipality"),
    placePosition: section.querySelector("#mapPlacePosition"),
    settings: section.querySelector("#mapChallengeSettings"),
    difficulty: section.querySelector("#mapDifficulty"),
    rounds: section.querySelector("#mapRounds"),
    feedback: section.querySelector("#mapFeedback"),
    resetButton: section.querySelector("#resetMapGame")
  };

  const state = {
    mode: "explore",
    started: false,
    difficulty: "medio",
    order: [],
    roundIndex: 0,
    score: 0,
    correct: 0,
    locked: false,
    finished: false
  };

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function shuffle(items) {
    const copy = [...items];

    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }

    return copy;
  }

  function getHotspot(id) {
    return hotspotLayer.querySelector('[data-place-id="' + id + '"]');
  }

  function clearHotspotStates() {
    hotspotLayer.querySelectorAll(".map-hotspot").forEach(function (button) {
      button.classList.remove("is-selected", "is-correct", "is-wrong");
      button.disabled = false;
    });
  }

  function lockHotspots(locked) {
    hotspotLayer.querySelectorAll(".map-hotspot").forEach(function (button) {
      button.disabled = locked;
    });
  }

  function setFeedback(title, message, type) {
    if (!elements.feedback) return;

    elements.feedback.classList.remove("is-success", "is-error");
    if (type) elements.feedback.classList.add(type);

    elements.feedback.innerHTML =
      "<strong>" + escapeHtml(title) + "</strong>" +
      "<p>" + escapeHtml(message) + "</p>";
  }

  function showPlace(place) {
    clearHotspotStates();

    const button = getHotspot(place.id);
    if (button) button.classList.add("is-selected");

    elements.placeEyebrow.textContent = "LOCALIDADE SELECIONADA";
    elements.placeName.textContent = place.name;
    elements.placeDescription.textContent = place.description;
    elements.placeMunicipality.textContent = place.municipality;
    elements.placePosition.textContent = place.position;

    setFeedback(
      "Exploração livre",
      "Observe a posição de " + place.name + " e escolha outro ponto quando desejar.",
      ""
    );
  }

  function renderHotspots() {
    hotspotLayer.replaceChildren();

    PLACES.forEach(function (place) {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "map-hotspot";
      button.dataset.placeId = place.id;
      button.dataset.label = place.name;
      button.style.left = place.left + "%";
      button.style.top = place.top + "%";
      button.setAttribute("aria-label", place.name);
      button.title = place.name;

      button.addEventListener("click", function () {
        handlePlaceClick(place, button);
      });

      hotspotLayer.appendChild(button);
    });
  }

  function updateModeButtons() {
    elements.modeButtons.forEach(function (button) {
      const active = button.dataset.mapMode === state.mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function setExploreMode() {
    state.mode = "explore";
    state.started = false;
    state.order = [];
    state.roundIndex = 0;
    state.score = 0;
    state.correct = 0;
    state.locked = false;
    state.finished = false;

    section.dataset.mode = "explore";
    updateModeButtons();
    clearHotspotStates();

    elements.modeLabel.textContent = "Exploração livre";
    elements.scoreLabel.textContent = "0 pontos";
    elements.roundLabel.textContent = "Livre";
    elements.targetCard.hidden = true;

    elements.placeEyebrow.textContent = "COMECE EXPLORANDO";
    elements.placeName.textContent = "Clique em um ponto";
    elements.placeDescription.textContent =
      "Os marcadores estão posicionados sobre as localidades indicadas na imagem.";
    elements.placeMunicipality.textContent = "Itaparica ou Vera Cruz";
    elements.placePosition.textContent = "Norte, centro ou sul da ilha";

    setFeedback(
      "Modo exploração ativado.",
      "Clique em um marcador para conhecer a localidade.",
      ""
    );
  }

  function prepareChallengeMode() {
    state.mode = "challenge";
    state.started = false;
    state.order = [];
    state.roundIndex = 0;
    state.score = 0;
    state.correct = 0;
    state.locked = false;
    state.finished = false;

    section.dataset.mode = "challenge";
    updateModeButtons();
    clearHotspotStates();

    elements.modeLabel.textContent = "Configurar desafio";
    elements.scoreLabel.textContent = "0 pontos";
    elements.roundLabel.textContent = "Aguardando";
    elements.targetCard.hidden = true;

    elements.placeEyebrow.textContent = "MODO JOGO";
    elements.placeName.textContent = "Configure a partida";
    elements.placeDescription.textContent =
      "Escolha o nível e a quantidade de rodadas e pressione Iniciar jogo.";
    elements.placeMunicipality.textContent = "Itaparica e Vera Cruz";
    elements.placePosition.textContent = "Mapa completo";

    setFeedback(
      "Jogo ainda não iniciado.",
      "Use o formulário acima e clique em “Iniciar jogo”.",
      ""
    );
  }

  function pointsPerCorrectAnswer() {
    if (state.difficulty === "facil") return 10;
    if (state.difficulty === "dificil") return 20;
    return 15;
  }

  function startChallenge() {
    const requestedRounds = Number(elements.rounds.value);
    const totalRounds = Math.min(requestedRounds, PLACES.length);

    state.mode = "challenge";
    state.started = true;
    state.difficulty = elements.difficulty.value;
    state.order = shuffle(PLACES).slice(0, totalRounds);
    state.roundIndex = 0;
    state.score = 0;
    state.correct = 0;
    state.locked = false;
    state.finished = false;

    section.dataset.mode = "challenge";
    updateModeButtons();
    clearHotspotStates();

    elements.modeLabel.textContent =
      state.difficulty === "facil"
        ? "Desafio fácil"
        : state.difficulty === "dificil"
          ? "Desafio difícil"
          : "Desafio médio";

    elements.scoreLabel.textContent = "0 pontos";
    showCurrentTarget();
  }

  function showCurrentTarget() {
    clearHotspotStates();
    lockHotspots(false);

    const target = state.order[state.roundIndex];

    if (!target) {
      finishChallenge();
      return;
    }

    elements.roundLabel.textContent =
      (state.roundIndex + 1) + " de " + state.order.length;

    elements.targetName.textContent = target.name;
    elements.targetClue.textContent =
      state.difficulty === "dificil"
        ? "Encontre a localidade sem pista."
        : target.clue;

    elements.targetCard.hidden = false;
    elements.placeEyebrow.textContent = "DESAFIO EM ANDAMENTO";
    elements.placeName.textContent = "Encontre " + target.name;
    elements.placeDescription.textContent =
      state.difficulty === "dificil"
        ? "Use sua memória da posição da localidade."
        : target.clue;
    elements.placeMunicipality.textContent = "Descubra no mapa";
    elements.placePosition.textContent = "Rodada " + (state.roundIndex + 1);

    setFeedback(
      "Sua vez.",
      "Clique no ponto correspondente a " + target.name + ".",
      ""
    );

    state.locked = false;
    lockHotspots(false);
  }

  function handlePlaceClick(place, button) {
    if (state.mode === "explore") {
      showPlace(place);
      return;
    }

    if (!state.started) {
      setFeedback(
        "Inicie a partida.",
        "Escolha o nível, as rodadas e clique em “Iniciar jogo”.",
        "is-error"
      );
      return;
    }

    if (state.locked || state.finished) return;

    state.locked = true;
    lockHotspots(true);

    const target = state.order[state.roundIndex];
    const correct = place.id === target.id;

    clearHotspotStates();
    lockHotspots(true);

    if (correct) {
      state.correct += 1;
      state.score += pointsPerCorrectAnswer();
      button.classList.add("is-correct");

      elements.scoreLabel.textContent = state.score + " pontos";

      setFeedback(
        "Resposta correta!",
        target.name + " foi localizado no mapa.",
        "is-success"
      );
    } else {
      button.classList.add("is-wrong");

      const correctButton = getHotspot(target.id);
      if (correctButton) correctButton.classList.add("is-correct");

      setFeedback(
        "Quase!",
        "O ponto correto era " + target.name + ". Observe a posição destacada.",
        "is-error"
      );
    }

    window.setTimeout(function () {
      state.roundIndex += 1;

      if (state.roundIndex >= state.order.length) {
        finishChallenge();
      } else {
        showCurrentTarget();
      }
    }, correct ? 900 : 1400);
  }

  function getStudent() {
    const name = document.querySelector("#studentName");
    const className = document.querySelector("#studentClass");

    return {
      name: name && name.value.trim()
        ? name.value.trim()
        : "Estudante sem nome",
      className: className && className.value.trim()
        ? className.value.trim()
        : "Não informada"
    };
  }

  function loadResults() {
    try {
      const stored = JSON.parse(localStorage.getItem(RESULT_KEY) || "[]");
      return Array.isArray(stored) ? stored : [];
    } catch (error) {
      return [];
    }
  }

  function saveMapResult() {
    const student = getStudent();
    const total = state.order.length;
    const percentage = total
      ? Math.round((state.correct / total) * 100)
      : 0;

    const result = {
      id: Date.now(),
      student: student.name,
      className: student.className,
      activity: "Mapa-jogo da Ilha de Itaparica",
      subject: "Geografia e História local",
      correct: state.correct,
      total: total,
      percentage: percentage,
      date: new Date().toLocaleString("pt-BR")
    };

    const results = loadResults();
    results.unshift(result);
    localStorage.setItem(RESULT_KEY, JSON.stringify(results.slice(0, 100)));

    refreshResultsTable();
    return result;
  }

  function refreshResultsTable() {
    const tableBody = document.querySelector("#resultsTableBody");
    const totalActivities = document.querySelector("#totalActivities");
    const averageScore = document.querySelector("#averageScore");
    const bestScore = document.querySelector("#bestScore");
    const results = loadResults();

    if (!tableBody || !totalActivities || !averageScore || !bestScore) return;

    if (!results.length) {
      tableBody.innerHTML =
        '<tr class="empty-row"><td colspan="7">Nenhuma atividade realizada ainda.</td></tr>';
      totalActivities.textContent = "0";
      averageScore.textContent = "0%";
      bestScore.textContent = "0%";
      return;
    }

    const average = Math.round(
      results.reduce(function (sum, item) {
        return sum + Number(item.percentage || 0);
      }, 0) / results.length
    );

    const best = Math.max.apply(
      null,
      results.map(function (item) {
        return Number(item.percentage || 0);
      })
    );

    totalActivities.textContent = String(results.length);
    averageScore.textContent = average + "%";
    bestScore.textContent = best + "%";

    tableBody.innerHTML = results.map(function (item) {
      return (
        "<tr>" +
          "<td>" + escapeHtml(item.student) + "</td>" +
          "<td>" + escapeHtml(item.className) + "</td>" +
          "<td>" + escapeHtml(item.activity) + "</td>" +
          "<td>" + escapeHtml(item.subject) + "</td>" +
          "<td>" + Number(item.correct || 0) + "/" + Number(item.total || 0) + "</td>" +
          '<td><span class="score-pill">' + Number(item.percentage || 0) + "%</span></td>" +
          "<td>" + escapeHtml(item.date) + "</td>" +
        "</tr>"
      );
    }).join("");
  }

  function finishChallenge() {
    state.finished = true;
    state.locked = true;
    elements.targetCard.hidden = true;
    clearHotspotStates();
    lockHotspots(false);

    const result = saveMapResult();

    elements.modeLabel.textContent = "Desafio concluído";
    elements.roundLabel.textContent = state.order.length + " rodadas";
    elements.placeEyebrow.textContent = "MISSÃO CONCLUÍDA";
    elements.placeName.textContent = result.percentage + "% de aproveitamento";
    elements.placeDescription.textContent =
      "Você acertou " + state.correct + " de " + state.order.length +
      " localidades. O resultado foi salvo no relatório.";
    elements.placeMunicipality.textContent = result.subject;
    elements.placePosition.textContent = result.date;

    setFeedback(
      result.percentage >= 70 ? "Excelente exploração!" : "Missão concluída!",
      "Pontuação final: " + state.score + " pontos.",
      result.percentage >= 70 ? "is-success" : ""
    );
  }

  elements.modeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      if (button.dataset.mapMode === "challenge") {
        prepareChallengeMode();
      } else {
        setExploreMode();
      }
    });
  });

  if (elements.settings) {
    elements.settings.addEventListener("submit", function (event) {
      event.preventDefault();
      startChallenge();
    });
  }

  if (elements.resetButton) {
    elements.resetButton.addEventListener("click", setExploreMode);
  }

  renderHotspots();
  setExploreMode();
});
