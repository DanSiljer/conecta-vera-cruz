import { auth, db, storage } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import {
  getDownloadURL,
  ref,
  uploadBytes
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-storage.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const els = {
  loginScreen: $("#loginScreen"),
  loginForm: $("#loginForm"),
  loginEmail: $("#loginEmail"),
  loginPassword: $("#loginPassword"),
  loginStatus: $("#loginStatus"),
  adminApp: $("#adminApp"),
  sidebar: $("#adminSidebar"),
  menuToggle: $("#menuToggle"),
  topbarTitle: $("#topbarTitle"),
  userName: $("#userName"),
  userRole: $("#userRole"),
  userInitials: $("#userInitials"),
  logoutButton: $("#logoutButton"),

  metricTotal: $("#metricTotal"),
  metricPublished: $("#metricPublished"),
  metricDrafts: $("#metricDrafts"),
  metricFeatured: $("#metricFeatured"),
  recentPosts: $("#recentPosts"),

  postsTableBody: $("#postsTableBody"),
  postSearch: $("#postSearch"),
  postStatusFilter: $("#postStatusFilter"),

  modal: $("#postEditorModal"),
  editorTitle: $("#editorTitle"),
  editorForm: $("#postEditorForm"),
  editorStatus: $("#editorStatus"),

  postTitle: $("#postTitle"),
  postSlug: $("#postSlug"),
  postSubtitle: $("#postSubtitle"),
  postSummary: $("#postSummary"),
  postDate: $("#postDate"),
  postCategory: $("#postCategory"),
  postTags: $("#postTags"),
  postAuthor: $("#postAuthor"),
  postReadingTime: $("#postReadingTime"),
  postFeatured: $("#postFeatured"),
  postShowHome: $("#postShowHome"),
  postImageFile: $("#postImageFile"),
  postImageAlt: $("#postImageAlt"),
  postImageUrl: $("#postImageUrl"),
  imagePreview: $("#imagePreview"),

  contentBlocks: $("#contentBlocks"),
  contentBlockTemplate: $("#contentBlockTemplate"),
  addContentBlock: $("#addContentBlock"),

  importCurrentBlogButton: $("#importCurrentBlogButton"),
  importStatus: $("#importStatus")
};

const sectionTitles = {
  dashboard: "Visão geral",
  blog: "Blog",
  comunidades: "Comunidades",
  imagens: "Imagens",
  usuarios: "Usuários",
  configuracoes: "Configurações"
};

let currentUser = null;
let currentProfile = null;
let posts = [];
let unsubscribePosts = null;
let editingId = null;
let pendingImageFile = null;
let titleTouchedSlug = false;

function setStatus(element, message = "", type = "") {
  if (!element) return;
  element.textContent = message;
  element.classList.remove("is-error", "is-success");
  if (type) element.classList.add(`is-${type}`);
}

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

function getTodayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDatePtBR(iso) {
  if (!iso) return "";
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

function initials(name) {
  return String(name || "CV")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "CV";
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showLogin() {
  els.loginScreen.hidden = false;
  els.adminApp.hidden = true;
}

function showAdmin() {
  els.loginScreen.hidden = true;
  els.adminApp.hidden = false;
}

async function loadProfile(user) {
  const snap = await getDoc(doc(db, "usuarios", user.uid));
  if (!snap.exists()) {
    throw new Error("Seu usuário ainda não possui perfil administrativo no Firestore.");
  }

  const profile = snap.data();
  const allowedRoles = ["admin", "editor"];

  if (profile.ativo === false || !allowedRoles.includes(profile.role)) {
    throw new Error("Este usuário não tem permissão para acessar o painel.");
  }

  return profile;
}

function applyProfile(profile, user) {
  const name = profile.nome || user.displayName || user.email || "Usuário";
  const roleLabel = profile.role === "admin" ? "Administrador" : "Editor";

  els.userName.textContent = name;
  els.userRole.textContent = roleLabel;
  els.userInitials.textContent = initials(name);
  els.postAuthor.value = profile.nome || "Equipe Conecta Vera Cruz";
}

function subscribeToPosts() {
  if (unsubscribePosts) unsubscribePosts();

  const postsQuery = query(collection(db, "blogPosts"), orderBy("data", "desc"));

  unsubscribePosts = onSnapshot(
    postsQuery,
    (snapshot) => {
      posts = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      renderDashboard();
      renderPostTable();
    },
    (error) => {
      console.error(error);
      els.recentPosts.innerHTML = '<p class="admin-empty">Não foi possível carregar as publicações.</p>';
      els.postsTableBody.innerHTML = '<tr><td colspan="6" class="admin-table-empty">Erro ao carregar publicações.</td></tr>';
    }
  );
}

function renderDashboard() {
  const published = posts.filter((post) => post.status === "publicado");
  const drafts = posts.filter((post) => post.status === "rascunho");
  const featured = posts.filter((post) => post.destaque === true);

  els.metricTotal.textContent = posts.length;
  els.metricPublished.textContent = published.length;
  els.metricDrafts.textContent = drafts.length;
  els.metricFeatured.textContent = featured.length;

  if (!posts.length) {
    els.recentPosts.innerHTML = '<p class="admin-empty">Nenhuma publicação cadastrada ainda.</p>';
    return;
  }

  els.recentPosts.innerHTML = posts.slice(0, 5).map((post) => {
    const image = post.imagem
      ? `<img src="${escapeHTML(post.imagem)}" alt="">`
      : "";

    const status = post.status === "publicado" ? "Publicada" : "Rascunho";

    return `
      <article class="admin-recent-item">
        <div class="admin-recent-item__thumb">${image}</div>
        <div class="admin-recent-item__copy">
          <strong>${escapeHTML(post.titulo || "Sem título")}</strong>
          <small>${escapeHTML(post.categoria || "Sem categoria")} · ${escapeHTML(post.dataTexto || formatDatePtBR(post.data))} · ${status}</small>
        </div>
        <button type="button" data-edit-post="${escapeHTML(post.id)}">Editar</button>
      </article>
    `;
  }).join("");
}

function filteredPosts() {
  const search = String(els.postSearch.value || "").trim().toLocaleLowerCase("pt-BR");
  const status = els.postStatusFilter.value;

  return posts.filter((post) => {
    if (status !== "todos" && post.status !== status) return false;

    if (!search) return true;

    const haystack = [
      post.titulo,
      post.subtitulo,
      post.resumo,
      post.categoria,
      post.autor,
      ...(Array.isArray(post.tags) ? post.tags : [])
    ]
      .join(" ")
      .toLocaleLowerCase("pt-BR");

    return haystack.includes(search);
  });
}

function renderPostTable() {
  const list = filteredPosts();

  if (!list.length) {
    els.postsTableBody.innerHTML = '<tr><td colspan="6" class="admin-table-empty">Nenhuma publicação encontrada.</td></tr>';
    return;
  }

  els.postsTableBody.innerHTML = list.map((post) => {
    const image = post.imagem
      ? `<img src="${escapeHTML(post.imagem)}" alt="">`
      : "";

    const statusClass = post.status === "publicado" ? "published" : "draft";
    const statusLabel = post.status === "publicado" ? "Publicado" : "Rascunho";

    return `
      <tr>
        <td>
          <div class="admin-table__post">
            <div class="admin-table__thumb">${image}</div>
            <div>
              <strong>${escapeHTML(post.titulo || "Sem título")}</strong>
              <small>${escapeHTML(post.autor || "Equipe Conecta Vera Cruz")}</small>
            </div>
          </div>
        </td>
        <td>${escapeHTML(post.categoria || "-")}</td>
        <td>${escapeHTML(post.dataTexto || formatDatePtBR(post.data) || "-")}</td>
        <td><span class="admin-badge admin-badge--${statusClass}">${statusLabel}</span></td>
        <td>${post.destaque ? '<span class="admin-badge admin-badge--featured">★ Destaque</span>' : "-"}</td>
        <td>
          <div class="admin-actions">
            <button class="admin-action-button" type="button" data-edit-post="${escapeHTML(post.id)}">Editar</button>
            <button class="admin-action-button admin-action-button--danger" type="button" data-delete-post="${escapeHTML(post.id)}">Excluir</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function showSection(name) {
  $$('[data-section]').forEach((section) => {
    const active = section.dataset.section === name;
    section.hidden = !active;
    section.classList.toggle("is-active", active);
  });

  $$(".admin-nav__item").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.sectionTarget === name);
  });

  els.topbarTitle.textContent = sectionTitles[name] || "Painel";
  els.sidebar.classList.remove("is-open");

  if (name === "blog") renderPostTable();
}

function updateBlockHelp(block) {
  const type = $("[data-block-type]", block).value;
  const textarea = $("[data-block-text]", block);
  const help = $("[data-block-help]", block);

  const messages = {
    paragrafo: "Digite o texto do parágrafo.",
    titulo: "Digite o título desta seção da matéria.",
    citacao: "Digite a frase ou trecho que será destacado como citação.",
    nota: "Digite a observação editorial.",
    lista: "Digite um item por linha."
  };

  help.textContent = messages[type] || "Digite o conteúdo.";
  textarea.placeholder = type === "lista" ? "Item 1\nItem 2\nItem 3" : "Digite o conteúdo deste bloco";
}

function addContentBlock(type = "paragrafo", value = "") {
  const fragment = els.contentBlockTemplate.content.cloneNode(true);
  const block = $(".admin-content-block", fragment);
  const select = $("[data-block-type]", fragment);
  const textarea = $("[data-block-text]", fragment);

  select.value = type;

  if (type === "lista" && Array.isArray(value)) {
    textarea.value = value.join("\n");
  } else {
    textarea.value = value || "";
  }

  updateBlockHelp(block);
  els.contentBlocks.appendChild(fragment);
}

function serializeContentBlocks() {
  return $$(".admin-content-block", els.contentBlocks)
    .map((block) => {
      const type = $("[data-block-type]", block).value;
      const raw = $("[data-block-text]", block).value.trim();
      if (!raw) return null;

      if (type === "lista") {
        return {
          tipo: "lista",
          itens: raw.split(/\n+/).map((item) => item.trim()).filter(Boolean)
        };
      }

      return { tipo: type, texto: raw };
    })
    .filter(Boolean);
}

function resetEditor() {
  editingId = null;
  pendingImageFile = null;
  titleTouchedSlug = false;
  els.editorForm.reset();
  els.postDate.value = getTodayISO();
  els.postAuthor.value = currentProfile?.nome || "Equipe Conecta Vera Cruz";
  els.postReadingTime.value = "3 min";
  els.postShowHome.checked = true;
  els.postSlug.readOnly = false;
  els.postImageUrl.value = "";
  els.imagePreview.innerHTML = "<span>Sem imagem</span>";
  els.contentBlocks.innerHTML = "";
  addContentBlock("paragrafo", "");
  setStatus(els.editorStatus, "");
}

function openNewPost() {
  resetEditor();
  els.editorTitle.textContent = "Nova publicação";
  els.modal.hidden = false;
  document.body.style.overflow = "hidden";
  setTimeout(() => els.postTitle.focus(), 50);
}

function openEditPost(id) {
  const post = posts.find((item) => item.id === id);
  if (!post) return;

  resetEditor();
  editingId = id;
  titleTouchedSlug = true;

  els.editorTitle.textContent = "Editar publicação";
  els.postTitle.value = post.titulo || "";
  els.postSlug.value = post.slug || post.id;
  els.postSlug.readOnly = true;
  els.postSubtitle.value = post.subtitulo || "";
  els.postSummary.value = post.resumo || "";
  els.postDate.value = post.data || getTodayISO();
  els.postCategory.value = post.categoria || "";
  els.postTags.value = Array.isArray(post.tags) ? post.tags.join(", ") : "";
  els.postAuthor.value = post.autor || currentProfile?.nome || "Equipe Conecta Vera Cruz";
  els.postReadingTime.value = post.tempoLeitura || "3 min";
  els.postFeatured.checked = post.destaque === true;
  els.postShowHome.checked = post.mostrarInicio !== false;
  els.postImageAlt.value = post.imagemAlt || "";
  els.postImageUrl.value = post.imagem || "";

  if (post.imagem) {
    els.imagePreview.innerHTML = `<img src="${escapeHTML(post.imagem)}" alt="">`;
  }

  els.contentBlocks.innerHTML = "";
  const content = Array.isArray(post.conteudo) ? post.conteudo : [];

  if (!content.length) {
    addContentBlock("paragrafo", "");
  } else {
    content.forEach((block) => {
      if (block.tipo === "lista") addContentBlock("lista", block.itens || []);
      else if (["paragrafo", "titulo", "citacao", "nota"].includes(block.tipo)) {
        addContentBlock(block.tipo, block.texto || "");
      }
    });

    if (!els.contentBlocks.children.length) addContentBlock("paragrafo", "");
  }

  els.modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeEditor() {
  els.modal.hidden = true;
  document.body.style.overflow = "";
}

async function uploadPendingImage(slug) {
  if (!pendingImageFile) return els.postImageUrl.value || "";

  const extension = pendingImageFile.name.split(".").pop()?.toLowerCase() || "webp";
  const safeExtension = ["jpg", "jpeg", "png", "webp"].includes(extension) ? extension : "webp";
  const storageRef = ref(storage, `blog/${slug}/${Date.now()}-capa.${safeExtension}`);

  await uploadBytes(storageRef, pendingImageFile, {
    contentType: pendingImageFile.type || undefined
  });

  return getDownloadURL(storageRef);
}

async function savePost(status) {
  if (!els.editorForm.reportValidity()) return;

  const titulo = els.postTitle.value.trim();
  const slug = slugify(els.postSlug.value || titulo);
  const data = els.postDate.value;
  const categoria = els.postCategory.value.trim();
  const conteudo = serializeContentBlocks();

  if (!slug) {
    setStatus(els.editorStatus, "Informe um slug válido.", "error");
    return;
  }

  if (!conteudo.length) {
    setStatus(els.editorStatus, "Adicione pelo menos um bloco de conteúdo.", "error");
    return;
  }

  const documentId = editingId || slug;
  const documentRef = doc(db, "blogPosts", documentId);

  try {
    setStatus(els.editorStatus, "Salvando publicação...");
    $$('[data-save-status]').forEach((button) => button.disabled = true);

    if (!editingId) {
      const existing = await getDoc(documentRef);
      if (existing.exists()) {
        throw new Error("Já existe uma publicação com este slug. Altere o título ou o slug.");
      }
    }

    const imagem = await uploadPendingImage(slug);
    const nowFields = {
      updatedAt: serverTimestamp(),
      updatedBy: currentUser.uid
    };

    const payload = {
      slug,
      titulo,
      subtitulo: els.postSubtitle.value.trim(),
      resumo: els.postSummary.value.trim(),
      data,
      dataTexto: formatDatePtBR(data),
      categoria,
      categoriaSlug: slugify(categoria),
      tags: els.postTags.value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      autor: els.postAuthor.value.trim(),
      tempoLeitura: els.postReadingTime.value.trim() || "3 min",
      imagem,
      imagemAlt: els.postImageAlt.value.trim(),
      destaque: els.postFeatured.checked,
      mostrarInicio: els.postShowHome.checked,
      status,
      conteudo,
      ...nowFields
    };

    if (!editingId) {
      payload.createdAt = serverTimestamp();
      payload.createdBy = currentUser.uid;
    }

    if (status === "publicado") {
      payload.publishedAt = serverTimestamp();
    }

    await setDoc(documentRef, payload, { merge: true });

    setStatus(
      els.editorStatus,
      status === "publicado" ? "Publicação salva como publicada." : "Rascunho salvo.",
      "success"
    );

    setTimeout(() => {
      closeEditor();
      showSection("blog");
    }, 450);
  } catch (error) {
    console.error(error);
    setStatus(els.editorStatus, error.message || "Não foi possível salvar a publicação.", "error");
  } finally {
    $$('[data-save-status]').forEach((button) => button.disabled = false);
  }
}

async function deletePost(id) {
  const post = posts.find((item) => item.id === id);
  if (!post) return;

  const confirmed = window.confirm(`Excluir definitivamente a publicação “${post.titulo || "Sem título"}”?`);
  if (!confirmed) return;

  try {
    await deleteDoc(doc(db, "blogPosts", id));
  } catch (error) {
    console.error(error);
    window.alert("Não foi possível excluir a publicação.");
  }
}

function previewSelectedImage(file) {
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setStatus(els.editorStatus, "Escolha um arquivo de imagem válido.", "error");
    return;
  }

  if (file.size > 8 * 1024 * 1024) {
    setStatus(els.editorStatus, "A imagem deve ter no máximo 8 MB.", "error");
    return;
  }

  pendingImageFile = file;
  const url = URL.createObjectURL(file);
  els.imagePreview.innerHTML = `<img src="${url}" alt="Prévia da imagem selecionada">`;
}

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-dynamic-src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.dataset.dynamicSrc = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function importCurrentBlog() {
  if (!els.importCurrentBlogButton) return;

  try {
    els.importCurrentBlogButton.disabled = true;
    setStatus(els.importStatus, "Lendo o blog atual...");

    if (!Array.isArray(window.CONECTA_BLOG_POSTS)) {
      await loadScriptOnce("../assets/data/blog-posts.js");
    }

    const currentPosts = Array.isArray(window.CONECTA_BLOG_POSTS)
      ? window.CONECTA_BLOG_POSTS
      : [];

    if (!currentPosts.length) {
      throw new Error("Nenhuma publicação foi encontrada em assets/data/blog-posts.js.");
    }

    let imported = 0;
    let skipped = 0;

    for (const sourcePost of currentPosts) {
      const slug = slugify(sourcePost.slug || sourcePost.titulo);
      if (!slug) {
        skipped += 1;
        continue;
      }

      const postRef = doc(db, "blogPosts", slug);
      const existing = await getDoc(postRef);

      if (existing.exists()) {
        skipped += 1;
        continue;
      }

      await setDoc(postRef, {
        ...sourcePost,
        slug,
        status: "publicado",
        mostrarInicio: sourcePost.mostrarInicio !== false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        importedFromStaticFile: true,
        importedBy: currentUser.uid
      });

      imported += 1;
    }

    setStatus(
      els.importStatus,
      `Importação concluída: ${imported} publicação(ões) importada(s) e ${skipped} ignorada(s) por já existirem ou não terem slug válido.`,
      "success"
    );
  } catch (error) {
    console.error(error);
    setStatus(els.importStatus, error.message || "Não foi possível importar o blog atual.", "error");
  } finally {
    els.importCurrentBlogButton.disabled = false;
  }
}

els.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus(els.loginStatus, "Entrando...");

  try {
    await signInWithEmailAndPassword(
      auth,
      els.loginEmail.value.trim(),
      els.loginPassword.value
    );
  } catch (error) {
    console.error(error);
    setStatus(els.loginStatus, "E-mail ou senha inválidos, ou acesso não autorizado.", "error");
  }
});

els.logoutButton.addEventListener("click", async () => {
  await signOut(auth);
});

els.menuToggle.addEventListener("click", () => {
  els.sidebar.classList.toggle("is-open");
});

document.addEventListener("click", (event) => {
  const sectionButton = event.target.closest("[data-section-target]");
  if (sectionButton) {
    showSection(sectionButton.dataset.sectionTarget);
    return;
  }

  const editButton = event.target.closest("[data-edit-post]");
  if (editButton) {
    openEditPost(editButton.dataset.editPost);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-post]");
  if (deleteButton) {
    deletePost(deleteButton.dataset.deletePost);
    return;
  }

  if (event.target.closest("[data-close-editor]")) {
    closeEditor();
  }
});

[
  "#topNewPostButton",
  "#dashboardNewPostButton",
  "#quickNewPost",
  "#blogNewPostButton",
  "#imageSectionNewPost"
].forEach((selector) => {
  $(selector)?.addEventListener("click", openNewPost);
});

els.postSearch.addEventListener("input", renderPostTable);
els.postStatusFilter.addEventListener("change", renderPostTable);

els.postTitle.addEventListener("input", () => {
  if (!editingId && !titleTouchedSlug) {
    els.postSlug.value = slugify(els.postTitle.value);
  }
});

els.postSlug.addEventListener("input", () => {
  titleTouchedSlug = els.postSlug.value.trim().length > 0;
  els.postSlug.value = slugify(els.postSlug.value);
});

els.postImageFile.addEventListener("change", () => {
  previewSelectedImage(els.postImageFile.files?.[0]);
});

els.addContentBlock.addEventListener("click", () => addContentBlock("paragrafo", ""));

els.contentBlocks.addEventListener("change", (event) => {
  if (event.target.matches("[data-block-type]")) {
    updateBlockHelp(event.target.closest(".admin-content-block"));
  }
});

els.contentBlocks.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-block]");
  if (!removeButton) return;

  const block = removeButton.closest(".admin-content-block");
  block.remove();

  if (!els.contentBlocks.children.length) {
    addContentBlock("paragrafo", "");
  }
});

$$('[data-save-status]').forEach((button) => {
  button.addEventListener("click", () => savePost(button.dataset.saveStatus));
});

els.importCurrentBlogButton?.addEventListener("click", importCurrentBlog);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !els.modal.hidden) closeEditor();
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    currentUser = null;
    currentProfile = null;
    if (unsubscribePosts) {
      unsubscribePosts();
      unsubscribePosts = null;
    }
    showLogin();
    return;
  }

  try {
    currentUser = user;
    currentProfile = await loadProfile(user);
    applyProfile(currentProfile, user);
    showAdmin();
    subscribeToPosts();
    showSection("dashboard");
    setStatus(els.loginStatus, "");
  } catch (error) {
    console.error(error);
    setStatus(els.loginStatus, error.message || "Acesso não autorizado.", "error");
    await signOut(auth);
  }
});
