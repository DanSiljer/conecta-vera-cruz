document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  /* =========================================================
     BANNER / CARROSSEL DE MEIO AMBIENTE
     ========================================================= */
  const heroCarousel = document.querySelector("[data-eco-hero-carousel]");

  if (heroCarousel) {
    const slides = [...heroCarousel.querySelectorAll("[data-eco-hero-slide]")];
    const dots = [...heroCarousel.querySelectorAll("[data-eco-hero-dots] button")];
    const prevButton = heroCarousel.querySelector("[data-eco-hero-prev]");
    const nextButton = heroCarousel.querySelector("[data-eco-hero-next]");
    const pauseButton = heroCarousel.querySelector("[data-eco-hero-pause]");
    const pauseIcon = heroCarousel.querySelector("[data-eco-hero-pause-icon]");
    const pauseText = heroCarousel.querySelector("[data-eco-hero-pause-text]");
    const counter = heroCarousel.querySelector("[data-eco-hero-counter]");

    let currentSlide = 0;
    let autoplayId = null;
    let paused = false;
    let touchStartX = 0;
    const delay = 5500;

    function formatNumber(value) {
      return String(value).padStart(2, "0");
    }

    function showSlide(index, userAction) {
      if (!slides.length) return;

      currentSlide = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        const active = slideIndex === currentSlide;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });

      dots.forEach(function (dot, dotIndex) {
        const active = dotIndex === currentSlide;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", String(active));
      });

      if (counter) {
        counter.textContent =
          formatNumber(currentSlide + 1) + " / " + formatNumber(slides.length);
      }

      if (userAction && !paused) restartAutoplay();
    }

    function nextSlide(userAction) {
      showSlide(currentSlide + 1, userAction);
    }

    function previousSlide(userAction) {
      showSlide(currentSlide - 1, userAction);
    }

    function startAutoplay() {
      if (paused || slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      stopAutoplay();
      autoplayId = window.setInterval(function () {
        nextSlide(false);
      }, delay);
    }

    function stopAutoplay() {
      if (autoplayId) {
        window.clearInterval(autoplayId);
        autoplayId = null;
      }
    }

    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    function updatePauseButton() {
      if (!pauseButton) return;
      pauseButton.setAttribute("aria-pressed", String(paused));
      pauseButton.setAttribute("aria-label", paused ? "Retomar carrossel" : "Pausar carrossel");
      if (pauseIcon) pauseIcon.textContent = paused ? "▶" : "Ⅱ";
      if (pauseText) pauseText.textContent = paused ? "Retomar" : "Pausar";
    }

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        previousSlide(true);
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        nextSlide(true);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index, true);
      });
    });

    if (pauseButton) {
      pauseButton.addEventListener("click", function () {
        paused = !paused;
        updatePauseButton();

        if (paused) stopAutoplay();
        else startAutoplay();
      });
    }

    heroCarousel.addEventListener("touchstart", function (event) {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    heroCarousel.addEventListener("touchend", function (event) {
      const touchEndX = event.changedTouches[0].clientX;
      const distance = touchEndX - touchStartX;

      if (Math.abs(distance) < 45) return;
      if (distance > 0) previousSlide(true);
      else nextSlide(true);
    }, { passive: true });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopAutoplay();
      else if (!paused) startAutoplay();
    });

    showSlide(0, false);
    updatePauseButton();
    startAutoplay();
  }


  /* =========================================================
     CHECKLIST DE ATITUDES
     ========================================================= */
  const checklist = document.querySelector("[data-eco-checklist]");
  const progress = document.querySelector("[data-eco-progress]");
  const progressBar = document.querySelector("[data-eco-progress-bar]");
  const progressMessage = document.querySelector("[data-eco-progress-message]");
  const storageKey = "conecta-vera-cruz:eco-checklist-v1";

  function loadChecklist() {
    if (!checklist) return;

    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch (error) {
      saved = [];
    }

    checklist.querySelectorAll('input[type="checkbox"]').forEach(function (input) {
      input.checked = saved.includes(input.value);
    });

    updateProgress();
  }

  function updateProgress() {
    if (!checklist || !progress || !progressBar || !progressMessage) return;

    const inputs = [...checklist.querySelectorAll('input[type="checkbox"]')];
    const checked = inputs.filter(function (input) {
      return input.checked;
    });

    progress.textContent = String(checked.length);
    progressBar.style.width = ((checked.length / inputs.length) * 100) + "%";

    if (checked.length === 0) {
      progressMessage.textContent = "Comece marcando uma atitude que já faz parte da sua rotina.";
    } else if (checked.length <= 3) {
      progressMessage.textContent = "Bom começo. Pequenas escolhas repetidas todos os dias ganham força.";
    } else if (checked.length <= 6) {
      progressMessage.textContent = "Você já reúne várias atitudes importantes. Continue ampliando esse cuidado.";
    } else if (checked.length === 7) {
      progressMessage.textContent = "Falta apenas uma atitude para completar o compromisso ambiental.";
    } else {
      progressMessage.textContent = "Compromisso completo. Agora o próximo passo é inspirar outras pessoas.";
    }

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(checked.map(function (input) {
          return input.value;
        }))
      );
    } catch (error) {
      /* A interação continua funcionando mesmo sem localStorage. */
    }
  }

  if (checklist) {
    checklist.addEventListener("change", updateProgress);
    loadChecklist();
  }


  /* =========================================================
     CALENDÁRIO DO DEFESO
     ========================================================= */
  const defesoCards = document.querySelectorAll("[data-eco-defeso-periods]");

  if (defesoCards.length) {
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    defesoCards.forEach(function (card) {
      const periods = String(card.dataset.ecoDefesoPeriods || "").split(",");

      const active = periods.some(function (period) {
        const parts = period.split("/");
        if (parts.length !== 2) return false;

        const start = new Date(parts[0] + "T12:00:00");
        const end = new Date(parts[1] + "T12:00:00");

        return today >= start && today <= end;
      });

      if (active) {
        card.classList.add("is-active");
        const status = card.querySelector(".eco-defeso-status");
        if (status) status.hidden = false;
      }
    });
  }

  /* =========================================================
     QUIZ AMBIENTAL
     ========================================================= */
  const quiz = document.querySelector("[data-eco-quiz]");

  if (!quiz) return;

  const questionEl = quiz.querySelector("[data-eco-quiz-question]");
  const optionsEl = quiz.querySelector("[data-eco-quiz-options]");
  const stepEl = quiz.querySelector("[data-eco-quiz-step]");
  const scoreEl = quiz.querySelector("[data-eco-quiz-score]");
  const feedbackEl = quiz.querySelector("[data-eco-quiz-feedback]");
  const nextButton = quiz.querySelector("[data-eco-quiz-next]");

  const questions = [
    {
      question: "Você terminou um lanche na praia e não encontrou lixeira por perto. O que fazer?",
      options: [
        "Deixar o lixo ao lado de uma árvore para alguém recolher.",
        "Enterrar o lixo na areia.",
        "Guardar o lixo e levar até um local de descarte adequado."
      ],
      correct: 2,
      feedback: "O lixo pode ser levado pela maré ou pelo vento. Guardar até encontrar descarte adequado é a melhor escolha."
    },
    {
      question: "Durante uma visita a uma piscina natural, você encontra uma concha bonita com um pequeno animal dentro. O que fazer?",
      options: [
        "Levar para casa como lembrança.",
        "Deixar no ambiente e observar sem retirar.",
        "Colocar em outro lugar para tirar uma fotografia melhor."
      ],
      correct: 1,
      feedback: "Conchas e organismos fazem parte do ambiente. Observar sem retirar reduz o impacto da visita."
    },
    {
      question: "Você quer comprar pescado durante um período em que determinada espécie está protegida pelo defeso. Qual é a atitude mais responsável?",
      options: [
        "Comprar porque a responsabilidade é apenas de quem pescou.",
        "Evitar a espécie protegida e procurar uma alternativa regular.",
        "Comprar somente se estiver mais barato."
      ],
      correct: 1,
      feedback: "O consumidor também influencia a cadeia. Evitar espécies protegidas ajuda a reduzir a pesca e o comércio irregulares."
    },
    {
      question: "Qual ação combina melhor turismo e valorização da comunidade?",
      options: [
        "Consumir somente produtos trazidos de fora.",
        "Registrar moradores sem pedir permissão.",
        "Usar serviços locais e respeitar costumes, trabalho e espaços comunitários."
      ],
      correct: 2,
      feedback: "Turismo consciente também fortalece a economia local e respeita as pessoas que vivem no território."
    }
  ];

  let current = 0;
  let score = 0;
  let answered = false;

  function renderQuestion() {
    const item = questions[current];
    answered = false;

    stepEl.textContent = "Pergunta " + (current + 1) + " de " + questions.length;
    scoreEl.textContent = score + (score === 1 ? " ponto" : " pontos");
    questionEl.textContent = item.question;
    feedbackEl.textContent = "";
    nextButton.disabled = true;
    nextButton.textContent = current === questions.length - 1 ? "Ver resultado" : "Próxima pergunta";

    const buttons = item.options.map(function (option, index) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option;

      button.addEventListener("click", function () {
        if (answered) return;
        answered = true;

        const allButtons = optionsEl.querySelectorAll("button");
        allButtons.forEach(function (node) {
          node.disabled = true;
        });

        if (index === item.correct) {
          button.classList.add("is-correct");
          score += 1;
          feedbackEl.textContent = "Resposta correta. " + item.feedback;
        } else {
          button.classList.add("is-wrong");
          allButtons[item.correct].classList.add("is-correct");
          feedbackEl.textContent = "A melhor escolha é a alternativa destacada. " + item.feedback;
        }

        scoreEl.textContent = score + (score === 1 ? " ponto" : " pontos");
        nextButton.disabled = false;
      });

      return button;
    });

    optionsEl.replaceChildren(...buttons);
  }

  function showResult() {
    stepEl.textContent = "Resultado final";
    scoreEl.textContent = score + " de " + questions.length;
    optionsEl.replaceChildren();
    nextButton.disabled = false;
    nextButton.textContent = "Refazer desafio";

    if (score === questions.length) {
      questionEl.textContent = "Excelente: você fez escolhas conscientes em todas as situações.";
      feedbackEl.textContent = "Informação vira proteção quando muda a forma como agimos no território.";
    } else if (score >= 2) {
      questionEl.textContent = "Bom resultado: você já reconhece várias atitudes responsáveis.";
      feedbackEl.textContent = "Reveja as situações em que errou e transforme as respostas em hábitos.";
    } else {
      questionEl.textContent = "O desafio mostrou onde ainda dá para aprender mais.";
      feedbackEl.textContent = "Volte às seções da página e tente novamente. A ideia não é decorar respostas, mas entender o impacto das escolhas.";
    }
  }

  nextButton.addEventListener("click", function () {
    if (current < questions.length - 1) {
      current += 1;
      renderQuestion();
      return;
    }

    if (nextButton.textContent === "Refazer desafio") {
      current = 0;
      score = 0;
      renderQuestion();
      return;
    }

    showResult();
  });

  renderQuestion();
});
