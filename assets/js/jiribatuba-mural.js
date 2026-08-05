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
    name: document.querySelector("#jiri-mural-nome"),
    message: document.querySelector("#jiri-mural-mensagem"),
    counter: document.querySelector("#jiri-mural-contador"),
    warning: document.querySelector("#jiri-mural-aviso"),
    submit: document.querySelector("#jiri-mural-enviar"),
    status: document.querySelector("#jiri-mural-status"),
    total: document.querySelector("#jiri-mural-total"),
    list: document.querySelector("#jiri-mural-lista")
  };

  if (Object.values(elements).some((element) => !element)) return;

  const LOCATION = "Jiribatuba";
  const COLLECTION = "memorias";
  const MIN_LENGTH = 10;
  const MAX_LENGTH = 500;
  const WAIT_MS = 60_000;
  const STORAGE_KEY = "cv-jiribatuba-last-post";
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
      if (data.aprovado === false || data.localidade !== LOCATION) return;
      memories.push({ id: document.id, ...data });
    });

    memories.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });

    elements.total.textContent = memories.length === 1 ? "1 publicação" : `${memories.length} publicações`;

    if (!memories.length) {
      elements.list.innerHTML = '<div class="jiri-memory-empty">Ainda não há memórias publicadas sobre Jiribatuba. A primeira pode ser a sua.</div>';
      return;
    }

    elements.list.innerHTML = memories.map((memory) => {
      const name = escapeHtml(memory.nome || "Visitante");
      const text = escapeHtml(memory.texto || "");
      return `
        <article class="jiri-memory-item">
          <div class="jiri-memory-item__top">
            <strong>${name}</strong>
            <time>${formatDate(memory.createdAt)}</time>
          </div>
          <p>${text}</p>
        </article>
      `;
    }).join("");
  }

  async function submitMemory() {
    if (!validate()) return;

    const now = Date.now();
    const lastPost = Number(localStorage.getItem(STORAGE_KEY) || 0);
    const elapsed = now - lastPost;

    if (elapsed < WAIT_MS) {
      const remaining = Math.ceil((WAIT_MS - elapsed) / 1000);
      setStatus(`Aguarde ${remaining} segundos antes de publicar novamente.`, "warning");
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
      setStatus(
        error?.code === "permission-denied"
          ? "O Firebase bloqueou a publicação. Verifique as regras da coleção memorias."
          : "Não foi possível publicar agora. Tente novamente em alguns instantes.",
        "error"
      );
    } finally {
      elements.submit.innerHTML = '<span aria-hidden="true">✦</span> Publicar memória';
      validate();
    }
  }

  elements.message.addEventListener("input", validate);
  elements.submit.addEventListener("click", submitMemory);

  try {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    database = firebase.firestore();
    elements.list.innerHTML = '<div class="jiri-memory-empty">Conectando ao mural do Conecta Vera Cruz...</div>';

    database.collection(COLLECTION)
      .where("localidade", "==", LOCATION)
      .onSnapshot(renderMemories, (error) => {
        console.error("Erro ao carregar memórias:", error);
        elements.list.innerHTML = '<div class="jiri-memory-empty">Não foi possível carregar o mural neste momento.</div>';
      });
  } catch (error) {
    console.error("Erro ao iniciar Firebase:", error);
    elements.list.innerHTML = '<div class="jiri-memory-empty">O mural não pôde ser iniciado.</div>';
  }

  validate();
})();
