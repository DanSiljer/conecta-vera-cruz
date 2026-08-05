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

  const elements = {
    name: document.querySelector("#cp-mural-nome"),
    message: document.querySelector("#cp-mural-mensagem"),
    counter: document.querySelector("#cp-mural-contador"),
    warning: document.querySelector("#cp-mural-aviso"),
    submit: document.querySelector("#cp-mural-enviar"),
    status: document.querySelector("#cp-mural-status"),
    total: document.querySelector("#cp-mural-total"),
    list: document.querySelector("#cp-mural-lista")
  };

  if (Object.values(elements).some((element) => !element)) return;

  const LOCATION = "Cacha-Pregos";
  const COLLECTION = "memorias";
  const MIN_LENGTH = 10;
  const MAX_LENGTH = 500;
  const WAIT_MS = 60_000;
  const STORAGE_KEY = "cv-cacha-pregos-last-post";

  let database;

  function escapeHtml(value = "") {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatDate(timestamp) {
    if (!timestamp?.toDate) return "Agora";

    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(timestamp.toDate());
  }

  function setStatus(message, type = "") {
    elements.status.textContent = message;
    elements.status.dataset.type = type;
  }

  function validate() {
    const text = elements.message.value.trim();
    const length = text.length;

    elements.counter.textContent = `${length} de ${MAX_LENGTH}`;

    if (!length) {
      elements.warning.textContent = "";
      elements.submit.disabled = true;
      return false;
    }

    if (length < MIN_LENGTH) {
      elements.warning.textContent = `Escreva pelo menos ${MIN_LENGTH} caracteres.`;
      elements.submit.disabled = true;
      return false;
    }

    elements.warning.textContent = "";
    elements.submit.disabled = false;
    return true;
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

    memories.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });

    elements.total.textContent =
      memories.length === 1
        ? "1 publicação"
        : `${memories.length} publicações`;

    if (!memories.length) {
      elements.list.innerHTML = `
        <div class="cp-memory-empty">
          Ainda não há memórias publicadas sobre Cacha-Pregos.
          A primeira pode ser a sua.
        </div>
      `;
      return;
    }

    elements.list.innerHTML = memories
      .map((memory) => {
        const name = escapeHtml(memory.nome || "Visitante");
        const text = escapeHtml(memory.texto || "");

        return `
          <article class="cp-memory-item">
            <div class="cp-memory-item__top">
              <strong>${name}</strong>
              <time>${formatDate(memory.createdAt)}</time>
            </div>
            <p>${text}</p>
          </article>
        `;
      })
      .join("");
  }

  async function submitMemory() {
    if (!validate()) return;

    const now = Date.now();
    const lastPost = Number(localStorage.getItem(STORAGE_KEY) || 0);
    const elapsed = now - lastPost;

    if (elapsed < WAIT_MS) {
      const remainingSeconds = Math.ceil((WAIT_MS - elapsed) / 1000);
      setStatus(
        `Aguarde ${remainingSeconds} segundos antes de publicar novamente.`,
        "warning"
      );
      return;
    }

    const name = elements.name.value.trim() || "Visitante";
    const text = elements.message.value.trim();

    elements.submit.disabled = true;
    elements.submit.textContent = "Publicando...";
    setStatus("");

    try {
      await database.collection(COLLECTION).add({
        site: "Conecta Vera Cruz",
        localidade: LOCATION,
        nome: name.slice(0, 40),
        texto: text.slice(0, MAX_LENGTH),
        aprovado: true,
        curtidas: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      localStorage.setItem(STORAGE_KEY, String(now));
      elements.name.value = "";
      elements.message.value = "";
      validate();
      setStatus("Memória publicada com sucesso.", "success");
    } catch (error) {
      console.error("Erro ao publicar memória:", error);

      if (error?.code === "permission-denied") {
        setStatus(
          "O Firebase bloqueou a publicação. Verifique as regras da coleção memorias.",
          "error"
        );
      } else {
        setStatus(
          "Não foi possível publicar agora. Tente novamente em alguns instantes.",
          "error"
        );
      }
    } finally {
      elements.submit.textContent = "✦ Publicar memória";
      validate();
    }
  }

  elements.message.addEventListener("input", validate);
  elements.submit.addEventListener("click", submitMemory);

  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    database = firebase.firestore();

    elements.list.innerHTML = `
      <div class="cp-memory-empty">
        Conectando ao mural do Conecta Vera Cruz...
      </div>
    `;

    database
      .collection(COLLECTION)
      .where("localidade", "==", LOCATION)
      .onSnapshot(renderMemories, (error) => {
        console.error("Erro ao carregar memórias:", error);

        elements.list.innerHTML = `
          <div class="cp-memory-empty">
            Não foi possível carregar o mural neste momento.
          </div>
        `;
      });
  } catch (error) {
    console.error("Erro ao iniciar Firebase:", error);

    elements.list.innerHTML = `
      <div class="cp-memory-empty">
        O mural não pôde ser iniciado.
      </div>
    `;
  }

  validate();
})();
