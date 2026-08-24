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

  const CONFIG = {
    site: "Conecta Vera Cruz",
    localidade: "Penha",
    colecao: "memorias",
    maximo: 500,
    minimo: 10,
    intervalo: 60000
  };

  const nomeInput = document.getElementById("vc-penha-nome");
  const mensagemInput = document.getElementById("vc-penha-mensagem");
  const enviarButton = document.getElementById("vc-penha-enviar");
  const lista = document.getElementById("vc-penha-lista");
  const contador = document.getElementById("vc-penha-contador");
  const total = document.getElementById("vc-penha-total");
  const aviso = document.getElementById("vc-penha-aviso");
  const status = document.getElementById("vc-penha-status");

  if (!nomeInput || !mensagemInput || !enviarButton || !lista || !contador || !total || !aviso || !status) return;

  const LIKES_KEY = "conecta-vera-cruz-curtidas-penha-v1";
  const LAST_SEND_KEY = "conecta-vera-cruz-ultimo-envio-penha-v1";
  let db = null;
  let ready = false;
  let posts = [];
  let liked = loadLiked();

  function showStatus(message, type = "info") {
    status.textContent = message;
    status.className = `vc-send-status is-visible ${type}`;
  }

  function hideStatus() {
    status.textContent = "";
    status.className = "vc-send-status";
  }

  function loadLiked() {
    try {
      const value = JSON.parse(localStorage.getItem(LIKES_KEY) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function saveLiked() {
    try { localStorage.setItem(LIKES_KEY, JSON.stringify(liked)); } catch {}
  }

  function normalize(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function initials(name) {
    const clean = normalize(name);
    if (!clean || clean === "Visitante") return "VC";
    const parts = clean.split(" ");
    return parts.length === 1 ? parts[0].slice(0, 2).toUpperCase() : (parts[0][0] + parts.at(-1)[0]).toUpperCase();
  }

  function formatDate(value) {
    const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
    if (!date || Number.isNaN(date.getTime())) return "Agora";
    return date.toLocaleString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  function updateForm() {
    const size = mensagemInput.value.length;
    contador.textContent = `${size} de ${CONFIG.maximo}`;
    const valid = mensagemInput.value.trim().length >= CONFIG.minimo;
    enviarButton.disabled = !ready || !valid;
    aviso.textContent = size > 0 && size < CONFIG.minimo ? `Escreva pelo menos ${CONFIG.minimo} caracteres.` : "";
  }

  function emptyState(message = "Compartilhe a primeira história ou curiosidade sobre a Penha.") {
    const block = document.createElement("div");
    block.className = "vc-empty-state";
    const title = document.createElement("strong");
    title.textContent = "O mural ainda está vazio";
    const text = document.createElement("span");
    text.textContent = message;
    block.append(title, text);
    return block;
  }

  function updateTotal() {
    total.textContent = posts.length === 1 ? "1 publicação" : `${posts.length} publicações`;
  }

  async function toggleLike(post, button) {
    const wasLiked = liked.includes(post.id);
    button.disabled = true;
    try {
      const ref = db.collection(CONFIG.colecao).doc(post.id);
      await db.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(ref);
        if (!snapshot.exists) throw new Error("Publicação não encontrada.");
        const current = Math.max(0, Number(snapshot.data().curtidas || 0));
        transaction.update(ref, { curtidas: wasLiked ? Math.max(0, current - 1) : current + 1 });
      });
      liked = wasLiked ? liked.filter((id) => id !== post.id) : [...liked, post.id];
      saveLiked();
    } catch (error) {
      console.error(error);
      showStatus("Não foi possível registrar a curtida.", "erro");
      button.disabled = false;
    }
  }

  function createPost(post) {
    const item = document.createElement("article");
    item.className = "vc-mural-item";

    const header = document.createElement("div");
    header.className = "vc-item-header";
    const avatar = document.createElement("div");
    avatar.className = "vc-avatar";
    avatar.textContent = initials(post.nome);
    const author = document.createElement("div");
    const name = document.createElement("p");
    name.className = "vc-item-name";
    name.textContent = post.nome || "Visitante";
    const date = document.createElement("p");
    date.className = "vc-item-date";
    date.textContent = formatDate(post.createdAt);
    author.append(name, date);
    header.append(avatar, author);

    const text = document.createElement("p");
    text.className = "vc-item-text";
    text.textContent = post.texto || "";

    const footer = document.createElement("div");
    footer.className = "vc-item-footer";
    const like = document.createElement("button");
    const isLiked = liked.includes(post.id);
    const quantity = Math.max(0, Number(post.curtidas || 0));
    like.type = "button";
    like.className = `vc-like-button${isLiked ? " is-liked" : ""}`;
    like.textContent = `${isLiked ? "♥" : "♡"} Curtir${quantity ? ` · ${quantity}` : ""}`;
    like.addEventListener("click", () => toggleLike(post, like));
    const location = document.createElement("span");
    location.className = "vc-location-tag";
    location.textContent = "📍 Penha · Conecta Vera Cruz";
    footer.append(like, location);

    item.append(header, text, footer);
    return item;
  }

  function render() {
    lista.replaceChildren();
    updateTotal();
    if (!posts.length) {
      lista.append(emptyState());
      return;
    }
    posts.forEach((post) => lista.append(createPost(post)));
  }

  function sentTooSoon() {
    try { return Date.now() - Number(localStorage.getItem(LAST_SEND_KEY) || 0) < CONFIG.intervalo; } catch { return false; }
  }

  async function publish() {
    const text = mensagemInput.value.trim();
    if (text.length < CONFIG.minimo) {
      aviso.textContent = `Escreva pelo menos ${CONFIG.minimo} caracteres.`;
      mensagemInput.focus();
      return;
    }
    if (sentTooSoon()) {
      showStatus("Aguarde um minuto antes de enviar outra publicação.", "erro");
      return;
    }

    enviarButton.disabled = true;
    enviarButton.innerHTML = '<span aria-hidden="true">✦</span> Publicando...';
    hideStatus();

    try {
      await db.collection(CONFIG.colecao).add({
        site: CONFIG.site,
        localidade: CONFIG.localidade,
        nome: normalize(nomeInput.value).slice(0, 40) || "Visitante",
        texto: text.slice(0, CONFIG.maximo),
        aprovado: true,
        curtidas: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      localStorage.setItem(LAST_SEND_KEY, String(Date.now()));
      nomeInput.value = "";
      mensagemInput.value = "";
      showStatus("Sua memória foi publicada no Conecta Vera Cruz!", "sucesso");
    } catch (error) {
      console.error(error);
      const permission = String(error?.code || "").includes("permission-denied");
      showStatus(permission ? "As regras do Firestore recusaram a publicação. Verifique Firestore Database > Regras." : "Não foi possível publicar a memória agora.", "erro");
    } finally {
      enviarButton.innerHTML = '<span aria-hidden="true">✦</span> Publicar memória';
      updateForm();
    }
  }

  function start() {
    lista.replaceChildren(emptyState("Conectando ao mural..."));
    showStatus("Conectando ao Firebase do Conecta Vera Cruz...", "info");
    try {
      if (!window.firebase?.initializeApp) throw new Error("Firebase não carregado.");
      if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();
      db.collection(CONFIG.colecao)
        .where("aprovado", "==", true)
        .limit(100)
        .onSnapshot((result) => {
          posts = result.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((post) => post.site === CONFIG.site && post.localidade === CONFIG.localidade)
            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
          ready = true;
          hideStatus();
          updateForm();
          render();
        }, (error) => {
          console.error(error);
          ready = false;
          updateForm();
          total.textContent = "Mural indisponível";
          lista.replaceChildren(emptyState("Não foi possível carregar as memórias. Verifique as regras do Firestore."));
          showStatus("Não foi possível carregar o mural.", "erro");
        });
    } catch (error) {
      console.error(error);
      ready = false;
      updateForm();
      total.textContent = "Mural indisponível";
      showStatus("Não foi possível iniciar o Firebase.", "erro");
    }
  }

  mensagemInput.addEventListener("input", updateForm);
  enviarButton.addEventListener("click", publish);
  mensagemInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey) && !enviarButton.disabled) publish();
  });

  updateForm();
  start();
})();
