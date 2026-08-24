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

  const LOCATION = "Mar Grande";
  const COLLECTION = "memorias";
  const MIN_LENGTH = 10;
  const MAX_LENGTH = 500;
  const WAIT_MS = 60_000;
  const LAST_POST_KEY = "cv-mar-grande-last-post";
  const LIKED_KEY = "cv-mar-grande-liked";

  const form = document.querySelector("#mg-memory-form");
  const nameInput = document.querySelector("#mg-memory-name");
  const textInput = document.querySelector("#mg-memory-text");
  const warning = document.querySelector("#mg-memory-warning");
  const count = document.querySelector("#mg-memory-count");
  const submit = document.querySelector("#mg-memory-submit");
  const status = document.querySelector("#mg-memory-status");
  const total = document.querySelector("#mg-memory-total");
  const list = document.querySelector("#mg-memory-list");

  if (!form || !nameInput || !textInput || !warning || !count || !submit || !status || !total || !list) {
    console.warn("Mural de Mar Grande: elementos obrigatórios não encontrados.");
    return;
  }

  let db = null;
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
    status.textContent = message;
    status.dataset.type = type;
  }

  function validate() {
    const length = textInput.value.trim().length;
    count.textContent = `${length} de ${MAX_LENGTH}`;

    if (!length) {
      warning.textContent = "";
      submit.disabled = true;
      return false;
    }

    if (length < MIN_LENGTH) {
      warning.textContent = `Escreva pelo menos ${MIN_LENGTH} caracteres.`;
      submit.disabled = true;
      return false;
    }

    warning.textContent = "";
    submit.disabled = sending;
    return true;
  }

  function likedIds() {
    try {
      const parsed = JSON.parse(localStorage.getItem(LIKED_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveLiked(ids) {
    localStorage.setItem(LIKED_KEY, JSON.stringify([...new Set(ids)]));
  }

  function formatDate(timestamp) {
    if (!timestamp?.toDate) return "Agora";
    try {
      return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(timestamp.toDate());
    } catch {
      return "Data não informada";
    }
  }

  function renderEmpty(message) {
    list.innerHTML = `<div class="mg-memory__empty">${escapeHtml(message)}</div>`;
  }

  function render(snapshot) {
    const memories = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.localidade !== LOCATION || data.aprovado === false) return;
      memories.push({ id: doc.id, ...data });
    });

    memories.sort((a, b) => {
      const first = a.createdAt?.toMillis?.() || 0;
      const second = b.createdAt?.toMillis?.() || 0;
      return second - first;
    });

    total.textContent =
      memories.length === 1 ? "1 publicação" : `${memories.length} publicações`;

    if (!memories.length) {
      renderEmpty("Ainda não há memórias publicadas sobre Mar Grande.");
      return;
    }

    const localLikes = likedIds();

    list.innerHTML = memories.map((memory) => {
      const liked = localLikes.includes(memory.id);
      const likes = Number(memory.curtidas || 0);

      return `
        <article class="mg-memory-card">
          <div class="mg-memory-card__top">
            <strong>${escapeHtml(memory.nome || "Visitante")}</strong>
            <time>${formatDate(memory.createdAt)}</time>
          </div>
          <p>${escapeHtml(memory.texto || "")}</p>
          <div class="mg-memory-card__actions">
            <button
              class="mg-memory-like"
              type="button"
              data-mg-like="${escapeHtml(memory.id)}"
              ${liked ? "disabled" : ""}
            >
              ${liked ? "♥" : "♡"} ${likes}
            </button>
          </div>
        </article>
      `;
    }).join("");

    list.querySelectorAll("[data-mg-like]").forEach((button) => {
      button.addEventListener("click", async () => {
        if (!db || button.disabled) return;

        const id = button.dataset.mgLike;
        const ids = likedIds();

        if (!id || ids.includes(id)) return;

        button.disabled = true;

        try {
          await db.collection(COLLECTION).doc(id).update({
            curtidas: firebase.firestore.FieldValue.increment(1)
          });
          ids.push(id);
          saveLiked(ids);
        } catch (error) {
          console.error("Erro ao curtir memória:", error);
          button.disabled = false;
          setStatus("Não foi possível registrar a curtida.", "error");
        }
      });
    });
  }

  async function publish(event) {
    event.preventDefault();

    if (!db || sending || !validate()) return;

    const lastPost = Number(localStorage.getItem(LAST_POST_KEY) || 0);
    const remaining = WAIT_MS - (Date.now() - lastPost);

    if (remaining > 0) {
      setStatus(
        `Aguarde ${Math.ceil(remaining / 1000)} segundos antes de publicar novamente.`,
        "warning"
      );
      return;
    }

    sending = true;
    submit.disabled = true;
    submit.textContent = "Publicando...";
    setStatus("");

    try {
      await db.collection(COLLECTION).add({
        site: "Conecta Vera Cruz",
        localidade: LOCATION,
        nome: nameInput.value.trim().slice(0, 40) || "Visitante",
        texto: textInput.value.trim().slice(0, MAX_LENGTH),
        aprovado: true,
        curtidas: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      localStorage.setItem(LAST_POST_KEY, String(Date.now()));
      form.reset();
      setStatus("Memória publicada com sucesso.", "success");
    } catch (error) {
      console.error("Erro ao publicar memória:", error);

      if (error?.code === "permission-denied") {
        setStatus(
          "O Firebase bloqueou a publicação. Verifique as regras da coleção memorias.",
          "error"
        );
      } else {
        setStatus("Não foi possível publicar agora.", "error");
      }
    } finally {
      sending = false;
      submit.textContent = "Publicar memória";
      validate();
    }
  }

  textInput.addEventListener("input", validate);
  form.addEventListener("submit", publish);

  try {
    if (!window.firebase) throw new Error("Firebase não carregado.");

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    db = firebase.firestore();

    db.collection(COLLECTION)
      .where("localidade", "==", LOCATION)
      .onSnapshot(render, (error) => {
        console.error("Erro ao carregar mural:", error);
        renderEmpty("Não foi possível carregar o mural neste momento.");
      });
  } catch (error) {
    console.error("Erro ao iniciar mural:", error);
    renderEmpty("O mural não pôde ser iniciado.");
    setStatus("Verifique os scripts e as configurações do Firebase.", "error");
  }

  validate();
})();
