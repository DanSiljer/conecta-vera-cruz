(function () {
  "use strict";

  const board = document.getElementById("sagradoPuzzleBoard");
  const tray = document.getElementById("sagradoPuzzleTray");
  if (!board || !tray) return;

  const difficulty = document.getElementById("sagradoPuzzleDifficulty");
  const startButton = document.getElementById("sagradoPuzzleStart");
  const showButton = document.getElementById("sagradoPuzzleShow");
  const resetButton = document.getElementById("sagradoPuzzleReset");
  const movesOutput = document.getElementById("sagradoPuzzleMoves");
  const timeOutput = document.getElementById("sagradoPuzzleTime");
  const placedOutput = document.getElementById("sagradoPuzzlePlaced");
  const totalOutput = document.getElementById("sagradoPuzzleTotal");
  const messageOutput = document.getElementById("sagradoPuzzleMessage");
  const trayTitle = document.getElementById("sagradoPuzzleTrayTitle");

  const IMAGE_SRC = "assets/img/jogos/igreja-sagrado-coracao-de-jesus.webp";
  const SVG_NS = "http://www.w3.org/2000/svg";
  const XLINK_NS = "http://www.w3.org/1999/xlink";

  const state = {
    size: Number(difficulty.value) || 4,
    ratio: 703 / 869,
    imageWidth: 703,
    imageHeight: 869,
    edges: [],
    placed: new Set(),
    selectedPiece: null,
    moves: 0,
    seconds: 0,
    timerId: null,
    playing: false,
    saved: false,
    drag: null
  };

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  }

  function updateStats() {
    movesOutput.textContent = String(state.moves);
    timeOutput.textContent = formatTime(state.seconds);
    placedOutput.textContent = String(state.placed.size);
    totalOutput.textContent = String(state.size * state.size);
    trayTitle.textContent = state.playing
      ? (state.placed.size === state.size * state.size ? "Imagem concluída" : "Peças soltas")
      : "Prepare a partida";
  }

  function stopTimer() {
    if (state.timerId) window.clearInterval(state.timerId);
    state.timerId = null;
  }

  function startTimer() {
    stopTimer();
    state.timerId = window.setInterval(function () {
      state.seconds += 1;
      updateStats();
    }, 1000);
  }

  function shuffle(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      const temp = copy[i];
      copy[i] = copy[randomIndex];
      copy[randomIndex] = temp;
    }
    return copy;
  }

  function randomEdge() {
    return Math.random() < 0.5 ? -1 : 1;
  }

  function buildEdges(size) {
    const edges = Array.from({ length: size * size }, function () {
      return { top: 0, right: 0, bottom: 0, left: 0 };
    });

    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size - 1; col += 1) {
        const edge = randomEdge();
        const leftIndex = row * size + col;
        const rightIndex = row * size + col + 1;
        edges[leftIndex].right = edge;
        edges[rightIndex].left = -edge;
      }
    }

    for (let row = 0; row < size - 1; row += 1) {
      for (let col = 0; col < size; col += 1) {
        const edge = randomEdge();
        const topIndex = row * size + col;
        const bottomIndex = (row + 1) * size + col;
        edges[topIndex].bottom = edge;
        edges[bottomIndex].top = -edge;
      }
    }

    return edges;
  }

  function pieceGeometry() {
    const width = 100;
    const height = 100 / state.ratio;
    const depth = Math.min(width, height) * 0.16;
    const pad = depth * 1.55;
    return { width: width, height: height, depth: depth, pad: pad };
  }

  function horizontalCurve(path, startX, endX, y, type, outwardSign) {
    const g = pieceGeometry();
    const span = endX - startX;
    const mid = (startX + endX) / 2;
    const neck = Math.abs(span) * 0.12;
    const shoulder = Math.abs(span) * 0.20;
    const d = g.depth * type * outwardSign;
    const dir = endX > startX ? 1 : -1;

    path.push("L", (mid - dir * shoulder).toFixed(3), y.toFixed(3));
    path.push("C",
      (mid - dir * neck * 1.45).toFixed(3), y.toFixed(3),
      (mid - dir * neck * 1.55).toFixed(3), (y + d * 0.62).toFixed(3),
      (mid - dir * neck).toFixed(3), (y + d * 0.72).toFixed(3)
    );
    path.push("C",
      (mid - dir * neck * 0.55).toFixed(3), (y + d * 0.80).toFixed(3),
      (mid - dir * neck * 0.72).toFixed(3), (y + d * 1.34).toFixed(3),
      mid.toFixed(3), (y + d * 1.38).toFixed(3)
    );
    path.push("C",
      (mid + dir * neck * 0.72).toFixed(3), (y + d * 1.34).toFixed(3),
      (mid + dir * neck * 0.55).toFixed(3), (y + d * 0.80).toFixed(3),
      (mid + dir * neck).toFixed(3), (y + d * 0.72).toFixed(3)
    );
    path.push("C",
      (mid + dir * neck * 1.55).toFixed(3), (y + d * 0.62).toFixed(3),
      (mid + dir * neck * 1.45).toFixed(3), y.toFixed(3),
      (mid + dir * shoulder).toFixed(3), y.toFixed(3)
    );
    path.push("L", endX.toFixed(3), y.toFixed(3));
  }

  function verticalCurve(path, x, startY, endY, type, outwardSign) {
    const g = pieceGeometry();
    const span = endY - startY;
    const mid = (startY + endY) / 2;
    const neck = Math.abs(span) * 0.12;
    const shoulder = Math.abs(span) * 0.20;
    const d = g.depth * type * outwardSign;
    const dir = endY > startY ? 1 : -1;

    path.push("L", x.toFixed(3), (mid - dir * shoulder).toFixed(3));
    path.push("C",
      x.toFixed(3), (mid - dir * neck * 1.45).toFixed(3),
      (x + d * 0.62).toFixed(3), (mid - dir * neck * 1.55).toFixed(3),
      (x + d * 0.72).toFixed(3), (mid - dir * neck).toFixed(3)
    );
    path.push("C",
      (x + d * 0.80).toFixed(3), (mid - dir * neck * 0.55).toFixed(3),
      (x + d * 1.34).toFixed(3), (mid - dir * neck * 0.72).toFixed(3),
      (x + d * 1.38).toFixed(3), mid.toFixed(3)
    );
    path.push("C",
      (x + d * 1.34).toFixed(3), (mid + dir * neck * 0.72).toFixed(3),
      (x + d * 0.80).toFixed(3), (mid + dir * neck * 0.55).toFixed(3),
      (x + d * 0.72).toFixed(3), (mid + dir * neck).toFixed(3)
    );
    path.push("C",
      (x + d * 0.62).toFixed(3), (mid + dir * neck * 1.55).toFixed(3),
      x.toFixed(3), (mid + dir * neck * 1.45).toFixed(3),
      x.toFixed(3), (mid + dir * shoulder).toFixed(3)
    );
    path.push("L", x.toFixed(3), endY.toFixed(3));
  }

  function piecePath(index) {
    const g = pieceGeometry();
    const edge = state.edges[index];
    const path = ["M", "0", "0"];

    if (edge.top === 0) path.push("L", g.width.toFixed(3), "0");
    else horizontalCurve(path, 0, g.width, 0, edge.top, -1);

    if (edge.right === 0) path.push("L", g.width.toFixed(3), g.height.toFixed(3));
    else verticalCurve(path, g.width, 0, g.height, edge.right, 1);

    if (edge.bottom === 0) path.push("L", "0", g.height.toFixed(3));
    else horizontalCurve(path, g.width, 0, g.height, edge.bottom, 1);

    if (edge.left === 0) path.push("L", "0", "0");
    else verticalCurve(path, 0, g.height, 0, edge.left, -1);

    path.push("Z");
    return path.join(" ");
  }

  function createPieceSvg(index, ghost) {
    const g = pieceGeometry();
    const row = Math.floor(index / state.size);
    const col = index % state.size;
    const pathData = piecePath(index);
    const svg = document.createElementNS(SVG_NS, "svg");
    const clipId = "capelaPieceClip-" + state.size + "-" + index + "-" + Math.random().toString(36).slice(2, 8);

    svg.setAttribute("viewBox", [
      -g.pad,
      -g.pad,
      g.width + g.pad * 2,
      g.height + g.pad * 2
    ].join(" "));
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("sagrado-puzzle__piece-svg");

    /* O SVG precisa crescer exatamente o mesmo valor do padding geométrico.
       O tamanho fixo antigo (154%) criava frestas entre as peças, sobretudo
       em imagens verticais. */
    svg.style.left = (-(g.pad / g.width) * 100).toFixed(4) + "%";
    svg.style.top = (-(g.pad / g.height) * 100).toFixed(4) + "%";
    svg.style.width = (((g.width + g.pad * 2) / g.width) * 100).toFixed(4) + "%";
    svg.style.height = (((g.height + g.pad * 2) / g.height) * 100).toFixed(4) + "%";


    if (!ghost) {
      const defs = document.createElementNS(SVG_NS, "defs");
      const clip = document.createElementNS(SVG_NS, "clipPath");
      clip.setAttribute("id", clipId);
      const clipPath = document.createElementNS(SVG_NS, "path");
      clipPath.setAttribute("d", pathData);
      clip.appendChild(clipPath);
      defs.appendChild(clip);
      svg.appendChild(defs);

      const image = document.createElementNS(SVG_NS, "image");
      image.setAttribute("href", IMAGE_SRC);
      image.setAttributeNS(XLINK_NS, "xlink:href", IMAGE_SRC);
      image.setAttribute("x", String(-col * g.width));
      image.setAttribute("y", String(-row * g.height));
      image.setAttribute("width", String(state.size * g.width));
      image.setAttribute("height", String(state.size * g.height));
      image.setAttribute("preserveAspectRatio", "none");
      image.setAttribute("clip-path", "url(#" + clipId + ")");
      svg.appendChild(image);
    }

    const outline = document.createElementNS(SVG_NS, "path");
    outline.setAttribute("d", pathData);
    outline.setAttribute("vector-effect", "non-scaling-stroke");
    outline.classList.add(ghost ? "sagrado-puzzle__ghost-outline" : "sagrado-puzzle__piece-outline");
    svg.appendChild(outline);

    return svg;
  }

  function clearSelection() {
    if (state.selectedPiece) state.selectedPiece.classList.remove("is-selected");
    state.selectedPiece = null;
  }

  function selectPiece(piece) {
    if (!state.playing || piece.classList.contains("is-placed")) return;
    clearSelection();
    state.selectedPiece = piece;
    piece.classList.add("is-selected");
    messageOutput.textContent = "Peça selecionada. Agora toque no espaço correto do tabuleiro ou arraste a peça até lá.";
  }

  function createPiece(index) {
    const piece = document.createElement("button");
    piece.type = "button";
    piece.className = "sagrado-puzzle__piece";
    piece.dataset.piece = String(index);
    piece.setAttribute("aria-label", "Peça " + (index + 1) + " do quebra-cabeça");
    piece.style.setProperty("--piece-ratio", String(state.ratio));
    piece.style.setProperty("--scatter-rotate", ((Math.random() * 8) - 4).toFixed(2) + "deg");
    piece.appendChild(createPieceSvg(index, false));

    piece.addEventListener("click", function (event) {
      if (state.drag && state.drag.moved) return;
      event.preventDefault();
      if (state.selectedPiece === piece) clearSelection();
      else selectPiece(piece);
    });

    piece.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectPiece(piece);
      }
    });

    piece.addEventListener("pointerdown", beginDrag);
    return piece;
  }

  function createSlot(index) {
    const slot = document.createElement("button");
    const row = Math.floor(index / state.size);
    const col = index % state.size;
    slot.type = "button";
    slot.className = "sagrado-puzzle__slot";
    slot.dataset.slot = String(index);
    slot.setAttribute("aria-label", "Espaço " + (index + 1) + " do quebra-cabeça");
    slot.style.left = (col * 100 / state.size) + "%";
    slot.style.top = (row * 100 / state.size) + "%";
    slot.style.width = (100 / state.size) + "%";
    slot.style.height = (100 / state.size) + "%";
    slot.appendChild(createPieceSvg(index, true));

    slot.addEventListener("click", function () {
      if (!state.selectedPiece || !state.playing) return;
      attemptPlacement(state.selectedPiece, index, true);
    });

    return slot;
  }

  function buildBoard() {
    board.innerHTML = "";
    for (let i = 0; i < state.size * state.size; i += 1) {
      board.appendChild(createSlot(i));
    }
    board.style.setProperty("--puzzle-size", String(state.size));
    board.style.aspectRatio = String(state.ratio);
  }

  function buildTray() {
    tray.innerHTML = "";
    const order = shuffle(Array.from({ length: state.size * state.size }, function (_, index) { return index; }));
    order.forEach(function (index) {
      tray.appendChild(createPiece(index));
    });
  }

  function fitPuzzleToScreen() {
    const workspace = board.closest("[class$='__workspace']");
    const boardColumn = board.closest("[class$='__board-column']");
    if (!workspace || !boardColumn) return;

    const mobile = window.innerWidth <= 650;
    const workspaceWidth = Math.max(240, workspace.clientWidth - (mobile ? 8 : 16));

    /* Reserva espaço para barra de ferramentas, mensagem e 2 fileiras de peças. */
    const reservedHeight = mobile ? 250 : 300;
    const maxStageHeight = Math.max(360, Math.min(640, window.innerHeight - reservedHeight));
    const trayHeight = state.size >= 5 ? 150 : state.size === 4 ? 118 : 92;
    const messageHeight = mobile ? 0 : 38;
    const boardMaxHeight = Math.max(220, maxStageHeight - trayHeight - messageHeight - 16);

    const targetWidth = Math.max(
      220,
      Math.min(workspaceWidth, boardMaxHeight * state.ratio)
    );
    const targetHeight = Math.floor(targetWidth / state.ratio);

    board.style.width = Math.floor(targetWidth) + "px";
    board.style.height = targetHeight + "px";
    board.style.marginInline = "auto";

    /* A mesa acompanha o conteúdo, sem criar áreas vazias gigantes. */
    workspace.style.height = "auto";
    workspace.style.minHeight = "0";
    workspace.style.maxHeight = "none";
  }

  function beginDrag(event) {
    const piece = event.currentTarget;
    if (!state.playing || piece.classList.contains("is-placed") || event.button > 0) return;

    clearSelection();
    const rect = piece.getBoundingClientRect();
    state.drag = {
      piece: piece,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      moved: false,
      rect: rect
    };

    piece.setPointerCapture(event.pointerId);
    piece.classList.add("is-dragging");
    piece.style.zIndex = "1000";
    event.preventDefault();
  }

  function moveDrag(event) {
    const drag = state.drag;
    if (!drag || event.pointerId !== drag.pointerId) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) drag.moved = true;

    drag.piece.style.transform = "translate3d(" + dx + "px," + dy + "px,0) scale(1.05)";
    event.preventDefault();
  }

  function endDrag(event) {
    const drag = state.drag;
    if (!drag || event.pointerId !== drag.pointerId) return;

    try { drag.piece.releasePointerCapture(event.pointerId); } catch (error) {}
    drag.piece.classList.remove("is-dragging");
    drag.piece.style.zIndex = "";

    if (drag.moved) {
      const slotIndex = slotFromPiece(drag.piece);
      if (slotIndex !== null) {
        attemptPlacement(drag.piece, slotIndex, false);
      } else {
        returnPiece(drag.piece, "Leve a maior parte da peça para dentro do espaço correto do tabuleiro.");
      }
    }

    state.drag = null;
  }

  function cancelDrag(event) {
    const drag = state.drag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    returnPiece(drag.piece, "Peça devolvida à bandeja.");
    state.drag = null;
  }

  function slotFromPoint(clientX, clientY) {
    const rect = board.getBoundingClientRect();
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return null;
    const col = Math.min(state.size - 1, Math.max(0, Math.floor(((clientX - rect.left) / rect.width) * state.size)));
    const row = Math.min(state.size - 1, Math.max(0, Math.floor(((clientY - rect.top) / rect.height) * state.size)));
    return row * state.size + col;
  }

  function slotFromPiece(piece) {
    const pieceRect = piece.getBoundingClientRect();
    const slots = board.querySelectorAll("[data-slot]");
    let bestIndex = null;
    let bestOverlap = 0;

    slots.forEach(function (slot) {
      if (slot.classList.contains("is-filled")) return;
      const slotRect = slot.getBoundingClientRect();
      const overlapWidth = Math.max(0, Math.min(pieceRect.right, slotRect.right) - Math.max(pieceRect.left, slotRect.left));
      const overlapHeight = Math.max(0, Math.min(pieceRect.bottom, slotRect.bottom) - Math.max(pieceRect.top, slotRect.top));
      const overlapArea = overlapWidth * overlapHeight;
      const pieceArea = Math.max(1, pieceRect.width * pieceRect.height);
      const ratio = overlapArea / pieceArea;

      if (ratio > bestOverlap) {
        bestOverlap = ratio;
        bestIndex = Number(slot.dataset.slot);
      }
    });

    /* 28% já é suficiente para o jogo entender a intenção do aluno e
       "puxar" a peça para o encaixe correto. */
    return bestOverlap >= 0.18 ? bestIndex : null;
  }

  function returnPiece(piece, message) {
    piece.style.transform = "";
    piece.classList.remove("is-dragging");
    piece.classList.add("is-wrong");
    window.setTimeout(function () { piece.classList.remove("is-wrong"); }, 360);
    if (message) messageOutput.textContent = message;
  }

  function attemptPlacement(piece, slotIndex, viaTap) {
    const pieceIndex = Number(piece.dataset.piece);
    if (!state.playing || state.placed.has(pieceIndex)) return;

    state.moves += 1;

    if (pieceIndex !== slotIndex) {
      updateStats();
      returnPiece(piece, "Ainda não é esse lugar. A peça voltou para a bandeja. Tente outra posição.");
      const wrongSlot = board.querySelector('[data-slot="' + slotIndex + '"]');
      if (wrongSlot) {
        wrongSlot.classList.add("is-wrong");
        window.setTimeout(function () { wrongSlot.classList.remove("is-wrong"); }, 380);
      }
      return;
    }

    const slot = board.querySelector('[data-slot="' + slotIndex + '"]');
    if (!slot) return;

    piece.style.transform = "";
    piece.style.zIndex = "";
    piece.style.left = "";
    piece.style.top = "";
    piece.style.width = "";
    piece.style.maxWidth = "";
    piece.style.margin = "";
    piece.style.setProperty("--scatter-rotate", "0deg");
    piece.classList.remove("is-selected", "is-wrong", "is-dragging");
    piece.classList.add("is-placed");
    piece.setAttribute("aria-disabled", "true");
    slot.classList.add("is-filled");
    slot.appendChild(piece);
    state.placed.add(pieceIndex);
    clearSelection();
    updateStats();

    messageOutput.textContent = viaTap
      ? "Encaixou! Escolha outra peça e continue."
      : "Encaixou! A peça ficou presa no lugar correto.";

    if (state.placed.size === state.size * state.size) finishGame();
  }

  function saveProgress() {
    if (state.saved) return;
    state.saved = true;

    let student = {};
    let results = [];
    try { student = JSON.parse(localStorage.getItem("missaoAprenderStudent")) || {}; } catch (error) {}
    try { results = JSON.parse(localStorage.getItem("missaoAprenderResults")) || []; } catch (error) {}

    const difficultyName = state.size === 3 ? "Fácil" : state.size === 4 ? "Médio" : "Difícil";
    const minimumMoves = state.size * state.size;
    const extraMoves = Math.max(0, state.moves - minimumMoves);
    const score = Math.max(50, Math.min(100, 100 - extraMoves * 2 - Math.floor(state.seconds / 30)));

    results.unshift({
      id: Date.now(),
      student: student.name || "Estudante sem nome",
      className: student.className || "Não informada",
      activity: "Quebra-cabeça da Igreja Sagrado Coração de Jesus · " + difficultyName,
      subject: "História local e patrimônio",
      correct: score,
      total: 100,
      percentage: score,
      date: new Date().toLocaleString("pt-BR")
    });

    localStorage.setItem("missaoAprenderResults", JSON.stringify(results.slice(0, 100)));
    if (typeof window.renderResults === "function") window.renderResults();
  }

  function finishGame() {
    state.playing = false;
    stopTimer();
    saveProgress();
    board.classList.add("is-complete");
    messageOutput.innerHTML = "<strong>Quebra-cabeça concluído!</strong> Você montou a Igreja Sagrado Coração de Jesus em " + state.moves + " movimentos e " + formatTime(state.seconds) + ". O resultado foi salvo em Meu progresso.";
    startButton.textContent = "Jogar novamente";
  }

  function startGame() {
    stopTimer();
    state.size = Number(difficulty.value) || 4;
    state.edges = buildEdges(state.size);
    state.placed = new Set();
    state.moves = 0;
    state.seconds = 0;
    state.playing = true;
    state.saved = false;
    state.drag = null;
    clearSelection();
    board.classList.remove("is-complete", "is-hinting");
    buildBoard();
    buildTray();
    fitPuzzleToScreen();
    updateStats();
    startTimer();
    startButton.textContent = "Embaralhar de novo";
    messageOutput.textContent = "Arraste as peças soltas até o tabuleiro. Quando chegar ao lugar certo, a peça encaixa e fica presa.";

    window.requestAnimationFrame(function () {
      board.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function resetGame() {
    stopTimer();
    state.size = Number(difficulty.value) || 4;
    state.edges = buildEdges(state.size);
    state.placed = new Set();
    state.moves = 0;
    state.seconds = 0;
    state.playing = false;
    state.saved = false;
    state.drag = null;
    clearSelection();
    board.classList.remove("is-complete", "is-hinting");
    buildBoard();
    fitPuzzleToScreen();
    tray.innerHTML = '<div class="sagrado-puzzle__tray-empty"><span>🧩</span><strong>As peças aparecerão aqui</strong><p>Escolha o nível e clique em “Começar jogo”.</p></div>';
    updateStats();
    startButton.textContent = "Começar jogo";
    messageOutput.textContent = "Escolha o nível e clique em “Começar jogo”.";
  }

  function showHint() {
    if (!board.children.length) return;
    board.classList.add("is-hinting");
    showButton.disabled = true;
    messageOutput.textContent = "Dica rápida: memorize a posição da capela, do coqueiro, do céu e das pedras.";
    window.setTimeout(function () {
      board.classList.remove("is-hinting");
      showButton.disabled = false;
      if (state.playing) messageOutput.textContent = "Continue arrastando as peças até completar a imagem.";
    }, 2200);
  }

  startButton.addEventListener("click", startGame);
  showButton.addEventListener("click", showHint);
  resetButton.addEventListener("click", resetGame);

  difficulty.addEventListener("change", resetGame);
  document.addEventListener("pointermove", moveDrag, { passive: false });
  document.addEventListener("pointerup", endDrag, { passive: false });
  document.addEventListener("pointercancel", cancelDrag, { passive: false });

  window.addEventListener("resize", function () {
    window.requestAnimationFrame(fitPuzzleToScreen);
  });

  const preload = new Image();
  preload.addEventListener("load", function () {
    if (preload.naturalWidth && preload.naturalHeight) {
      state.imageWidth = preload.naturalWidth;
      state.imageHeight = preload.naturalHeight;
      state.ratio = preload.naturalWidth / preload.naturalHeight;
    }
    resetGame();
  });
  preload.addEventListener("error", function () {
    resetGame();
    messageOutput.textContent = "A imagem do quebra-cabeça não foi encontrada. Confira assets/img/jogos/igreja-sagrado-coracao-de-jesus.webp.";
  });
  preload.src = IMAGE_SRC;

  if (preload.complete && preload.naturalWidth) {
    state.imageWidth = preload.naturalWidth;
    state.imageHeight = preload.naturalHeight;
    state.ratio = preload.naturalWidth / preload.naturalHeight;
  }

  resetGame();
})();
