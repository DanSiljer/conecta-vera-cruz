import { app, db } from "./firebase-config.js";

import {
  getAuth,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  runTransaction,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

const button = document.querySelector("[data-site-like-button]");
const label = document.querySelector("[data-site-like-label]");
const heart = document.querySelector(".site-like-heart");
const countNode = document.querySelector("[data-site-like-count]");
const countText = document.querySelector("[data-site-like-count-text]");
const statusNode = document.querySelector("[data-site-like-status]");

if (button && label && heart && countNode && countText && statusNode) {
  const auth = getAuth(app);
  const likesCollection = collection(db, "curtidas_site");

  let currentUser = null;
  let alreadyLiked = false;
  let sending = false;

  function setStatus(message, type = "info") {
    statusNode.textContent = message;
    statusNode.className =
      "site-like-status" + (type === "error" ? " is-error" : "");
  }

  function formatCount(total) {
    const safeTotal = Number.isFinite(total) ? total : 0;
    countNode.textContent = new Intl.NumberFormat("pt-BR").format(safeTotal);
    countText.textContent =
      safeTotal === 1 ? " pessoa curtiu o projeto" : " pessoas curtiram o projeto";
  }

  function setLikedState() {
    alreadyLiked = true;
    button.disabled = true;
    button.classList.add("is-liked");
    button.setAttribute("aria-pressed", "true");
    heart.textContent = "♥";
    label.textContent = "Você curtiu";
    setStatus("Obrigado por apoiar este projeto educativo.");
  }

  function setReadyState() {
    alreadyLiked = false;
    button.disabled = false;
    button.classList.remove("is-liked");
    button.setAttribute("aria-pressed", "false");
    heart.textContent = "♡";
    label.textContent = "Curtir o site";
    setStatus("Uma curtida por visitante.");
  }

  async function refreshCount() {
    const snapshot = await getCountFromServer(likesCollection);
    formatCount(snapshot.data().count);
  }

  async function initializeLikes() {
    try {
      button.disabled = true;
      label.textContent = "Conectando...";
      setStatus("Conectando ao contador público...");

      const credential = await signInAnonymously(auth);
      currentUser = credential.user;

      const visitorLikeRef = doc(db, "curtidas_site", currentUser.uid);
      const visitorLike = await getDoc(visitorLikeRef);

      if (visitorLike.exists()) {
        setLikedState();
      } else {
        setReadyState();
      }

      await refreshCount();
    } catch (error) {
      console.error("Não foi possível iniciar as curtidas do site.", error);
      button.disabled = true;
      label.textContent = "Curtidas indisponíveis";
      setStatus(
        "O contador não pôde ser carregado. Verifique o Firebase e tente novamente.",
        "error"
      );
    }
  }

  button.addEventListener("click", async function () {
    if (!currentUser || alreadyLiked || sending) return;

    sending = true;
    button.disabled = true;
    label.textContent = "Registrando...";
    setStatus("Salvando sua curtida...");

    try {
      const visitorLikeRef = doc(db, "curtidas_site", currentUser.uid);

      await runTransaction(db, async function (transaction) {
        const existingLike = await transaction.get(visitorLikeRef);

        if (existingLike.exists()) {
          alreadyLiked = true;
          return;
        }

        transaction.set(visitorLikeRef, {
          site: "Conecta Vera Cruz",
          pagina: "inicio",
          createdAt: serverTimestamp()
        });
      });

      setLikedState();
      await refreshCount();
    } catch (error) {
      console.error("Não foi possível registrar a curtida.", error);
      button.disabled = false;
      label.textContent = "Tentar novamente";
      setStatus(
        "Não foi possível registrar agora. Confira a conexão e tente novamente.",
        "error"
      );
    } finally {
      sending = false;
    }
  });

  initializeLikes();
}
