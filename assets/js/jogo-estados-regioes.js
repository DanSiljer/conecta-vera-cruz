document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const REGION_GAMES = {"norte": {"id": "norte", "name": "Região Norte", "fact": "A Região Norte é a maior do Brasil em extensão territorial e abriga grande parte da Floresta Amazônica.", "note": "", "silhouette": "assets/img/jogos/estados-regioes/norte-silhueta.png", "mask": "assets/img/jogos/estados-regioes/norte-mask.png", "preview": "assets/img/jogos/estados-regioes/norte-preview.png", "ratio": 1.4559, "count": 7, "states": [{"id": "AC", "name": "Acre", "abbr": "AC", "piece": "assets/img/jogos/estados-regioes/norte-ac.png", "x": 1.8093, "y": 68.1864, "w": 24.4259, "h": 18.1358, "color": [234, 76, 137]}, {"id": "AM", "name": "Amazonas", "abbr": "AM", "piece": "assets/img/jogos/estados-regioes/norte-am.png", "x": 2.366, "y": 18.0344, "w": 59.499, "h": 61.0942, "color": [70, 154, 255]}, {"id": "AP", "name": "Amapá", "abbr": "AP", "piece": "assets/img/jogos/estados-regioes/norte-ap.png", "x": 67.9889, "y": 7.2948, "w": 16.6319, "h": 26.7477, "color": [250, 180, 55]}, {"id": "PA", "name": "Pará", "abbr": "PA", "piece": "assets/img/jogos/estados-regioes/norte-pa.png", "x": 53.0967, "y": 15.8055, "w": 44.746, "h": 62.1074, "color": [78, 190, 120]}, {"id": "RO", "name": "Rondônia", "abbr": "RO", "piece": "assets/img/jogos/estados-regioes/norte-ro.png", "x": 26.9311, "y": 69.7062, "w": 23.2429, "h": 27.6596, "color": [162, 108, 248]}, {"id": "RR", "name": "Roraima", "abbr": "RR", "piece": "assets/img/jogos/estados-regioes/norte-rr.png", "x": 33.055, "y": 2.6342, "w": 19.9722, "h": 32.8267, "color": [249, 110, 71]}, {"id": "TO", "name": "Tocantins", "abbr": "TO", "piece": "assets/img/jogos/estados-regioes/norte-to.png", "x": 81.6284, "y": 54.8126, "w": 16.5623, "h": 41.1348, "color": [27, 182, 198]}]}, "nordeste": {"id": "nordeste", "name": "Região Nordeste", "fact": "A Região Nordeste reúne nove estados e possui forte diversidade cultural, histórica e ambiental.", "note": "", "silhouette": "assets/img/jogos/estados-regioes/nordeste-silhueta.png", "mask": "assets/img/jogos/estados-regioes/nordeste-mask.png", "preview": "assets/img/jogos/estados-regioes/nordeste-preview.png", "ratio": 0.777, "count": 9, "states": [{"id": "AL", "name": "Alagoas", "abbr": "AL", "piece": "assets/img/jogos/estados-regioes/nordeste-al.png", "x": 73.1364, "y": 46.9945, "w": 19.9719, "h": 8.1967, "color": [234, 76, 137]}, {"id": "BA", "name": "Bahia", "abbr": "BA", "piece": "assets/img/jogos/estados-regioes/nordeste-ba.png", "x": 15.1899, "y": 44.5902, "w": 61.4627, "h": 52.5683, "color": [70, 154, 255]}, {"id": "CE", "name": "Ceará", "abbr": "CE", "piece": "assets/img/jogos/estados-regioes/nordeste-ce.png", "x": 52.602, "y": 13.0055, "w": 27.4262, "h": 26.8852, "color": [250, 180, 55]}, {"id": "MA", "name": "Maranhão", "abbr": "MA", "piece": "assets/img/jogos/estados-regioes/nordeste-ma.png", "x": 3.6568, "y": 2.8415, "w": 45.8509, "h": 48.7432, "color": [78, 190, 120]}, {"id": "PB", "name": "Paraíba", "abbr": "PB", "piece": "assets/img/jogos/estados-regioes/nordeste-pb.png", "x": 70.8861, "y": 31.4754, "w": 25.4571, "h": 11.694, "color": [162, 108, 248]}, {"id": "PE", "name": "Pernambuco", "abbr": "PE", "piece": "assets/img/jogos/estados-regioes/nordeste-pe.png", "x": 53.1646, "y": 37.9235, "w": 43.038, "h": 10.8197, "color": [249, 110, 71]}, {"id": "PI", "name": "Piauí", "abbr": "PI", "piece": "assets/img/jogos/estados-regioes/nordeste-pi.png", "x": 19.8312, "y": 12.7869, "w": 38.1153, "h": 42.2951, "color": [27, 182, 198]}, {"id": "RN", "name": "Rio Grande do Norte", "abbr": "RN", "piece": "assets/img/jogos/estados-regioes/nordeste-rn.png", "x": 71.8706, "y": 24.918, "w": 23.3474, "h": 11.1475, "color": [255, 91, 173]}, {"id": "SE", "name": "Sergipe", "abbr": "SE", "piece": "assets/img/jogos/estados-regioes/nordeste-se.png", "x": 72.5738, "y": 50.8197, "w": 11.2518, "h": 10.0546, "color": [150, 201, 61]}]}, "centro-oeste": {"id": "centro-oeste", "name": "Região Centro-Oeste", "fact": "A Região Centro-Oeste abriga o Cerrado, o Pantanal e a capital do país, Brasília, no Distrito Federal.", "note": "Neste jogo, Goiás representa o território central da região. O Distrito Federal aparece na explicação, por ser muito pequeno no mapa-base.", "silhouette": "assets/img/jogos/estados-regioes/centro-oeste-silhueta.png", "mask": "assets/img/jogos/estados-regioes/centro-oeste-mask.png", "preview": "assets/img/jogos/estados-regioes/centro-oeste-preview.png", "ratio": 0.9259, "count": 3, "states": [{"id": "GO", "name": "Goiás", "abbr": "GO", "piece": "assets/img/jogos/estados-regioes/centro-oeste-go.png", "x": 53.6946, "y": 31.5849, "w": 43.1034, "h": 39.2246, "color": [234, 76, 137]}, {"id": "MS", "name": "Mato Grosso do Sul", "abbr": "MS", "piece": "assets/img/jogos/estados-regioes/centro-oeste-ms.png", "x": 25.2463, "y": 58.4949, "w": 40.8867, "h": 38.5405, "color": [70, 154, 255]}, {"id": "MT", "name": "Mato Grosso", "abbr": "MT", "piece": "assets/img/jogos/estados-regioes/centro-oeste-mt.png", "x": 3.202, "y": 2.9647, "w": 68.1034, "h": 59.6351, "color": [250, 180, 55]}]}, "sudeste": {"id": "sudeste", "name": "Região Sudeste", "fact": "A Região Sudeste concentra a maior população do país e reúne quatro estados importantes para a economia brasileira.", "note": "", "silhouette": "assets/img/jogos/estados-regioes/sudeste-silhueta.png", "mask": "assets/img/jogos/estados-regioes/sudeste-mask.png", "preview": "assets/img/jogos/estados-regioes/sudeste-preview.png", "ratio": 1.1502, "count": 4, "states": [{"id": "ES", "name": "Espírito Santo", "abbr": "ES", "piece": "assets/img/jogos/estados-regioes/sudeste-es.png", "x": 80.8605, "y": 37.2014, "w": 15.2819, "h": 27.3038, "color": [234, 76, 137]}, {"id": "MG", "name": "Minas Gerais", "abbr": "MG", "piece": "assets/img/jogos/estados-regioes/sudeste-mg.png", "x": 17.0623, "y": 4.4369, "w": 78.7834, "h": 72.0137, "color": [70, 154, 255]}, {"id": "RJ", "name": "Rio de Janeiro", "abbr": "RJ", "piece": "assets/img/jogos/estados-regioes/sudeste-rj.png", "x": 58.6053, "y": 61.9454, "w": 26.5579, "h": 17.4061, "color": [250, 180, 55]}, {"id": "SP", "name": "São Paulo", "abbr": "SP", "piece": "assets/img/jogos/estados-regioes/sudeste-sp.png", "x": 3.8576, "y": 50.5119, "w": 58.7537, "h": 45.0512, "color": [78, 190, 120]}]}, "sul": {"id": "sul", "name": "Região Sul", "fact": "A Região Sul é formada por três estados e apresenta forte presença das planícies, planaltos e clima subtropical.", "note": "", "silhouette": "assets/img/jogos/estados-regioes/sul-silhueta.png", "mask": "assets/img/jogos/estados-regioes/sul-mask.png", "preview": "assets/img/jogos/estados-regioes/sul-preview.png", "ratio": 0.7774, "count": 3, "states": [{"id": "PR", "name": "Paraná", "abbr": "PR", "piece": "assets/img/jogos/estados-regioes/sul-pr.png", "x": 32.906, "y": 4.3189, "w": 61.5385, "h": 33.0565, "color": [234, 76, 137]}, {"id": "SC", "name": "Santa Catarina", "abbr": "SC", "piece": "assets/img/jogos/estados-regioes/sul-sc.png", "x": 41.0256, "y": 33.2226, "w": 49.1453, "h": 26.2458, "color": [70, 154, 255]}, {"id": "RS", "name": "Rio Grande do Sul", "abbr": "RS", "piece": "assets/img/jogos/estados-regioes/sul-rs.png", "x": 5.5556, "y": 42.0266, "w": 72.0085, "h": 53.6545, "color": [250, 180, 55]}]}};
  const REGION_ORDER = ["norte", "nordeste", "centro-oeste", "sudeste", "sul"];
  const RESULT_KEY = "veraSaberResults";

  const game = document.querySelector("[data-states-region-game]");
  if (!game) return;

  const board = document.querySelector("#stateBoard");
  const boardBase = document.querySelector("#stateBoardBase");
  const piecesContainer = document.querySelector("#statePieces");
  const placedLayer = document.querySelector("#statePlacedLayer");
  const hintLayer = document.querySelector("#stateHintLayer");
  const tabs = Array.from(document.querySelectorAll("[data-region-tab]"));
  const maskCanvas = document.createElement("canvas");
  const maskContext = maskCanvas.getContext("2d", { willReadFrequently: true });
  const maskImage = new Image();

  const elements = {
    placedCount: document.querySelector("#statePlacedCount"),
    totalCount: document.querySelector("#stateTotalCount"),
    attempts: document.querySelector("#stateAttempts"),
    timer: document.querySelector("#stateTimer"),
    score: document.querySelector("#stateScore"),
    startButton: document.querySelector("#stateStartButton"),
    hintButton: document.querySelector("#stateHintButton"),
    resetButton: document.querySelector("#stateResetButton"),
    trayTitle: document.querySelector("#stateTrayTitle"),
    trayText: document.querySelector("#stateTrayText"),
    boardMessage: document.querySelector("#stateBoardMessage"),
    regionName: document.querySelector("#stateRegionName"),
    regionFact: document.querySelector("#stateRegionFact"),
    feedback: document.querySelector("#stateFeedback"),
    note: document.querySelector("#stateRegionNote"),
    result: document.querySelector("#stateResult"),
    resultText: document.querySelector("#stateResultText"),
    finalScore: document.querySelector("#stateFinalScore"),
    playAgain: document.querySelector("#statePlayAgain"),
    printResult: document.querySelector("#statePrintResult")
  };

  const state = {
    currentRegion: "norte",
    phase: "preview",
    selected: null,
    placed: new Set(),
    attempts: 0,
    mistakes: 0,
    hints: 0,
    timerId: null,
    startedAt: null,
    elapsedSeconds: 0,
    finished: false,
    maskReady: false
  };

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function regionData() {
    return REGION_GAMES[state.currentRegion];
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const remaining = (seconds % 60).toString().padStart(2, "0");
    return minutes + ":" + remaining;
  }

  function shuffle(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }
    return copy;
  }

  function currentScore() {
    const timePenalty = Math.floor(state.elapsedSeconds / 18);
    return Math.max(10, 100 - state.mistakes * 8 - state.hints * 5 - timePenalty);
  }

  function updateStats() {
    elements.placedCount.textContent = String(state.phase === "preview" ? regionData().count : state.placed.size);
    elements.totalCount.textContent = String(regionData().count);
    elements.attempts.textContent = String(state.attempts);
    elements.timer.textContent = formatTime(state.elapsedSeconds);
    elements.score.textContent = String(currentScore());
  }

  function setFeedback(title, message, type) {
    elements.feedback.classList.remove("is-success", "is-error");
    if (type) elements.feedback.classList.add(type);
    elements.feedback.innerHTML = "<strong>" + escapeHtml(title) + "</strong><p>" + escapeHtml(message) + "</p>";
  }

  function loadMask() {
    state.maskReady = false;
    const data = regionData();
    maskImage.onload = function () {
      maskCanvas.width = maskImage.naturalWidth;
      maskCanvas.height = maskImage.naturalHeight;
      maskContext.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      maskContext.drawImage(maskImage, 0, 0);
      state.maskReady = true;
    };
    maskImage.src = data.mask;
  }

  function positionImage(el, piece) {
    el.style.left = piece.x + "%";
    el.style.top = piece.y + "%";
    el.style.width = piece.w + "%";
    el.style.height = piece.h + "%";
  }

  function createBoardPiece(piece, className) {
    const img = document.createElement("img");
    img.className = className;
    img.src = piece.piece;
    img.alt = className === "state-piece-placed" ? (piece.name + " encaixado") : "";
    positionImage(img, piece);
    return img;
  }

  function renderPreview() {
    placedLayer.replaceChildren(...regionData().states.map(function (piece) {
      return createBoardPiece(piece, "state-piece-preview");
    }));
  }

  function createCard(piece) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "state-piece-card";
    button.dataset.stateId = piece.id;
    button.draggable = true;
    button.setAttribute("aria-label", "Peça do estado " + piece.name);
    button.innerHTML = `
      <img src="${piece.piece}" alt="" draggable="false">
      <span><strong>${escapeHtml(piece.name)}</strong><small>${escapeHtml(piece.abbr)} · leve para o mapa</small></span>
    `;
    button.addEventListener("click", function () { selectPiece(piece.id); });
    button.addEventListener("dragstart", function (event) {
      if (state.phase !== "playing") { event.preventDefault(); return; }
      selectPiece(piece.id);
      startTimer();
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", piece.id);
    });
    button.addEventListener("dragend", function () { board.classList.remove("is-ready"); });
    return button;
  }

  function renderTray() {
    const order = shuffle(regionData().states);
    piecesContainer.replaceChildren(...order.map(createCard));
  }

  function selectPiece(pieceId) {
    if (state.phase !== "playing" || state.placed.has(pieceId) || state.finished) return;
    state.selected = pieceId;
    piecesContainer.querySelectorAll('.state-piece-card').forEach(function (card) {
      card.classList.toggle('is-selected', card.dataset.stateId === pieceId);
    });
    board.classList.add('is-ready');
    const piece = regionData().states.find(function (item) { return item.id === pieceId; });
    elements.boardMessage.textContent = 'Leve ' + piece.name + ' para a posição correta.';
    setFeedback('Peça selecionada', 'Agora tente encaixar ' + piece.name + ' na região.', '');
  }

  function startTimer() {
    if (state.startedAt || state.finished || state.phase !== 'playing') return;
    state.startedAt = Date.now();
    state.timerId = window.setInterval(function () {
      state.elapsedSeconds = Math.floor((Date.now() - state.startedAt) / 1000);
      updateStats();
    }, 1000);
  }

  function stopTimer() {
    if (state.timerId) { window.clearInterval(state.timerId); state.timerId = null; }
  }

  function clearHint() { hintLayer.replaceChildren(); }

  function showHint() {
    if (state.phase !== 'playing' || !state.selected || state.placed.has(state.selected)) {
      setFeedback('Selecione uma peça', 'Escolha um estado antes de pedir uma dica.', 'is-error');
      return;
    }
    state.hints += 1;
    updateStats();
    clearHint();
    const piece = regionData().states.find(function (item) { return item.id === state.selected; });
    hintLayer.appendChild(createBoardPiece(piece, 'state-piece-hint'));
    window.setTimeout(clearHint, 1800);
    setFeedback('Dica mostrada', 'A área correta foi destacada por alguns segundos.', '');
  }

  function colorMatch(pixel, color) {
    return Math.abs(pixel[0] - color[0]) < 8 && Math.abs(pixel[1] - color[1]) < 8 && Math.abs(pixel[2] - color[2]) < 8;
  }

  function stateAtPoint(clientX, clientY) {
    if (!state.maskReady) return null;
    const rect = board.getBoundingClientRect();
    const nx = (clientX - rect.left) / rect.width;
    const ny = (clientY - rect.top) / rect.height;
    if (nx < 0 || nx > 1 || ny < 0 || ny > 1) return null;
    const x = Math.round(nx * (maskCanvas.width - 1));
    const y = Math.round(ny * (maskCanvas.height - 1));
    const pixels = maskContext.getImageData(Math.max(0, x-5), Math.max(0, y-5), Math.min(maskCanvas.width, 11), Math.min(maskCanvas.height, 11)).data;
    const counts = {};
    for (let i = 0; i < pixels.length; i += 4) {
      const px = [pixels[i], pixels[i+1], pixels[i+2]];
      regionData().states.forEach(function (piece) {
        if (colorMatch(px, piece.color)) counts[piece.id] = (counts[piece.id] || 0) + 1;
      });
    }
    let chosen = null;
    let biggest = 0;
    Object.entries(counts).forEach(function ([id, count]) { if (count > biggest) { biggest = count; chosen = id; } });
    return chosen;
  }

  function markPlaced(pieceId) {
    const card = piecesContainer.querySelector('[data-state-id="' + pieceId + '"]');
    if (card) { card.classList.add('is-placed'); card.classList.remove('is-selected'); }
  }

  function attemptPlacement(pieceId, clientX, clientY) {
    if (state.phase !== 'playing' || !pieceId || state.finished || state.placed.has(pieceId)) return;
    startTimer();
    state.attempts += 1;
    const target = stateAtPoint(clientX, clientY);
    const piece = regionData().states.find(function (item) { return item.id === pieceId; });
    if (target === pieceId) {
      state.placed.add(pieceId);
      placedLayer.appendChild(createBoardPiece(piece, 'state-piece-placed'));
      markPlaced(pieceId);
      clearHint();
      state.selected = null;
      board.classList.remove('is-ready');
      elements.boardMessage.textContent = piece.name + ' encaixou corretamente.';
      setFeedback('Encaixe correto!', piece.name + ' foi colocado no lugar certo.', 'is-success');
      updateStats();
      if (state.placed.size === regionData().count) finishGame();
    } else {
      state.mistakes += 1;
      board.classList.remove('is-wrong'); void board.offsetWidth; board.classList.add('is-wrong');
      elements.boardMessage.textContent = 'Ainda não é o lugar de ' + piece.name + '.';
      setFeedback('Tente novamente', 'Essa peça só fica no mapa quando estiver na posição correta.', 'is-error');
      updateStats();
    }
  }

  function loadResults() {
    try {
      const stored = JSON.parse(localStorage.getItem(RESULT_KEY) || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch (error) { return []; }
  }

  function saveResult(finalScore) {
    const result = {
      id: Date.now(),
      student: 'Atividade interativa',
      className: regionData().name,
      activity: 'Quebra-cabeça da ' + regionData().name,
      subject: 'Geografia',
      correct: regionData().count,
      total: regionData().count,
      percentage: finalScore,
      date: new Date().toLocaleString('pt-BR')
    };
    const results = loadResults();
    results.unshift(result);
    localStorage.setItem(RESULT_KEY, JSON.stringify(results.slice(0, 100)));
  }

  function refreshMissionResultsTable() {
    const tableBody = document.querySelector('#resultsTableBody');
    const totalActivities = document.querySelector('#totalActivities');
    const averageScore = document.querySelector('#averageScore');
    const bestScore = document.querySelector('#bestScore');
    const results = loadResults();
    if (!tableBody || !totalActivities || !averageScore || !bestScore) return;
    if (!results.length) {
      tableBody.innerHTML = '<tr class="empty-row"><td colspan="7">Nenhuma atividade realizada ainda.</td></tr>';
      totalActivities.textContent = '0'; averageScore.textContent = '0%'; bestScore.textContent = '0%'; return;
    }
    const average = Math.round(results.reduce(function (sum, item) { return sum + Number(item.percentage || 0); }, 0) / results.length);
    const best = Math.max.apply(null, results.map(function (item) { return Number(item.percentage || 0); }));
    totalActivities.textContent = String(results.length);
    averageScore.textContent = average + '%';
    bestScore.textContent = best + '%';
    tableBody.innerHTML = results.map(function (item) {
      return '<tr>' +
        '<td>' + escapeHtml(item.student) + '</td>' +
        '<td>' + escapeHtml(item.className) + '</td>' +
        '<td>' + escapeHtml(item.activity) + '</td>' +
        '<td>' + escapeHtml(item.subject) + '</td>' +
        '<td>' + Number(item.correct || 0) + '/' + Number(item.total || 0) + '</td>' +
        '<td><span class="score-pill">' + Number(item.percentage || 0) + '%</span></td>' +
        '<td>' + escapeHtml(item.date) + '</td>' +
      '</tr>';
    }).join('');
  }

  function finishGame() {
    state.phase = 'finished';
    state.finished = true;
    game.dataset.phase = 'finished';
    stopTimer();
    clearHint();
    const finalScore = currentScore();
    elements.finalScore.textContent = String(finalScore);
    elements.resultText.textContent = regionData().name + ' montada em ' + formatTime(state.elapsedSeconds) + ' com ' + state.attempts + ' tentativa' + (state.attempts === 1 ? '' : 's') + '.';
    elements.result.hidden = false;
    elements.hintButton.disabled = true;
    elements.boardMessage.textContent = 'Parabéns! Todos os estados da ' + regionData().name + ' foram encaixados.';
    saveResult(finalScore);
    refreshMissionResultsTable();
    setFeedback('Missão concluída!', 'Você montou corretamente os estados da ' + regionData().name + '.', 'is-success');
  }

  function updateRegionText() {
    const data = regionData();
    elements.regionName.textContent = data.name;
    elements.regionFact.textContent = data.fact;
    if (data.note) { elements.note.hidden = false; elements.note.textContent = data.note; }
    else { elements.note.hidden = true; elements.note.textContent = ''; }
    game.dataset.currentRegion = state.currentRegion;
    board.style.setProperty('--board-ratio', data.ratio.toString());
    boardBase.src = data.silhouette;
    boardBase.alt = 'Silhueta da ' + data.name;
  }

  function showPreview() {
    stopTimer();
    state.phase = 'preview'; state.selected = null; state.placed = new Set(); state.attempts = 0; state.mistakes = 0; state.hints = 0;
    state.startedAt = null; state.elapsedSeconds = 0; state.finished = false;
    game.dataset.phase = 'preview';
    updateRegionText();
    loadMask();
    piecesContainer.replaceChildren();
    clearHint();
    renderPreview();
    board.classList.remove('is-ready', 'is-wrong');
    elements.startButton.disabled = false; elements.hintButton.disabled = true;
    elements.trayTitle.textContent = 'Observe antes de jogar';
    elements.trayText.textContent = 'Ao clicar em iniciar, os estados sairão do mapa e aparecerão aqui.';
    elements.boardMessage.textContent = 'Observe a região completa antes de iniciar.';
    elements.result.hidden = true;
    setFeedback('Mapa completo', 'Observe a posição dos estados e depois clique em iniciar.', '');
    updateStats();
  }

  function beginGame() {
    if (state.phase !== 'preview') return;
    state.phase = 'playing'; game.dataset.phase = 'playing';
    state.placed = new Set(); state.selected = null; state.attempts = 0; state.mistakes = 0; state.hints = 0; state.startedAt = null; state.elapsedSeconds = 0; state.finished = false;
    placedLayer.replaceChildren();
    renderTray();
    elements.hintButton.disabled = false;
    elements.trayTitle.textContent = 'Escolha um estado';
    elements.trayText.textContent = 'Arraste uma peça ou toque nela para selecioná-la.';
    elements.boardMessage.textContent = 'Monte novamente a ' + regionData().name + '.';
    setFeedback('Jogo iniciado', 'Escolha uma peça e encaixe-a na posição correta.', '');
    updateStats();
    startTimer();
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      state.currentRegion = tab.dataset.regionTab;
      tabs.forEach(function (item) {
        const active = item === tab;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      showPreview();
    });
  });

  board.addEventListener('dragover', function (event) {
    if (state.phase !== 'playing') return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    board.classList.add('is-ready');
  });
  board.addEventListener('dragleave', function (event) {
    if (!board.contains(event.relatedTarget)) board.classList.remove('is-ready');
  });
  board.addEventListener('drop', function (event) {
    if (state.phase !== 'playing') return;
    event.preventDefault();
    board.classList.remove('is-ready');
    const pieceId = event.dataTransfer.getData('text/plain') || state.selected;
    attemptPlacement(pieceId, event.clientX, event.clientY);
  });
  board.addEventListener('click', function (event) {
    if (state.phase !== 'playing' || !state.selected || state.finished) return;
    attemptPlacement(state.selected, event.clientX, event.clientY);
  });

  elements.startButton.addEventListener('click', beginGame);
  elements.hintButton.addEventListener('click', showHint);
  elements.resetButton.addEventListener('click', showPreview);
  elements.playAgain.addEventListener('click', function () { showPreview(); document.querySelector('#quebra-cabeca-estados-regioes').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  elements.printResult.addEventListener('click', function () { window.print(); });

  showPreview();
});
