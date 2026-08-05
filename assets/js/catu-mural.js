(() => {
  "use strict";

  const firebaseConfig = {
    apiKey: "AIzaSyBcsIZO9G_h7mTtWt-sBb6MFDC9_chpzMk",
    authDomain: "conecta-vera-cruz.firebaseapp.com",
    projectId: "conecta-vera-cruz",
    storageBucket: "conecta-vera-cruz.firebasestorage.app",
    messagingSenderId: "918702884700",
    appId: "1:918702884700:web:01b59897dd18f3ff65a399"
  };

  const LOCATION = "Catu";
  const COLLECTION = "memorias";
  const MIN_LENGTH = 10;
  const MAX_LENGTH = 500;
  const PUBLICATION_WAIT_MS = 60_000;

  const LAST_POST_KEY = "cv-catu-last-post";
  const LIKED_MEMORIES_KEY = "cv-catu-liked-memories";

  const elements = {
    name: document.querySelector("#vc-catu-nome"),
    message: document.querySelector("#vc-catu-mensagem"),
    warning: document.querySelector("#vc-catu-aviso"),
    counter: document.querySelector("#vc-catu-contador"),
    submit: document.querySelector("#vc-catu-enviar"),
    status: document.querySelector("#vc-catu-status"),
    total: document.querySelector("#vc-catu-total"),
    list: document.querySelector("#vc-catu-lista")
  };

  if (Object.values(elements).some((element) => !element)) {
    console.warn("Mural de Catu: elementos obrigatórios não encontrados.");
    return;
  }

  let database = null;
  let sending = false;

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setStatus(message, type = "") {
    elements.status.textContent = message;
    elements.status.dataset.type = type;
  }

  function getLikedMemoryIds() {
    try {
      const saved = localStorage.getItem(LIKED_MEMORIES_KEY);
      const parsed = saved ? JSON.parse(saved) : [];

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn("Não foi possível ler as curtidas locais.", error);
      return [];
    }
  }

  function saveLikedMemoryIds(ids) {
    try {
      localStorage.setItem(
        LIKED_MEMORIES_KEY,
        JSON.stringify(Array.from(new Set(ids)))
      );
    } catch (error) {
      console.warn("Não foi possível salvar as curtidas locais.", error);
    }
  }

  function formatDate(timestamp) {
    if (!timestamp?.toDate) return "Agora";

    try {
      return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(timestamp.toDate());
    } catch (error) {
      console.warn("Não foi possível formatar a data.", error);
      return "Data não informada";
    }
  }

  function validateMessage() {
    const text = elements.message.value.trim();
    const length = text.length;

    elements.counter.textContent = `${length} de ${MAX_LENGTH}`;

    if (!length) {
      elements.warning.textContent = "";
      elements.submit.disabled = true;
      return false;
    }

    if (length < MIN_LENGTH) {
      elements.warning.textContent =
        `Escreva pelo menos ${MIN_LENGTH} caracteres.`;
      elements.submit.disabled = true;
      return false;
    }

    if (length > MAX_LENGTH) {
      elements.warning.textContent =
        `O limite é de ${MAX_LENGTH} caracteres.`;
      elements.submit.disabled = true;
      return false;
    }

    elements.warning.textContent = "";
    elements.submit.disabled = sending;
    return true;
  }

  function renderEmptyState(message) {
    elements.list.innerHTML = `
      <div class="vc-memory-empty">
        ${escapeHtml(message)}
      </div>
    `;
  }

  function renderMemories(snapshot) {
    const memories = [];

    snapshot.forEach((document) => {
      const data = document.data();

      if (data.aprovado === false) return;
      if (data.localidade !== LOCATION) return;

      memories.push({
        id: document.id,
        ...data
      });
    });

    memories.sort((first, second) => {
      const firstTime = first.createdAt?.toMillis?.() || 0;
      const secondTime = second.createdAt?.toMillis?.() || 0;

      return secondTime - firstTime;
    });

    elements.total.textContent =
      memories.length === 1
        ? "1 publicação"
        : `${memories.length} publicações`;

    if (!memories.length) {
      renderEmptyState(
        "Ainda não há memórias publicadas sobre Catu. A primeira pode ser a sua."
      );
      return;
    }

    const likedIds = getLikedMemoryIds();

    elements.list.innerHTML = memories
      .map((memory) => {
        const name = escapeHtml(memory.nome || "Visitante");
        const text = escapeHtml(memory.texto || "");
        const likes = Number(memory.curtidas || 0);
        const liked = likedIds.includes(memory.id);

        return `
          <article class="vc-memory-item">
            <div class="vc-memory-item__top">
              <strong>${name}</strong>
              <time>${formatDate(memory.createdAt)}</time>
            </div>

            <p>${text}</p>

            <div class="vc-memory-item__actions">
              <button
                class="vc-like-button"
                type="button"
                data-memory-like="${escapeHtml(memory.id)}"
                ${liked ? "disabled" : ""}
                aria-label="${
                  liked
                    ? "Você já curtiu esta memória"
                    : "Curtir esta memória"
                }"
              >
                <span aria-hidden="true">${liked ? "♥" : "♡"}</span>
                <span>${likes}</span>
              </button>
            </div>
          </article>
        `;
      })
      .join("");

    elements.list
      .querySelectorAll("[data-memory-like]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          likeMemory(button);
        });
      });
  }

  async function likeMemory(button) {
    if (!database || button.disabled) return;

    const documentId = button.dataset.memoryLike;

    if (!documentId) return;

    const likedIds = getLikedMemoryIds();

    if (likedIds.includes(documentId)) {
      button.disabled = true;
      return;
    }

    button.disabled = true;

    try {
      await database
        .collection(COLLECTION)
        .doc(documentId)
        .update({
          curtidas: firebase.firestore.FieldValue.increment(1)
        });

      likedIds.push(documentId);
      saveLikedMemoryIds(likedIds);
    } catch (error) {
      console.error("Erro ao curtir memória:", error);
      button.disabled = false;

      if (error?.code === "permission-denied") {
        setStatus(
          "As regras do Firebase ainda não permitem curtidas.",
          "warning"
        );
      } else {
        setStatus(
          "Não foi possível registrar a curtida agora.",
          "error"
        );
      }
    }
  }

  function getRemainingWaitTime() {
    const lastPost = Number(
      localStorage.getItem(LAST_POST_KEY) || 0
    );

    const elapsed = Date.now() - lastPost;

    return Math.max(0, PUBLICATION_WAIT_MS - elapsed);
  }

  async function submitMemory() {
    if (sending || !validateMessage() || !database) return;

    const remainingWait = getRemainingWaitTime();

    if (remainingWait > 0) {
      const remainingSeconds = Math.ceil(remainingWait / 1000);

      setStatus(
        `Aguarde ${remainingSeconds} segundos antes de publicar novamente.`,
        "warning"
      );

      return;
    }

    const name =
      elements.name.value.trim().slice(0, 40) || "Visitante";

    const text =
      elements.message.value.trim().slice(0, MAX_LENGTH);

    sending = true;
    elements.submit.disabled = true;
    elements.submit.innerHTML = "Publicando...";
    setStatus("");

    try {
      await database.collection(COLLECTION).add({
        site: "Conecta Vera Cruz",
        localidade: LOCATION,
        nome: name,
        texto: text,
        aprovado: true,
        curtidas: 0,
        createdAt:
          firebase.firestore.FieldValue.serverTimestamp()
      });

      localStorage.setItem(
        LAST_POST_KEY,
        String(Date.now())
      );

      elements.name.value = "";
      elements.message.value = "";

      setStatus(
        "Memória publicada com sucesso.",
        "success"
      );
    } catch (error) {
      console.error("Erro ao publicar memória:", error);

      if (error?.code === "permission-denied") {
        setStatus(
          "O Firebase bloqueou a publicação. Verifique as regras da coleção memorias.",
          "error"
        );
      } else if (error?.code === "unavailable") {
        setStatus(
          "O mural está temporariamente indisponível. Tente novamente.",
          "error"
        );
      } else {
        setStatus(
          "Não foi possível publicar agora. Tente novamente em alguns instantes.",
          "error"
        );
      }
    } finally {
      sending = false;
      elements.submit.innerHTML =
        '<span aria-hidden="true">✦</span> Publicar memória';
      validateMessage();
    }
  }

  elements.message.addEventListener(
    "input",
    validateMessage
  );

  elements.submit.addEventListener(
    "click",
    submitMemory
  );

  elements.message.addEventListener(
    "keydown",
    (event) => {
      if (
        event.ctrlKey &&
        event.key === "Enter"
      ) {
        submitMemory();
      }
    }
  );

  try {
    if (!window.firebase) {
      throw new Error(
        "A biblioteca Firebase não foi carregada."
      );
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    database = firebase.firestore();

    renderEmptyState(
      "Conectando ao mural do Conecta Vera Cruz..."
    );

    database
      .collection(COLLECTION)
      .where("localidade", "==", LOCATION)
      .onSnapshot(
        renderMemories,
        (error) => {
          console.error(
            "Erro ao carregar memórias:",
            error
          );

          renderEmptyState(
            "Não foi possível carregar o mural neste momento."
          );
        }
      );
  } catch (error) {
    console.error(
      "Erro ao iniciar Firebase:",
      error
    );

    renderEmptyState(
      "O mural não pôde ser iniciado."
    );

    setStatus(
      "Verifique se os scripts do Firebase foram carregados.",
      "error"
    );
  }

  validateMessage();
})();
