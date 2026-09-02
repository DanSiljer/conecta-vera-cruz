import { db } from "./firebase-config.js";
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  where
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

const CONFIG = {
  site: "Conecta Vera Cruz",
  collectionName: "blogComentarios",
  minNameLength: 2,
  maxNameLength: 50,
  minTextLength: 2,
  maxTextLength: 220,
  sendInterval: 30_000,
  readLimit: 200
};

const SELECTOR = "[data-blog-comments]";
const initialized = new WeakSet();
const unsubscribers = new WeakMap();

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function initials(name) {
  const parts = cleanText(name).split(" ").filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0][0]}${parts.at(-1)[0]}`.toUpperCase();
}

function formatDate(value) {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "Agora";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function make(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function storageKey(slug, suffix) {
  return `conecta-blog:${suffix}:${slug}`;
}

function loadSavedName(slug) {
  try {
    return localStorage.getItem(storageKey(slug, "nome")) || "";
  } catch {
    return "";
  }
}

function saveName(slug, name) {
  try {
    localStorage.setItem(storageKey(slug, "nome"), name);
  } catch {
    /* O comentário continua funcionando mesmo sem armazenamento local. */
  }
}

function sentTooRecently(slug) {
  try {
    const lastSend = Number(localStorage.getItem(storageKey(slug, "ultimo-envio")) || 0);
    return Date.now() - lastSend < CONFIG.sendInterval;
  } catch {
    return false;
  }
}

function registerSend(slug) {
  try {
    localStorage.setItem(storageKey(slug, "ultimo-envio"), String(Date.now()));
  } catch {
    /* O intervalo é apenas uma proteção adicional no navegador. */
  }
}

function readableError(error) {
  const code = String(error?.code || "erro-desconhecido");

  if (code.includes("permission-denied")) {
    return "O Firebase recusou o acesso. Publique as regras atualizadas do Firestore.";
  }

  if (code.includes("unavailable")) {
    return "As mensagens estão temporariamente indisponíveis. Tente novamente em instantes.";
  }

  if (code.includes("failed-precondition")) {
    return "O Firestore pediu um índice para esta consulta. Abra o link indicado no Console do navegador e crie o índice sugerido.";
  }

  return `Não foi possível acessar as mensagens. (${code})`;
}

function initCommentBox(section) {
  if (initialized.has(section)) return;
  initialized.add(section);

  const postSlug = cleanText(section.dataset.postSlug);
  if (!postSlug) {
    section.replaceChildren(make("p", "blog-comment-empty", "Esta publicação não possui identificação para receber mensagens."));
    return;
  }

  let comments = [];

  const heading = make("div", "blog-featured-comments__heading");
  const title = make("strong", "", "Comentários");
  const total = make("span", "blog-featured-comments__total", "Carregando...");
  heading.append(title, total);

  const form = make("form", "blog-comment-form");
  const avatar = make("span", "blog-comment-form__avatar", "N");
  avatar.setAttribute("aria-hidden", "true");

  const fields = make("div", "blog-comment-form__fields");
  const nameInput = document.createElement("input");
  nameInput.className = "blog-comment-form__name";
  nameInput.type = "text";
  nameInput.name = "nome";
  nameInput.maxLength = CONFIG.maxNameLength;
  nameInput.autocomplete = "name";
  nameInput.placeholder = "Seu nome";
  nameInput.required = true;
  nameInput.setAttribute("aria-label", "Seu nome");
  nameInput.value = loadSavedName(postSlug);

  const messageInput = document.createElement("input");
  messageInput.className = "blog-comment-form__input";
  messageInput.type = "text";
  messageInput.name = "mensagem";
  messageInput.maxLength = CONFIG.maxTextLength;
  messageInput.autocomplete = "off";
  messageInput.placeholder = "Escreva uma mensagem...";
  messageInput.required = true;
  messageInput.setAttribute("aria-label", "Escreva uma mensagem");

  fields.append(nameInput, messageInput);

  const send = make("button", "blog-comment-form__send", "Publicar");
  send.type = "submit";
  send.disabled = true;
  form.append(avatar, fields, send);

  const status = make("p", "blog-comment-status");
  status.setAttribute("aria-live", "polite");

  const list = make("div", "blog-comment-list");
  list.setAttribute("aria-live", "polite");
  list.appendChild(make("p", "blog-comment-empty", "Carregando comentários..."));

  function setStatus(message, type = "info") {
    status.textContent = message;
    status.dataset.status = type;
  }

  function updateMainForm() {
    const name = cleanText(nameInput.value);
    const text = cleanText(messageInput.value);
    send.disabled = name.length < CONFIG.minNameLength || text.length < CONFIG.minTextLength;
    avatar.textContent = initials(name || "N");
  }

  async function publish(data, button, successMessage) {
    if (sentTooRecently(postSlug)) {
      setStatus("Aguarde alguns segundos antes de publicar outra mensagem.", "error");
      return false;
    }

    button.disabled = true;
    const oldText = button.textContent;
    button.textContent = "Publicando...";

    try {
      await addDoc(collection(db, CONFIG.collectionName), {
        site: CONFIG.site,
        postSlug,
        nome: data.nome.slice(0, CONFIG.maxNameLength),
        texto: data.texto.slice(0, CONFIG.maxTextLength),
        parentId: data.parentId || "",
        parentName: data.parentName || "",
        aprovado: true,
        createdAt: serverTimestamp()
      });

      registerSend(postSlug);
      saveName(postSlug, data.nome);
      setStatus(successMessage, "success");
      return true;
    } catch (error) {
      console.error("Erro ao publicar mensagem do blog:", error);
      setStatus(readableError(error), "error");
      return false;
    } finally {
      button.textContent = oldText;
      updateMainForm();
    }
  }

  function createReplyForm(comment, host) {
    document.querySelectorAll(".blog-comment-reply-form").forEach(node => node.remove());

    const replyForm = make("form", "blog-comment-reply-form");
    replyForm.setAttribute("aria-label", `Responder a ${comment.nome}`);

    const notice = make(
      "span",
      "blog-comment-reply-form__notice",
      `Respondendo a ${comment.nome}`
    );

    const replyFields = make("div", "blog-comment-reply-form__fields");
    const replyName = document.createElement("input");
    replyName.type = "text";
    replyName.name = "nomeResposta";
    replyName.maxLength = CONFIG.maxNameLength;
    replyName.autocomplete = "name";
    replyName.placeholder = "Seu nome";
    replyName.required = true;
    replyName.value = cleanText(nameInput.value) || loadSavedName(postSlug);
    replyName.setAttribute("aria-label", "Seu nome para responder");

    const replyText = document.createElement("input");
    replyText.type = "text";
    replyText.name = "textoResposta";
    replyText.maxLength = CONFIG.maxTextLength;
    replyText.autocomplete = "off";
    replyText.placeholder = "Escreva sua resposta...";
    replyText.required = true;
    replyText.setAttribute("aria-label", `Resposta para ${comment.nome}`);

    replyFields.append(replyName, replyText);

    const actions = make("div", "blog-comment-reply-form__actions");
    const cancel = make("button", "blog-comment-reply-form__cancel", "Cancelar");
    cancel.type = "button";
    const answer = make("button", "blog-comment-reply-form__publish", "Responder");
    answer.type = "submit";
    answer.disabled = true;
    actions.append(cancel, answer);

    function updateReplyForm() {
      answer.disabled =
        cleanText(replyName.value).length < CONFIG.minNameLength ||
        cleanText(replyText.value).length < CONFIG.minTextLength;
    }

    replyName.addEventListener("input", updateReplyForm);
    replyText.addEventListener("input", updateReplyForm);
    cancel.addEventListener("click", () => replyForm.remove());

    replyForm.addEventListener("submit", async event => {
      event.preventDefault();
      const name = cleanText(replyName.value);
      const text = cleanText(replyText.value);

      if (name.length < CONFIG.minNameLength || text.length < CONFIG.minTextLength) {
        setStatus("Informe seu nome e escreva a resposta.", "error");
        return;
      }

      const published = await publish(
        {
          nome: name,
          texto: text,
          parentId: comment.id,
          parentName: comment.nome
        },
        answer,
        `Sua resposta para ${comment.nome} foi publicada para todos.`
      );

      if (published) {
        nameInput.value = name;
        updateMainForm();
        replyForm.remove();
      }
    });

    replyForm.append(notice, replyFields, actions);
    host.appendChild(replyForm);
    updateReplyForm();
    replyText.focus();
  }

  function renderReply(reply, comment) {
    const article = make("article", "blog-comment-reply");
    const replyAvatar = make(
      "span",
      "blog-comment__avatar blog-comment__avatar--reply",
      initials(reply.nome)
    );
    replyAvatar.setAttribute("aria-hidden", "true");

    const body = make("div", "blog-comment__body");
    const line = make("p", "blog-comment__text");
    const author = make("strong", "", reply.nome);
    const destination = make(
      "span",
      "blog-comment__destination",
      ` respondeu a ${comment.nome}`
    );
    line.append(author, destination, document.createTextNode(` ${reply.texto}`));

    const meta = make("div", "blog-comment__meta");
    meta.appendChild(make("time", "", formatDate(reply.createdAt)));
    body.append(line, meta);
    article.append(replyAvatar, body);
    return article;
  }

  function renderComments() {
    const totalMessages = comments.length;
    total.textContent = totalMessages === 1 ? "1 mensagem" : `${totalMessages} mensagens`;

    const roots = comments
      .filter(comment => !comment.parentId)
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

    if (!roots.length) {
      list.replaceChildren(
        make("p", "blog-comment-empty", "Seja a primeira pessoa a deixar uma mensagem.")
      );
      return;
    }

    const repliesByParent = new Map();
    comments
      .filter(comment => comment.parentId)
      .sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0))
      .forEach(reply => {
        const group = repliesByParent.get(reply.parentId) || [];
        group.push(reply);
        repliesByParent.set(reply.parentId, group);
      });

    const items = roots.map(comment => {
      const article = make("article", "blog-comment");
      const commentAvatar = make("span", "blog-comment__avatar", initials(comment.nome));
      commentAvatar.setAttribute("aria-hidden", "true");

      const body = make("div", "blog-comment__body");
      const line = make("p", "blog-comment__text");
      const author = make("strong", "", comment.nome);
      line.append(author, document.createTextNode(` ${comment.texto}`));

      const meta = make("div", "blog-comment__meta");
      const date = make("time", "", formatDate(comment.createdAt));
      const reply = make("button", "blog-comment__reply", "Responder");
      reply.type = "button";
      reply.addEventListener("click", () => createReplyForm(comment, body));
      meta.append(date, reply);
      body.append(line, meta);

      const replies = repliesByParent.get(comment.id) || [];
      if (replies.length) {
        const repliesContainer = make("div", "blog-comment-replies");
        replies.forEach(item => repliesContainer.appendChild(renderReply(item, comment)));
        body.appendChild(repliesContainer);
      }

      article.append(commentAvatar, body);
      return article;
    });

    list.replaceChildren(...items);
  }

  nameInput.addEventListener("input", updateMainForm);
  messageInput.addEventListener("input", updateMainForm);

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const name = cleanText(nameInput.value);
    const text = cleanText(messageInput.value);

    if (name.length < CONFIG.minNameLength || text.length < CONFIG.minTextLength) {
      setStatus("Informe seu nome e escreva a mensagem.", "error");
      return;
    }

    const published = await publish(
      { nome: name, texto: text, parentId: "", parentName: "" },
      send,
      "Sua mensagem foi publicada e já pode ser vista por todos."
    );

    if (published) {
      messageInput.value = "";
      updateMainForm();
      messageInput.focus();
    }
  });

  section.replaceChildren(heading, form, status, list);
  updateMainForm();

  const commentsQuery = query(
    collection(db, CONFIG.collectionName),
    where("site", "==", CONFIG.site),
    where("aprovado", "==", true),
    limit(CONFIG.readLimit)
  );

  let receivedFirstSnapshot = false;
  const loadingTimer = window.setTimeout(() => {
    if (receivedFirstSnapshot) return;
    total.textContent = "Conexão lenta";
    list.replaceChildren(
      make("p", "blog-comment-empty", "As mensagens demoraram para carregar. Confira a conexão e as regras do Firestore.")
    );
  }, 8000);

  const unsubscribe = onSnapshot(
    commentsQuery,
    snapshot => {
      receivedFirstSnapshot = true;
      window.clearTimeout(loadingTimer);
      comments = snapshot.docs
        .map(document => ({ id: document.id, ...document.data() }))
        .filter(comment => comment.site === CONFIG.site && comment.postSlug === postSlug);
      renderComments();
    },
    error => {
      receivedFirstSnapshot = true;
      window.clearTimeout(loadingTimer);
      console.error("Erro ao carregar mensagens do blog:", error);
      total.textContent = "Comentários indisponíveis";
      list.replaceChildren(make("p", "blog-comment-empty", readableError(error)));
      setStatus(readableError(error), "error");
    }
  );

  unsubscribers.set(section, unsubscribe);
}

function initializeTree(root = document) {
  if (root.matches?.(SELECTOR)) initCommentBox(root);
  root.querySelectorAll?.(SELECTOR).forEach(initCommentBox);
}

function cleanupTree(root) {
  const sections = [];
  if (root.matches?.(SELECTOR)) sections.push(root);
  root.querySelectorAll?.(SELECTOR).forEach(section => sections.push(section));

  sections.forEach(section => {
    const unsubscribe = unsubscribers.get(section);
    if (unsubscribe) unsubscribe();
    unsubscribers.delete(section);
  });
}

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) initializeTree(node);
    });
    mutation.removedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) cleanupTree(node);
    });
  });
});

initializeTree();
observer.observe(document.documentElement, { childList: true, subtree: true });
