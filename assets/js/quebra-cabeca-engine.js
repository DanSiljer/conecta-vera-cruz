(function () {
  "use strict";

  function createPuzzle(config) {
    const get = (suffix) => document.getElementById(config.idPrefix + suffix);
    const board = get("Board");
    const tray = get("Tray");
    if (!board || !tray) return;

    const difficulty = get("Difficulty");
    const startButton = get("Start");
    const showButton = get("Show");
    const resetButton = get("Reset");
    const movesOutput = get("Moves");
    const timeOutput = get("Time");
    const placedOutput = get("Placed");
    const totalOutput = get("Total");
    const messageOutput = get("Message");
    const trayTitle = get("TrayTitle");
    const section = document.getElementById(config.sectionId) || board.closest("section");

    const state = {
      size: Number(difficulty.value) || 4,
      ratio: config.ratio || 16 / 9,
      placed: new Set(),
      selected: null,
      moves: 0,
      seconds: 0,
      timer: null,
      playing: false,
      dragging: null,
      ghost: null
    };

    if (section) section.style.setProperty("--puzzle-image", 'url("' + config.image + '")');

    function formatTime(value) {
      return String(Math.floor(value / 60)).padStart(2, "0") + ":" + String(value % 60).padStart(2, "0");
    }

    function updateStats() {
      movesOutput.textContent = String(state.moves);
      timeOutput.textContent = formatTime(state.seconds);
      placedOutput.textContent = String(state.placed.size);
      totalOutput.textContent = String(state.size * state.size);
      trayTitle.textContent = !state.playing ? "Prepare a partida" : state.placed.size === state.size * state.size ? "Imagem concluída" : "Peças soltas";
    }

    function stopTimer() {
      if (state.timer) clearInterval(state.timer);
      state.timer = null;
    }

    function startTimer() {
      stopTimer();
      state.timer = setInterval(function () {
        state.seconds += 1;
        updateStats();
      }, 1000);
    }

    function shuffle(items) {
      const copy = items.slice();
      for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }

    function imagePosition(index) {
      const row = Math.floor(index / state.size);
      const col = index % state.size;
      return {
        x: state.size === 1 ? 0 : col * 100 / (state.size - 1),
        y: state.size === 1 ? 0 : row * 100 / (state.size - 1)
      };
    }

    function decorateCrop(element, index) {
      const pos = imagePosition(index);
      element.style.backgroundImage = 'url("' + config.image + '")';
      element.style.backgroundSize = state.size * 100 + "% " + state.size * 100 + "%";
      element.style.backgroundPosition = pos.x + "% " + pos.y + "%";
      element.style.backgroundRepeat = "no-repeat";
    }

    function clearSelection() {
      if (state.selected) state.selected.classList.remove("is-selected");
      state.selected = null;
    }

    function selectPiece(piece) {
      if (!state.playing || piece.classList.contains("is-placed")) return;
      clearSelection();
      state.selected = piece;
      piece.classList.add("is-selected");
      messageOutput.textContent = "Peça selecionada. Toque no espaço correto ou arraste até ele.";
    }

    function wrong(piece, slot) {
      state.moves += 1;
      updateStats();
      if (piece) piece.classList.add("is-wrong");
      if (slot) slot.classList.add("is-wrong");
      messageOutput.textContent = "Ainda não é esse lugar. Observe a imagem e tente novamente.";
      setTimeout(function () {
        if (piece) piece.classList.remove("is-wrong");
        if (slot) slot.classList.remove("is-wrong");
      }, 350);
    }

    function place(piece, slot) {
      if (!piece || !slot || !state.playing) return;
      const pieceIndex = Number(piece.dataset.piece);
      const slotIndex = Number(slot.dataset.slot);
      if (pieceIndex !== slotIndex) {
        wrong(piece, slot);
        return;
      }

      state.moves += 1;
      state.placed.add(pieceIndex);
      piece.classList.add("is-placed");
      clearSelection();
      slot.classList.add("is-filled");
      slot.innerHTML = "";
      const fixed = document.createElement("span");
      fixed.className = "cv-puzzle-fixed";
      decorateCrop(fixed, pieceIndex);
      slot.appendChild(fixed);
      piece.remove();
      updateStats();
      messageOutput.textContent = "Encaixou! A peça ficou presa no lugar correto.";
      if (state.placed.size === state.size * state.size) finishGame();
    }

    function slotAtPoint(x, y) {
      const element = document.elementFromPoint(x, y);
      return element && element.closest ? element.closest(".cv-puzzle-slot") : null;
    }

    function removeGhost() {
      if (state.ghost) state.ghost.remove();
      state.ghost = null;
      if (state.dragging) state.dragging.classList.remove("is-dragging");
      state.dragging = null;
    }

    function beginDrag(event, piece) {
      if (!state.playing || event.button > 0) return;
      selectPiece(piece);
      state.dragging = piece;
      piece.classList.add("is-dragging");
      const rect = piece.getBoundingClientRect();
      const ghost = piece.cloneNode(true);
      ghost.className = "cv-puzzle-drag-ghost";
      ghost.style.width = rect.width + "px";
      ghost.style.height = rect.height + "px";
      ghost.style.left = event.clientX - rect.width / 2 + "px";
      ghost.style.top = event.clientY - rect.height / 2 + "px";
      document.body.appendChild(ghost);
      state.ghost = ghost;
      piece.setPointerCapture && piece.setPointerCapture(event.pointerId);
      event.preventDefault();
    }

    function moveDrag(event) {
      if (!state.ghost) return;
      const rect = state.ghost.getBoundingClientRect();
      state.ghost.style.left = event.clientX - rect.width / 2 + "px";
      state.ghost.style.top = event.clientY - rect.height / 2 + "px";
      event.preventDefault();
    }

    function endDrag(event) {
      if (!state.dragging) return;
      const piece = state.dragging;
      const slot = slotAtPoint(event.clientX, event.clientY);
      removeGhost();
      if (slot) place(piece, slot);
    }

    function createPiece(index) {
      const piece = document.createElement("button");
      piece.type = "button";
      piece.className = "cv-puzzle-piece";
      piece.dataset.piece = String(index);
      piece.setAttribute("aria-label", "Peça " + (index + 1));
      piece.style.aspectRatio = state.ratio + " / 1";
      decorateCrop(piece, index);
      piece.addEventListener("click", function () { selectPiece(piece); });
      piece.addEventListener("pointerdown", function (event) { beginDrag(event, piece); });
      return piece;
    }

    function buildBoard() {
      board.innerHTML = "";
      board.classList.remove("is-complete", "is-hinting");
      board.classList.add("cv-puzzle-board");
      board.style.aspectRatio = state.ratio;
      board.style.height = "auto";
      for (let index = 0; index < state.size * state.size; index += 1) {
        const slot = document.createElement("button");
        slot.type = "button";
        slot.className = "cv-puzzle-slot";
        slot.dataset.slot = String(index);
        slot.style.width = 100 / state.size + "%";
        slot.style.height = 100 / state.size + "%";
        slot.style.left = (index % state.size) * 100 / state.size + "%";
        slot.style.top = Math.floor(index / state.size) * 100 / state.size + "%";
        slot.setAttribute("aria-label", "Espaço " + (index + 1));
        slot.addEventListener("click", function () {
          if (state.selected) place(state.selected, slot);
        });
        board.appendChild(slot);
      }
    }

    function buildTray() {
      tray.innerHTML = "";
      tray.classList.add("cv-puzzle-tray");
      shuffle(Array.from({ length: state.size * state.size }, (_, i) => i)).forEach(function (index) {
        tray.appendChild(createPiece(index));
      });
    }

    function resetGame() {
      stopTimer();
      removeGhost();
      clearSelection();
      state.size = Number(difficulty.value) || 4;
      state.placed = new Set();
      state.moves = 0;
      state.seconds = 0;
      state.playing = false;
      buildBoard();
      tray.classList.add("cv-puzzle-tray");
      tray.innerHTML = '<div class="cv-puzzle-empty"><span>🧩</span><strong>As peças aparecerão aqui</strong><p>Escolha o nível e clique em “Começar jogo”.</p></div>';
      startButton.textContent = "Começar jogo";
      messageOutput.textContent = "Escolha o nível e clique em “Começar jogo”.";
      updateStats();
    }

    function startGame() {
      stopTimer();
      removeGhost();
      clearSelection();
      state.size = Number(difficulty.value) || 4;
      state.placed = new Set();
      state.moves = 0;
      state.seconds = 0;
      state.playing = true;
      buildBoard();
      buildTray();
      startTimer();
      startButton.textContent = "Embaralhar de novo";
      messageOutput.textContent = "Arraste uma peça até o espaço correto. No celular, você também pode tocar na peça e depois no espaço.";
      updateStats();
    }

    function showHint() {
      const previous = board.querySelector(".cv-puzzle-hint");
      if (previous) previous.remove();
      const hint = document.createElement("img");
      hint.className = "cv-puzzle-hint";
      hint.src = config.image;
      hint.alt = "Dica: " + config.label;
      board.appendChild(hint);
      showButton.disabled = true;
      messageOutput.textContent = config.hint || "Observe a imagem e memorize a posição dos detalhes.";
      setTimeout(function () {
        hint.remove();
        showButton.disabled = false;
        if (state.playing) messageOutput.textContent = "Continue montando o quebra-cabeça.";
      }, 2600);
    }

    function celebrate() {
      const shell = board.parentElement;
      if (!shell) return;
      const old = shell.querySelector(".puzzle-celebration");
      if (old) old.remove();
      const box = document.createElement("div");
      box.className = "puzzle-celebration";
      box.innerHTML = '<div class="puzzle-celebration__badge"><span>🏆</span><strong>Parabéns!</strong><small>Quebra-cabeça concluído</small></div>';
      shell.appendChild(box);
      setTimeout(function () { box.remove(); }, 4300);
    }

    function finishGame() {
      state.playing = false;
      stopTimer();
      board.classList.add("is-complete");
      celebrate();
      messageOutput.innerHTML = "<strong>Quebra-cabeça concluído!</strong> Você montou " + config.label + " em " + state.moves + " movimentos e " + formatTime(state.seconds) + ".";
      startButton.textContent = "Jogar novamente";
    }

    startButton.addEventListener("click", startGame);
    resetButton.addEventListener("click", resetGame);
    showButton.addEventListener("click", showHint);
    difficulty.addEventListener("change", resetGame);
    document.addEventListener("pointermove", moveDrag, { passive: false });
    document.addEventListener("pointerup", endDrag);
    document.addEventListener("pointercancel", removeGhost);

    const preload = new Image();
    preload.onload = function () {
      if (preload.naturalWidth && preload.naturalHeight) state.ratio = preload.naturalWidth / preload.naturalHeight;
      resetGame();
    };
    preload.onerror = function () {
      resetGame();
      messageOutput.textContent = "Não foi possível carregar a imagem deste quebra-cabeça.";
    };
    preload.src = config.image;
    resetGame();
  }

  window.createOnlinePuzzle = createPuzzle;
})();
