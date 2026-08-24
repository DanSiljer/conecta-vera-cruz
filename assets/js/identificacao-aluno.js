document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const STORAGE_KEY = "missaoAprenderStudent";
  const LEGACY_NAME_KEY = "missaoAprenderStudentName";

  const nameInput = document.querySelector("#studentName");
  const classInput = document.querySelector("#studentClass");
  const saveButton = document.querySelector("#saveStudentButton");
  const message = document.querySelector("#studentMessage");

  function readSavedStudent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          return {
            name: String(parsed.name || "").trim(),
            className: String(parsed.className || "").trim()
          };
        }
      }
    } catch (error) {
      // Continua procurando valores antigos.
    }

    return {
      name: String(localStorage.getItem(LEGACY_NAME_KEY) || "").trim(),
      className: ""
    };
  }

  function getCurrentStudent() {
    const saved = readSavedStudent();
    return {
      name: nameInput && nameInput.value.trim()
        ? nameInput.value.trim()
        : saved.name,
      className: classInput && classInput.value.trim()
        ? classInput.value.trim()
        : saved.className
    };
  }

  function showMessage(text, type) {
    if (!message) return;
    message.textContent = text;
    message.classList.remove("is-success", "is-error");
    if (type) message.classList.add(type);
  }

  function saveStudent() {
    if (!nameInput) return;

    const name = nameInput.value.trim();
    const className = classInput ? classInput.value.trim() : "";

    if (!name) {
      nameInput.focus();
      showMessage("Digite seu nome antes de salvar.", "is-error");
      return;
    }

    const student = {
      name: name,
      className: className,
      savedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(student));
      localStorage.setItem(LEGACY_NAME_KEY, name);
    } catch (error) {
      showMessage("O navegador não permitiu salvar os dados. Verifique o modo privado.", "is-error");
      return;
    }

    nameInput.value = name;
    showMessage("Nome salvo. Os próximos resultados serão registrados para " + name + ".", "is-success");

    if (saveButton) {
      const originalText = saveButton.textContent;
      saveButton.textContent = "Nome salvo";
      saveButton.disabled = true;
      window.setTimeout(function () {
        saveButton.textContent = originalText || "Salvar nome";
        saveButton.disabled = false;
      }, 1300);
    }
  }

  const saved = readSavedStudent();
  if (nameInput && !nameInput.value.trim() && saved.name) {
    nameInput.value = saved.name;
    showMessage("Nome recuperado: " + saved.name + ".", "is-success");
  }

  if (classInput && !classInput.value.trim() && saved.className) {
    classInput.value = saved.className;
  }

  if (saveButton) {
    saveButton.addEventListener("click", saveStudent);
  }

  if (nameInput) {
    nameInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        saveStudent();
      }
    });

    nameInput.addEventListener("input", function () {
      showMessage("Clique em Salvar nome para confirmar o nome.", "");
    });
  }

  window.MissaoAprenderAluno = {
    get: getCurrentStudent,
    save: saveStudent,
    storageKey: STORAGE_KEY
  };
});
