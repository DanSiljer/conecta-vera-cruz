'use strict';

const audioBtn = document.getElementById('audioBtn');
    let speaking = false;
    let utterance = null;

    function pararAudio() {
      window.speechSynthesis.cancel();
      speaking = false;
      audioBtn.textContent = 'Ouvir resumo';
    }

    if (audioBtn) audioBtn.addEventListener('click', () => {
      if (speaking) {
        pararAudio();
        return;
      }

      const texto = 'Vera Cruz, na Bahia, é a única cidade brasileira com esse nome que é banhada pelo mar. O nome Vera Cruz vem do latim e significa a verdadeira cruz. Em 1560 foi fundado o povoado com a invocação do Senhor da Vera Cruz. Em 1561 foi fundada a igreja. Em 1563 surgiu a primeira freguesia da Ilha de Itaparica. Depois de transformações históricas e do desmembramento de Itaparica, Vera Cruz tornou-se município em 31 de julho de 1962. A emancipação foi impulsionada pela falta de serviços públicos, pelas grandes distâncias, pelo crescimento econômico das comunidades e pelo desejo de administração própria. Entre as personalidades citadas estão José Eloy de Carvalho, Pedro Martiniano Rodrigues Menezes, Edgar Souza Coelho, Taurino Luiz de Mendonça e o primeiro prefeito Almiro Antunes de Brito.';
      utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.94;
      utterance.onend = () => pararAudio();
      utterance.onerror = () => pararAudio();
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      speaking = true;
      audioBtn.textContent = 'Parar áudio';
    });

    const quizResult = document.getElementById('quizResult');
    document.querySelectorAll('[data-answer]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.answer === 'right') {
          if (!quizResult) return;
          quizResult.textContent = 'Acertou! Vera Cruz foi emancipada em 1962.';
          quizResult.style.color = '#0c6c5b';
        } else {
          if (!quizResult) return;
          quizResult.textContent = 'Quase! A resposta certa é 1962.';
          quizResult.style.color = '#a33a43';
        }
      });
    });

    const curiosities = [
      'Vera Cruz é a única cidade brasileira com esse nome que é banhada pelo mar.',
      'O nome Vera Cruz significa “a verdadeira cruz”.',
      'A primeira missa na Igreja do Nosso Senhor da Vera Cruz teria celebrado 70 casamentos.',
      'A antiga Freguesia de Vera Cruz foi a primeira freguesia da Ilha de Itaparica.',
      'Em 1962, o antigo território de Itaparica foi dividido em Itaparica, Vera Cruz e Salinas da Margarida.',
      'A bandeira de Vera Cruz reúne a Cruz de Malta, a concha do mar, linhas azuis e o fundo branco.'
    ];

    let curiosityIndex = 0;
    const curiosityText = document.getElementById('curiosityText');
    const curiosityBtn = document.getElementById('curiosityBtn');
    if (curiosityBtn && curiosityText) curiosityBtn.addEventListener('click', () => {
      curiosityIndex = (curiosityIndex + 1) % curiosities.length;
      curiosityText.textContent = curiosities[curiosityIndex];
    });

// Interrompe a narração ao sair da página.
window.addEventListener('pagehide', () => {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
});

