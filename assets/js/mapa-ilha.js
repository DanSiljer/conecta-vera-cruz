document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const section = document.querySelector("#mapa-jogo");
  const hotspotLayer = document.querySelector("#islandMapHotspots");

  if (!section || !hotspotLayer) return;

  const RESULT_KEY = "veraSaberResults";

  /*
   * As posições são aproximações educativas sobre a imagem já usada na página.
   * left e top são percentuais relativos ao quadro do mapa.
   */
  const PLACES = [
    {
      id: "itaparica",
      name: "Itaparica",
      municipality: "Itaparica",
      position: "Norte da ilha",
      left: 31,
      top: 18,
      clue: "Procure a área urbana no norte da ilha.",
      description: "Sede do município de Itaparica, no extremo norte da ilha."
    },
    {
      id: "ponta-de-areia",
      name: "Ponta de Areia",
      municipality: "Itaparica",
      position: "Nordeste da ilha",
      left: 60,
      top: 10,
      clue: "Observe a parte superior e direita do mapa.",
      description: "Localidade situada na faixa nordeste da Ilha de Itaparica."
    },
    {
      id: "amoreiras",
      name: "Amoreiras",
      municipality: "Itaparica",
      position: "Nordeste da ilha",
      left: 67,
      top: 17,
      clue: "Fica próxima de Ponta de Areia.",
      description: "Comunidade litorânea do município de Itaparica."
    },
    {
      id: "manguinhos",
      name: "Manguinhos",
      municipality: "Itaparica",
      position: "Leste, porção norte",
      left: 82,
      top: 24,
      clue: "Procure o litoral leste, acima de Porto dos Santos.",
      description: "Localidade costeira na porção norte da ilha."
    },
    {
      id: "porto-dos-santos",
      name: "Porto dos Santos",
      municipality: "Itaparica",
      position: "Leste, porção norte",
      left: 84,
      top: 35,
      clue: "Fica na costa leste, abaixo de Manguinhos.",
      description: "Comunidade localizada na costa leste do município de Itaparica."
    },
    {
      id: "bom-despacho",
      name: "Bom Despacho",
      municipality: "Itaparica",
      position: "Leste da ilha",
      left: 86,
      top: 45,
      clue: "Procure a área do terminal do ferry-boat.",
      description: "Importante ponto de chegada e saída pelo sistema ferry-boat."
    },
    {
      id: "gameleira",
      name: "Gameleira",
      municipality: "Vera Cruz",
      position: "Leste, área central",
      left: 88,
      top: 54,
      clue: "Fica abaixo de Bom Despacho, no lado leste.",
      description: "Comunidade de Vera Cruz próxima à costa leste da ilha."
    },
    {
      id: "mar-grande",
      name: "Mar Grande",
      municipality: "Vera Cruz",
      position: "Leste, área central",
      left: 89,
      top: 61,
      clue: "Procure a sede de Vera Cruz na costa leste.",
      description: "Sede administrativa de Vera Cruz e importante ponto de travessia marítima."
    },
    {
      id: "baiacu",
      name: "Baiacu",
      municipality: "Vera Cruz",
      position: "Contracosta, área central",
      left: 54,
      top: 61,
      clue: "Observe o lado oeste da parte central da ilha.",
      description: "Comunidade tradicional pesqueira ligada à antiga Vila do Senhor da Vera Cruz."
    },
    {
      id: "penha",
      name: "Penha",
      municipality: "Vera Cruz",
      position: "Leste, área central",
      left: 81,
      top: 67,
      clue: "Fica na costa leste, abaixo de Mar Grande.",
      description: "Localidade conhecida pela praia, pelo rio e pelas ruínas do antigo forno de cal."
    },
    {
      id: "gamboa",
      name: "Gamboa",
      municipality: "Vera Cruz",
      position: "Contracosta, área central",
      left: 45,
      top: 69,
      clue: "Procure a contracosta, próxima de Baiacu.",
      description: "Comunidade ligada à mariscagem, ao samba de roda e aos saberes do mar."
    },
    {
      id: "matarandiba",
      name: "Matarandiba",
      municipality: "Vera Cruz",
      position: "Oeste, porção sul",
      left: 29,
      top: 79,
      clue: "Procure uma localidade insular no lado oeste.",
      description: "Vila pesqueira e de marisqueiras com forte memória comunitária."
    },
    {
      id: "jiribatuba",
      name: "Jiribatuba",
      municipality: "Vera Cruz",
      position: "Centro-sul",
      left: 51,
      top: 77,
      clue: "Observe a região central na metade sul da ilha.",
      description: "Distrito marcado por paisagem costeira, fé, pesca e memória comunitária."
    },
    {
      id: "catu",
      name: "Catu",
      municipality: "Vera Cruz",
      position: "Sul da ilha",
      left: 58,
      top: 82,
      clue: "Fica ao sul de Jiribatuba.",
      description: "Povoado antigo ligado à Fazenda Santo Amaro do Catu e à Praia do Calado."
    },
    {
      id: "tairu",
      name: "Tairu",
      municipality: "Vera Cruz",
      position: "Sudeste da ilha",
      left: 80,
      top: 78,
      clue: "Procure o litoral sudeste.",
      description: "Localidade conhecida pela praia e pela ocupação litorânea."
    },
    {
      id: "berlinque",
      name: "Berlinque",
      municipality: "Vera Cruz",
      position: "Sudeste da ilha",
      left: 76,
      top: 84,
      clue: "Fica no lado sudeste, abaixo de Tairu.",
      description: "Comunidade costeira localizada na porção sul de Vera Cruz."
    },
    {
      id: "cacha-pregos",
      name: "Cacha-Pregos",
      municipality: "Vera Cruz",
      position: "Extremo sul",
      left: 63,
      top: 93,
      clue: "Procure a extremidade sul da ilha.",
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
    startButton: section.querySelector("#startMapChallenge"),
    feedback: section.querySelector("#mapFeedback"),
    resetButton: section.querySelector("#resetMapGame")
  };

  const state = {
    mode: "explore",
    difficulty: "medio",
    order: [],
    roundIndex: 0,
    score: 0,
    correct: 0,
    locked: false,
    finished: false
  };

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

  function setFeedback(title, message, type) {
    if (!elements.feedback) return;

    elements.feedback.classList.remove("is-success", "is-error");
    if (type) elements.feedback.classList.add(type);

    elements.feedback.innerHTML =
      "<strong>" + escapeHtml(title) + "</strong>" +
      "<p>" + escapeHtml(message) + "</p>";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
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

    if (state.mode === "explore") {
      setFeedback(
        "Exploração livre",
        "Observe a posição de " + place.name + " e escolha outro ponto quando desejar.",
        ""
      );
    }
  }

  function renderHotspots() {
    hotspotLayer.innerHTML = "";

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
    state.order = [];
    state.roundIndex = 0;
    state.score = 0;
    state.correct = 0;
    state.locked = false;
    state.finished = false;

    section.dataset.mode = "explore";
    section.dataset.difficulty = "facil";

    updateModeButtons();
    clearHotspotStates();

    elements.modeLabel.textContent = "Exploração livre";
    elements.scoreLabel.textContent = "0 pontos";
    elements.roundLabel.textContent = "Livre";
    elements.targetCard.hidden = true;

    elements.placeEyebrow.textContent = "COMECE EXPLORANDO";
    elements.placeName.textContent = "Clique em um marcador";
    elements.placeDescription.textContent =
      "Cada ponto apresenta uma comunidade ou localidade indicada no mapa da ilha.";
    elements.placeMunicipality.textContent = "Itaparica ou Vera Cruz";
    elements.placePosition.textContent = "Norte, centro ou sul da ilha";

    setFeedback(
      "Modo exploração ativado.",
      "Toque nos marcadores para conhecer a ilha antes de jogar.",
      ""
    );
  }

  function prepareChallengeMode() {
    state.mode = "challenge";
    state.order = [];
    state.roundIndex = 0;
    state.score = 0;
    state.correct = 0;
    state.locked = false;
    state.finished = false;

    section.dataset.mode = "challenge";
    section.dataset.difficulty = elements.difficulty.value;

    updateModeButtons();
    clearHotspotStates();

    elements.modeLabel.textContent = "Preparando desafio";
    elements.scoreLabel.textContent = "0 pontos";
    elements.roundLabel.textContent = "Aguardando início";
    elements.targetCard.hidden = true;

    setFeedback(
      "Configure o desafio.",
      "Escolha o nível e o número de rodadas e clique em “Iniciar jogo”.",
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
    state.difficulty = elements.difficulty.value;
    state.order = shuffle(PLACES).slice(0, totalRounds);
    state.roundIndex = 0;
    state.score = 0;
    state.correct = 0;
    state.locked = false;
    state.finished = false;

    section.dataset.mode = "challenge";
    section.dataset.difficulty = state.difficulty;

    clearHotspotStates();
    updateModeButtons();

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
      state.difficulty === "facil"
        ? "Os nomes permanecem visíveis. Clique no marcador correto."
        : state.difficulty === "dificil"
          ? "Os nomes ficam escondidos. Use sua memória do mapa."
          : target.clue;
    elements.placeMunicipality.textContent = "Descubra no mapa";
    elements.placePosition.textContent = "Rodada " + (state.roundIndex + 1);

    setFeedback(
      "Sua vez.",
      "Clique no ponto correspondente a " + target.name + ".",
      ""
    );

    state.locked = false;
  }

  function handlePlaceClick(place, button) {
    if (state.mode === "explore" || !state.order.length || state.finished) {
      showPlace(place);
      return;
    }

    if (state.locked) return;
    state.locked = true;

    const target = state.order[state.roundIndex];
    const correct = place.id === target.id;

    clearHotspotStates();

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
        "O ponto correto era " + target.name + ". Observe a posição antes da próxima rodada.",
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
    }, correct ? 850 : 1250);
  }

  function getStudent() {
    const name = document.querySelector("#studentName");
    const className = document.querySelector("#studentClass");

    return {
      name: name && name.value.trim() ? name.value.trim() : "Estudante sem nome",
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

    const result = saveMapResult();

    elements.modeLabel.textContent = "Desafio concluído";
    elements.roundLabel.textContent = state.order.length + " rodadas";
    elements.placeEyebrow.textContent = "MISSÃO CONCLUÍDA";
    elements.placeName.textContent = result.percentage + "% de aproveitamento";
    elements.placeDescription.textContent =
      "Você acertou " + state.correct + " de " + state.order.length +
      " localidades. O resultado foi salvo no relatório da página.";
    elements.placeMunicipality.textContent = result.subject;
    elements.placePosition.textContent = result.date;

    setFeedback(
      result.percentage >= 70 ? "Excelente exploração!" : "Missão concluída!",
      "Pontuação final: " + state.score + " pontos. Use o modo exploração e tente novamente quando desejar.",
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

  if (elements.difficulty) {
    elements.difficulty.addEventListener("change", function () {
      section.dataset.difficulty = elements.difficulty.value;
    });
  }

  renderHotspots();
  setExploreMode();
});
