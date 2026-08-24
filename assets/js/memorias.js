import { db } from "./firebase-config.js";
import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  where
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

const CONFIG = {
  site: "Conecta Vera Cruz",
  collectionName: "memorias",
  minCharacters: 10,
  maxCharacters: 500,
  sendInterval: 60_000
};

const form = document.querySelector("#vc-memory-form");

if (form) {
  const nameInput = document.querySelector("#vc-memory-name");
  const placeSelect = document.querySelector("#vc-memory-place");
  const otherWrap = document.querySelector("#vc-memory-other-wrap");
  const otherInput = document.querySelector("#vc-memory-other");
  const textInput = document.querySelector("#vc-memory-text");
  const warning = document.querySelector("#vc-memory-warning");
  const counter = document.querySelector("#vc-memory-counter");
  const submitButton = document.querySelector("#vc-memory-submit");
  const submitLabel = document.querySelector("#vc-memory-submit-label");
  const statusBox = document.querySelector("#vc-memory-status");
  const list = document.querySelector("#vc-memory-list");
  const count = document.querySelector("#vc-memory-count");
  const filter = document.querySelector("#vc-memory-filter");

  const likedStorageKey = "conecta-vera-cruz-memory-likes-v1";
  const lastSendStorageKey = "conecta-vera-cruz-memory-last-send-v1";

  let firebaseReady = false;
  let memories = [];
  let likedIds = loadLikedIds();

  function cleanText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function selectedPlace() {
    if (placeSelect.value === "Outra comunidade") {
      return cleanText(otherInput.value);
    }

    return cleanText(placeSelect.value);
  }

  function showStatus(message, type = "info") {
    statusBox.textContent = message;
    statusBox.className = `memory-status is-visible is-${type}`;
  }

  function hideStatus() {
    statusBox.textContent = "";
    statusBox.className = "memory-status";
  }

  function errorMessage(error, context) {
    const code = String(error?.code || "erro-desconhecido");

    if (code.includes("permission-denied")) {
      return "O Firebase recusou o acesso. Publique as regras do arquivo firestore.rules no Console do Firebase.";
    }

    if (code.includes("unavailable")) {
      return "O mural está temporariamente indisponível. Confira a conexão e tente novamente.";
    }

    if (code.includes("failed-precondition")) {
      return "O Firestore ainda precisa de uma configuração adicional. Confira o banco e as regras de segurança.";
    }

    return `${context} (${code})`;
  }

  function loadLikedIds() {
    try {
      const value = JSON.parse(localStorage.getItem(likedStorageKey) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function saveLikedIds() {
    try {
      localStorage.setItem(likedStorageKey, JSON.stringify(likedIds));
    } catch (error) {
      console.warn("Não foi possível salvar as curtidas no navegador.", error);
    }
  }

  function initials(name) {
    const normalizedName = cleanText(name);

    if (!normalizedName || normalizedName === "Visitante") {
      return "VC";
    }

    const parts = normalizedName.split(" ");
    return parts.length === 1
      ? parts[0].slice(0, 2).toUpperCase()
      : `${parts[0][0]}${parts.at(-1)[0]}`.toUpperCase();
  }

  function formatDate(value) {
    const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;

    if (!date || Number.isNaN(date.getTime())) {
      return "Agora";
    }

    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function updateForm() {
    const length = textInput.value.length;
    const place = selectedPlace();
    const hasEnoughText = textInput.value.trim().length >= CONFIG.minCharacters;

    counter.textContent = `${length} de ${CONFIG.maxCharacters}`;
    submitButton.disabled = !firebaseReady || !place || !hasEnoughText;

    if (length > 0 && !hasEnoughText) {
      warning.textContent = `Escreva pelo menos ${CONFIG.minCharacters} caracteres.`;
    } else if (placeSelect.value === "Outra comunidade" && !place) {
      warning.textContent = "Digite o nome da comunidade.";
    } else {
      warning.textContent = "";
    }
  }

  function updateOtherField() {
    const show = placeSelect.value === "Outra comunidade";
    otherWrap.hidden = !show;
    otherInput.required = show;

    if (!show) {
      otherInput.value = "";
    }

    updateForm();
  }

  function emptyState(title, text = "") {
    const element = document.createElement("div");
    element.className = "memory-empty";

    const strong = document.createElement("strong");
    strong.textContent = title;
    element.appendChild(strong);

    if (text) {
      const paragraph = document.createElement("span");
      paragraph.textContent = text;
      element.appendChild(paragraph);
    }

    return element;
  }

  async function toggleLike(memory, button) {
    const wasLiked = likedIds.includes(memory.id);
    const reference = doc(db, CONFIG.collectionName, memory.id);

    button.disabled = true;

    try {
      await runTransaction(db, async transaction => {
        const snapshot = await transaction.get(reference);

        if (!snapshot.exists()) {
          throw new Error("Memória não encontrada.");
        }

        const current = Math.max(0, Number(snapshot.data().curtidas || 0));
        const next = wasLiked ? Math.max(0, current - 1) : current + 1;
        transaction.update(reference, { curtidas: next });
      });

      likedIds = wasLiked
        ? likedIds.filter(id => id !== memory.id)
        : [...likedIds, memory.id];
      saveLikedIds();
    } catch (error) {
      console.error("Erro ao registrar curtida:", error);
      showStatus(errorMessage(error, "Não foi possível registrar a curtida."), "error");
      button.disabled = false;
    }
  }

  function createLikeButton(memory) {
    const button = document.createElement("button");
    const wasLiked = likedIds.includes(memory.id);
    const amount = Math.max(0, Number(memory.curtidas || 0));

    button.type = "button";
    button.className = `memory-like${wasLiked ? " is-liked" : ""}`;
    button.setAttribute("aria-label", wasLiked ? "Remover curtida" : "Curtir memória");
    button.textContent = `${wasLiked ? "♥" : "♡"} Curtir${amount ? ` · ${amount}` : ""}`;
    button.addEventListener("click", () => toggleLike(memory, button));

    return button;
  }

  function createMemoryCard(memory) {
    const article = document.createElement("article");
    article.className = "memory-item";

    const header = document.createElement("header");
    header.className = "memory-item__header";

    const avatar = document.createElement("span");
    avatar.className = "memory-avatar";
    avatar.textContent = initials(memory.nome);
    avatar.setAttribute("aria-hidden", "true");

    const author = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = memory.nome || "Visitante";
    const meta = document.createElement("span");
    meta.textContent = `${memory.localidade || "Vera Cruz"} · ${formatDate(memory.createdAt)}`;
    author.append(name, meta);

    const place = document.createElement("span");
    place.className = "memory-place";
    place.textContent = memory.localidade || "Vera Cruz";

    header.append(avatar, author, place);

    const text = document.createElement("p");
    text.className = "memory-item__text";
    text.textContent = memory.texto || "";

    const footer = document.createElement("footer");
    footer.className = "memory-item__footer";
    footer.appendChild(createLikeButton(memory));

    const project = document.createElement("span");
    project.textContent = "Conecta Vera Cruz";
    footer.appendChild(project);

    article.append(header, text, footer);
    return article;
  }

  function renderMemories() {
    const selectedFilter = filter.value;
    const visibleMemories = selectedFilter === "todas"
      ? memories
      : memories.filter(memory => memory.localidade === selectedFilter);

    list.replaceChildren();
    count.textContent = visibleMemories.length === 1
      ? "1 memória"
      : `${visibleMemories.length} memórias`;

    if (!visibleMemories.length) {
      list.appendChild(emptyState(
        "Nenhuma memória encontrada",
        selectedFilter === "todas"
          ? "Seja a primeira pessoa a compartilhar uma história."
          : `Ainda não há histórias publicadas sobre ${selectedFilter}.`
      ));
      return;
    }

    visibleMemories.forEach(memory => {
      list.appendChild(createMemoryCard(memory));
    });
  }

  function sentTooRecently() {
    try {
      const lastSend = Number(localStorage.getItem(lastSendStorageKey) || 0);
      return Date.now() - lastSend < CONFIG.sendInterval;
    } catch {
      return false;
    }
  }

  function registerSendTime() {
    try {
      localStorage.setItem(lastSendStorageKey, String(Date.now()));
    } catch (error) {
      console.warn("Não foi possível registrar o intervalo de envio.", error);
    }
  }

  async function publishMemory(event) {
    event.preventDefault();
    hideStatus();

    const place = selectedPlace();
    const text = textInput.value.trim();
    const typedName = cleanText(nameInput.value);
    const name = typedName.length >= 2 ? typedName : "Visitante";

    if (!place) {
      showStatus("Escolha ou digite o nome da comunidade.", "error");
      placeSelect.focus();
      return;
    }

    if (text.length < CONFIG.minCharacters) {
      showStatus(`Escreva pelo menos ${CONFIG.minCharacters} caracteres.`, "error");
      textInput.focus();
      return;
    }

    if (sentTooRecently()) {
      showStatus("Aguarde um minuto antes de publicar outra memória.", "error");
      return;
    }

    submitButton.disabled = true;
    submitLabel.textContent = "Publicando...";

    try {
      await addDoc(collection(db, CONFIG.collectionName), {
        site: CONFIG.site,
        localidade: place.slice(0, 50),
        nome: name.slice(0, 40),
        texto: text.slice(0, CONFIG.maxCharacters),
        aprovado: true,
        curtidas: 0,
        createdAt: serverTimestamp()
      });

      registerSendTime();
      form.reset();
      updateOtherField();
      updateForm();
      showStatus("Sua memória foi publicada no mural do Conecta Vera Cruz!", "success");
      textInput.focus();
    } catch (error) {
      console.error("Erro ao publicar memória:", error);
      showStatus(errorMessage(error, "Não foi possível publicar a memória."), "error");
    } finally {
      submitLabel.textContent = "Publicar memória";
      updateForm();
    }
  }

  function startRealtimeFeed() {
    list.replaceChildren(emptyState("Carregando memórias..."));

    const memoriesQuery = query(
      collection(db, CONFIG.collectionName),
      where("aprovado", "==", true),
      limit(100)
    );

    onSnapshot(
      memoriesQuery,
      snapshot => {
        memories = snapshot.docs
          .map(document => ({ id: document.id, ...document.data() }))
          .filter(memory => memory.site === CONFIG.site)
          .sort((a, b) => {
            const timeA = a.createdAt?.seconds || 0;
            const timeB = b.createdAt?.seconds || 0;
            return timeB - timeA;
          });

        firebaseReady = true;
        hideStatus();
        updateForm();
        renderMemories();
      },
      error => {
        console.error("Erro ao carregar memórias:", error);
        firebaseReady = false;
        updateForm();
        count.textContent = "Mural indisponível";
        list.replaceChildren(emptyState(
          "Não foi possível carregar o mural",
          errorMessage(error, "Confira o Firebase e tente novamente.")
        ));
        showStatus(errorMessage(error, "Não foi possível carregar as memórias."), "error");
      }
    );
  }

  placeSelect.addEventListener("change", updateOtherField);
  otherInput.addEventListener("input", updateForm);
  textInput.addEventListener("input", updateForm);
  filter.addEventListener("change", renderMemories);
  form.addEventListener("submit", publishMemory);

  updateOtherField();
  updateForm();
  startRealtimeFeed();
}
