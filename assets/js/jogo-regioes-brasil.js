document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const REGIONS = {
  "norte": {
    "id": "norte",
    "nome": "Norte",
    "arquivo": "assets/img/jogos/regioes-brasil/regiao-norte.png",
    "x": 1.3,
    "y": 1.65,
    "w": 69.75,
    "h": 47.25,
    "cor": [
      64,
      143,
      112
    ],
    "fato": "É a maior região em extensão territorial e abriga grande parte da Floresta Amazônica."
  },
  "nordeste": {
    "id": "nordeste",
    "nome": "Nordeste",
    "arquivo": "assets/img/jogos/regioes-brasil/regiao-nordeste.png",
    "x": 64.85,
    "y": 17.85,
    "w": 33.45,
    "h": 43.65,
    "cor": [
      255,
      0,
      0
    ],
    "fato": "Reúne nove estados e possui grande diversidade histórica, cultural e ambiental."
  },
  "centro-oeste": {
    "id": "centro-oeste",
    "nome": "Centro-Oeste",
    "arquivo": "assets/img/jogos/regioes-brasil/regiao-centro-oeste.png",
    "x": 31.95,
    "y": 33.0,
    "w": 38.5,
    "h": 41.75,
    "cor": [
      255,
      140,
      77
    ],
    "fato": "Abriga o Distrito Federal, o Pantanal e extensas áreas do Cerrado."
  },
  "sudeste": {
    "id": "sudeste",
    "nome": "Sudeste",
    "arquivo": "assets/img/jogos/regioes-brasil/regiao-sudeste.png",
    "x": 53.2,
    "y": 50.65,
    "w": 31.6,
    "h": 27.2,
    "cor": [
      230,
      236,
      22
    ],
    "fato": "É formada por quatro estados e concentra a maior população do país."
  },
  "sul": {
    "id": "sul",
    "nome": "Sul",
    "arquivo": "assets/img/jogos/regioes-brasil/regiao-sul.png",
    "x": 42.8,
    "y": 70.85,
    "w": 36.6,
    "h": 28.0,
    "cor": [
      144,
      145,
      201
    ],
    "fato": "É formada por Paraná, Santa Catarina e Rio Grande do Sul."
  }
};
  const REGION_ORDER = ["norte", "nordeste", "centro-oeste", "sudeste", "sul"];
  const RESULT_KEY = "veraSaberResults";

  const game = document.querySelector("[data-regions-game]");
  const board = document.querySelector("#regionsBoard");
  const piecesContainer = document.querySelector("#regionsPieces");
  const placedLayer = document.querySelector("#regionsPlacedLayer");
  const hintLayer = document.querySelector("#regionsHintLayer");
  const originalMap = document.querySelector("#regionsOriginalMap");
  const canvas = document.querySelector("#regionsColorCanvas");
  const context = canvas ? canvas.getContext("2d", { willReadFrequently: true }) : null;

  if (!game || !board || !piecesContainer || !placedLayer || !hintLayer || !originalMap || !context) {
    return;
  }

  const elements = {
    difficulty: document.querySelector("#regionsDifficulty"),
    studentName: document.querySelector("#studentName"),
    studentClass: document.querySelector("#studentClass"),
    placedCount: document.querySelector("#regionsPlacedCount"),
    attempts: document.querySelector("#regionsAttempts"),
    timer: document.querySelector("#regionsTimer"),
    score: document.querySelector("#regionsScore"),
    startButton: document.querySelector("#regionsStartButton"),
    hintButton: document.querySelector("#regionsHintButton"),
    resetButton: document.querySelector("#regionsResetButton"),
    boardMessage: document.querySelector("#regionsBoardMessage"),
    trayTitle: document.querySelector("#regionsTrayTitle"),
    trayText: document.querySelector("#regionsTrayText"),
    infoTitle: document.querySelector("#regionsInfoTitle"),
    infoText: document.querySelector("#regionsInfoText"),
    feedback: document.querySelector("#regionsFeedback"),
    result: document.querySelector("#regionsResult"),
    resultText: document.querySelector("#regionsResultText"),
    finalScore: document.querySelector("#regionsFinalScore"),
    playAgain: document.querySelector("#regionsPlayAgain"),
    printResult: document.querySelector("#regionsPrintResult")
  };

  const state = {
    phase: "preview",
    selected: null,
    placed: new Set(),
    attempts: 0,
    mistakes: 0,
    hints: 0,
    startedAt: null,
    timerId: null,
    elapsedSeconds: 0,
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

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const remaining = (seconds % 60).toString().padStart(2, "0");
    return minutes + ":" + remaining;
  }

  function currentScore() {
    const difficulty = elements.difficulty.value;
    const mistakePenalty = difficulty === "facil" ? 5 : difficulty === "desafio" ? 10 : 7;
    const hintPenalty = difficulty === "facil" ? 2 : 5;
    const timePenalty = Math.floor(state.elapsedSeconds / 20);

    return Math.max(
      10,
      100 - state.mistakes * mistakePenalty - state.hints * hintPenalty - timePenalty
    );
  }

  function updateStats() {
    elements.placedCount.textContent = String(
      state.phase === "preview" ? REGION_ORDER.length : state.placed.size
    );
    elements.attempts.textContent = String(state.attempts);
    elements.timer.textContent = formatTime(state.elapsedSeconds);
    elements.score.textContent = String(currentScore());
  }

  function startTimer() {
    if (state.startedAt || state.finished || state.phase !== "playing") return;

    state.startedAt = Date.now();
    state.timerId = window.setInterval(function () {
      state.elapsedSeconds = Math.floor((Date.now() - state.startedAt) / 1000);
      updateStats();
    }, 1000);
  }

  function stopTimer() {
    if (state.timerId) {
      window.clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function setFeedback(title, message, type) {
    elements.feedback.classList.remove("is-success", "is-error");

    if (type) {
      elements.feedback.classList.add(type);
    }

    elements.feedback.innerHTML =
      "<strong>" + escapeHtml(title) + "</strong>" +
      "<p>" + escapeHtml(message) + "</p>";
  }

  function positionImage(imageElement, region) {
    imageElement.style.left = region.x + "%";
    imageElement.style.top = region.y + "%";
    imageElement.style.width = region.w + "%";
    imageElement.style.height = region.h + "%";
  }

  function createMapPiece(regionId, className) {
    const region = REGIONS[regionId];
    const image = document.createElement("img");

    image.className = className;
    image.src = region.arquivo;
    image.alt = className === "region-piece-placed"
      ? "Região " + region.nome + " posicionada corretamente"
      : "";
    positionImage(image, region);

    return image;
  }

  function renderCompleteMap() {
    placedLayer.replaceChildren();

    const exits = [
      ["-125%", "-55%", "-18deg"],
      ["125%", "-50%", "17deg"],
      ["-125%", "15%", "-13deg"],
      ["125%", "24%", "14deg"],
      ["5%", "135%", "9deg"]
    ];

    REGION_ORDER.forEach(function (regionId, index) {
      const image = createMapPiece(regionId, "region-piece-preview");
      image.style.setProperty("--exit-x", exits[index][0]);
      image.style.setProperty("--exit-y", exits[index][1]);
      image.style.setProperty("--exit-rotate", exits[index][2]);
      image.style.setProperty("--exit-delay", (index * 45) + "ms");
      placedLayer.appendChild(image);
    });
  }

  function createPieceCard(regionId, index) {
    const region = REGIONS[regionId];
    const button = document.createElement("button");

    button.type = "button";
    button.className = "region-piece-card";
    button.dataset.region = regionId;
    button.draggable = true;
    button.style.animationDelay = (index * 65) + "ms";
    button.setAttribute("aria-label", "Peça da região " + region.nome);

    button.innerHTML = `
      <img src="${region.arquivo}" alt="" draggable="false">
      <span>
        <strong>${escapeHtml(region.nome)}</strong>
        <small>Leve esta peça até o mapa</small>
      </span>
    `;

    button.addEventListener("click", function () {
      selectPiece(regionId);
    });

    button.addEventListener("dragstart", function (event) {
      if (state.phase !== "playing") {
        event.preventDefault();
        return;
      }

      selectPiece(regionId);
      startTimer();
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", regionId);
    });

    button.addEventListener("dragend", function () {
      board.classList.remove("is-ready");
    });

    return button;
  }

  function renderTray() {
    const order = shuffle(REGION_ORDER);
    piecesContainer.replaceChildren(
      ...order.map(function (regionId, index) {
        return createPieceCard(regionId, index);
      })
    );
  }

  function selectPiece(regionId) {
    if (
      state.phase !== "playing" ||
      state.placed.has(regionId) ||
      state.finished
    ) {
      return;
    }

    state.selected = regionId;
    startTimer();

    piecesContainer.querySelectorAll(".region-piece-card").forEach(function (card) {
      card.classList.toggle("is-selected", card.dataset.region === regionId);
    });

    board.classList.add("is-ready");
    elements.boardMessage.textContent =
      "Leve a região " + REGIONS[regionId].nome + " para o local correto";

    elements.infoTitle.textContent = REGIONS[regionId].nome;
    elements.infoText.textContent =
      "Observe o formato da peça e encontre onde ela completa a silhueta do Brasil.";

    setFeedback(
      "Peça selecionada",
      "Arraste a peça ou toque no local em que ela deve encaixar.",
      ""
    );
  }

  function drawOriginalMap() {
    canvas.width = originalMap.naturalWidth || 2000;
    canvas.height = originalMap.naturalHeight || 2000;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(originalMap, 0, 0, canvas.width, canvas.height);
  }

  function nearestRegionColor(red, green, blue) {
    let nearest = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    REGION_ORDER.forEach(function (regionId) {
      const color = REGIONS[regionId].cor;
      const distance =
        Math.pow(red - color[0], 2) +
        Math.pow(green - color[1], 2) +
        Math.pow(blue - color[2], 2);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = regionId;
      }
    });

    return nearestDistance < 12000 ? nearest : null;
  }

  function regionAtPoint(clientX, clientY) {
    const rectangle = board.getBoundingClientRect();
    const normalizedX = (clientX - rectangle.left) / rectangle.width;
    const normalizedY = (clientY - rectangle.top) / rectangle.height;

    if (
      normalizedX < 0 ||
      normalizedX > 1 ||
      normalizedY < 0 ||
      normalizedY > 1
    ) {
      return null;
    }

    const centerX = Math.round(normalizedX * (canvas.width - 1));
    const centerY = Math.round(normalizedY * (canvas.height - 1));
    const radius = 13;
    const startX = Math.max(0, centerX - radius);
    const startY = Math.max(0, centerY - radius);
    const sampleWidth = Math.min(canvas.width - startX, radius * 2 + 1);
    const sampleHeight = Math.min(canvas.height - startY, radius * 2 + 1);
    const pixels = context.getImageData(
      startX,
      startY,
      sampleWidth,
      sampleHeight
    ).data;

    const counts = {};

    for (let index = 0; index < pixels.length; index += 4) {
      const regionId = nearestRegionColor(
        pixels[index],
        pixels[index + 1],
        pixels[index + 2]
      );

      if (regionId) {
        counts[regionId] = (counts[regionId] || 0) + 1;
      }
    }

    let result = null;
    let largest = 0;

    Object.entries(counts).forEach(function ([regionId, count]) {
      if (count > largest) {
        largest = count;
        result = regionId;
      }
    });

    return result;
  }

  function markPiecePlaced(regionId) {
    const card = piecesContainer.querySelector(
      '[data-region="' + regionId + '"]'
    );

    if (card) {
      card.classList.add("is-placed");
      card.classList.remove("is-selected");
    }
  }

  function addPlacedPiece(regionId) {
    placedLayer.appendChild(
      createMapPiece(regionId, "region-piece-placed")
    );
  }

  function clearHint() {
    hintLayer.replaceChildren();
  }

  function showHint() {
    if (
      state.phase !== "playing" ||
      !state.selected ||
      state.placed.has(state.selected) ||
      state.finished
    ) {
      setFeedback(
        "Selecione uma peça",
        "Escolha uma região antes de pedir uma dica.",
        "is-error"
      );
      return;
    }

    state.hints += 1;
    updateStats();
    clearHint();

    const image = createMapPiece(state.selected, "region-piece-hint");
    hintLayer.appendChild(image);

    window.setTimeout(clearHint, 1800);

    setFeedback(
      "Dica mostrada",
      "A área correta foi iluminada por alguns segundos.",
      ""
    );
  }

  function attemptPlacement(regionId, clientX, clientY) {
    if (
      state.phase !== "playing" ||
      !regionId ||
      state.finished ||
      state.placed.has(regionId)
    ) {
      return;
    }

    startTimer();
    state.attempts += 1;

    const targetRegion = regionAtPoint(clientX, clientY);

    if (targetRegion === regionId) {
      state.placed.add(regionId);
      addPlacedPiece(regionId);
      markPiecePlaced(regionId);
      clearHint();

      state.selected = null;
      board.classList.remove("is-ready");
      elements.boardMessage.textContent =
        REGIONS[regionId].nome + " encaixou corretamente";

      elements.infoTitle.textContent = REGIONS[regionId].nome;
      elements.infoText.textContent = REGIONS[regionId].fato;

      setFeedback(
        "Encaixe correto!",
        "A região " + REGIONS[regionId].nome + " completou esta parte do mapa.",
        "is-success"
      );

      updateStats();

      if (state.placed.size === REGION_ORDER.length) {
        finishGame();
      }
    } else {
      state.mistakes += 1;
      board.classList.remove("is-wrong");
      void board.offsetWidth;
      board.classList.add("is-wrong");

      elements.boardMessage.textContent =
        "Essa não é a posição da região " + REGIONS[regionId].nome;

      setFeedback(
        "Ainda não encaixou",
        "Tente outra parte da silhueta. A peça só fica no mapa quando estiver correta.",
        "is-error"
      );

      updateStats();
    }
  }

  function beginGame() {
    if (state.phase !== "preview") return;

    state.phase = "starting";
    game.dataset.phase = "starting";
    elements.startButton.disabled = true;
    elements.difficulty.disabled = true;
    elements.hintButton.disabled = true;

    elements.boardMessage.textContent = "As peças estão saindo do mapa...";
    setFeedback(
      "Prepare-se",
      "As regiões irão para a bandeja. Depois, monte o Brasil novamente.",
      ""
    );

    placedLayer.querySelectorAll(".region-piece-preview").forEach(function (piece) {
      piece.classList.add("is-exiting");
    });

    window.setTimeout(function () {
      state.phase = "playing";
      game.dataset.phase = "playing";
      state.placed = new Set();
      state.selected = null;
      state.attempts = 0;
      state.mistakes = 0;
      state.hints = 0;
      state.elapsedSeconds = 0;
      state.startedAt = null;
      state.finished = false;

      placedLayer.replaceChildren();
      renderTray();

      elements.trayTitle.textContent = "Escolha uma região";
      elements.trayText.textContent =
        "Arraste uma peça ou toque nela para selecioná-la.";
      elements.boardMessage.textContent =
        "O mapa está sem linhas. Coloque as cinco regiões no lugar correto.";
      elements.infoTitle.textContent = "Monte o Brasil";
      elements.infoText.textContent =
        "As divisões internas desapareceram. Use apenas o formato das peças e a silhueta.";
      elements.hintButton.disabled = false;

      startTimer();
      updateStats();

      setFeedback(
        "Jogo iniciado",
        "Escolha a primeira peça e tente encaixá-la na silhueta.",
        ""
      );
    }, 850);
  }

  function getStudent() {
    return {
      name:
        elements.studentName && elements.studentName.value.trim()
          ? elements.studentName.value.trim()
          : "Visitante",
      className:
        elements.studentClass && elements.studentClass.value.trim()
          ? elements.studentClass.value.trim()
          : "Sem categoria"
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

  function saveResult(finalScore) {
    const student = getStudent();
    const result = {
      id: Date.now(),
      student: student.name,
      className: student.className,
      activity: "Quebra-cabeça das Regiões do Brasil",
      subject: "Geografia",
      correct: 5,
      total: 5,
      percentage: finalScore,
      date: new Date().toLocaleString("pt-BR")
    };

    const results = loadResults();
    results.unshift(result);
    localStorage.setItem(RESULT_KEY, JSON.stringify(results.slice(0, 100)));
  }

  function refreshMissionResultsTable() {
    const tableBody = document.querySelector("#resultsTableBody");
    const totalActivities = document.querySelector("#totalActivities");
    const averageScore = document.querySelector("#averageScore");
    const bestScore = document.querySelector("#bestScore");
    const results = loadResults();

    if (!tableBody || !totalActivities || !averageScore || !bestScore) return;

    if (!results.length) {
      tableBody.innerHTML =
        '<tr class="empty-row"><td colspan="7">Nenhum jogo concluído ainda.</td></tr>';
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

  function finishGame() {
    state.phase = "finished";
    state.finished = true;
    game.dataset.phase = "finished";
    stopTimer();
    clearHint();

    const finalScore = currentScore();
    const student = getStudent();

    elements.finalScore.textContent = String(finalScore);
    elements.resultText.textContent =
      student.name + " montou as cinco regiões em " +
      formatTime(state.elapsedSeconds) + ", usando " +
      state.attempts + " tentativa" +
      (state.attempts === 1 ? "" : "s") + ".";

    elements.result.hidden = false;
    elements.hintButton.disabled = true;
    elements.boardMessage.textContent =
      "Parabéns! As cinco regiões estão encaixadas.";

    saveResult(finalScore);
    refreshMissionResultsTable();

    setFeedback(
      "Missão concluída!",
      "O mapa do Brasil foi montado corretamente.",
      "is-success"
    );

    window.setTimeout(function () {
      elements.result.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 300);
  }

  function showPreview() {
    stopTimer();

    state.phase = "preview";
    state.selected = null;
    state.placed = new Set();
    state.attempts = 0;
    state.mistakes = 0;
    state.hints = 0;
    state.startedAt = null;
    state.timerId = null;
    state.elapsedSeconds = 0;
    state.finished = false;

    game.dataset.phase = "preview";
    game.dataset.difficulty = elements.difficulty.value;

    piecesContainer.replaceChildren();
    clearHint();
    renderCompleteMap();

    board.classList.remove("is-ready", "is-wrong");
    elements.startButton.disabled = false;
    elements.difficulty.disabled = false;
    elements.hintButton.disabled = true;

    elements.trayTitle.textContent = "Aguardando o início";
    elements.trayText.textContent =
      "Clique em “Iniciar jogo” para retirar as regiões do mapa.";
    elements.boardMessage.textContent =
      "Observe o mapa completo e clique em “Iniciar jogo”";
    elements.infoTitle.textContent = "Observe antes de jogar";
    elements.infoText.textContent =
      "Memorize a posição das cinco regiões. Durante a partida, o mapa ficará sem linhas internas.";
    elements.result.hidden = true;

    setFeedback(
      "Mapa completo",
      "Quando o jogo começar, as peças sairão e você precisará encaixá-las novamente.",
      ""
    );

    updateStats();
  }

  board.addEventListener("dragover", function (event) {
    if (state.phase !== "playing") return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    board.classList.add("is-ready");
  });

  board.addEventListener("dragleave", function (event) {
    if (!board.contains(event.relatedTarget)) {
      board.classList.remove("is-ready");
    }
  });

  board.addEventListener("drop", function (event) {
    if (state.phase !== "playing") return;

    event.preventDefault();
    board.classList.remove("is-ready");

    const regionId =
      event.dataTransfer.getData("text/plain") ||
      state.selected;

    attemptPlacement(regionId, event.clientX, event.clientY);
  });

  board.addEventListener("click", function (event) {
    if (state.phase !== "playing" || !state.selected || state.finished) return;
    attemptPlacement(state.selected, event.clientX, event.clientY);
  });

  elements.startButton.addEventListener("click", beginGame);
  elements.hintButton.addEventListener("click", showHint);
  elements.resetButton.addEventListener("click", showPreview);
  elements.playAgain.addEventListener("click", function () {
    showPreview();
    document.querySelector("#quebra-cabeca-regioes").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });

  elements.printResult.addEventListener("click", function () {
    window.print();
  });

  elements.difficulty.addEventListener("change", function () {
    game.dataset.difficulty = elements.difficulty.value;
    showPreview();
  });

  if (originalMap.complete && originalMap.naturalWidth) {
    drawOriginalMap();
  } else {
    originalMap.addEventListener("load", drawOriginalMap, { once: true });
  }

  showPreview();
});
