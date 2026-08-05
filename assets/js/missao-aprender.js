const SUBJECT_NAMES = {
  historia: "História",
  "vera-cruz": "História de Vera Cruz e da Ilha",
  matematica: "Matemática",
  geografia: "Geografia",
  portugues: "Português",
  ciencias: "Ciências",
  todas: "Todas as disciplinas"
};

const DIFFICULTY_NAMES = {
  facil: "Fácil",
  medio: "Médio",
  dificil: "Difícil",
  mista: "Mista"
};

const QUESTION_BANK = [
  {
    id: 1,
    subject: "historia",
    difficulty: "facil",
    type: "quiz",
    question: "Qual é uma das principais funções das fontes históricas?",
    options: [
      "Ajudar a compreender sociedades do passado",
      "Prever exatamente o futuro",
      "Substituir todas as opiniões",
      "Eliminar a necessidade de pesquisa"
    ],
    answer: 0,
    explanation: "Fontes históricas oferecem vestígios que ajudam pesquisadores a interpretar o passado."
  },
  {
    id: 2,
    subject: "historia",
    difficulty: "facil",
    type: "quiz",
    question: "O período em que os seres humanos produziram instrumentos de pedra lascada é chamado de:",
    options: ["Paleolítico", "Idade Média", "Renascimento", "Idade dos Metais"],
    answer: 0,
    explanation: "O Paleolítico é conhecido pelo uso de instrumentos de pedra lascada e pela vida nômade."
  },
  {
    id: 3,
    subject: "historia",
    difficulty: "medio",
    type: "quiz",
    question: "A Revolução Neolítica ficou marcada principalmente por qual transformação?",
    options: [
      "Desenvolvimento da agricultura e maior sedentarização",
      "Criação das fábricas a vapor",
      "Expansão da internet",
      "Início das grandes navegações europeias"
    ],
    answer: 0,
    explanation: "A agricultura e a domesticação de animais favoreceram o surgimento de aldeias permanentes."
  },
  {
    id: 4,
    subject: "historia",
    difficulty: "medio",
    type: "quiz",
    question: "Por que diferentes versões de um mesmo acontecimento podem existir?",
    options: [
      "Porque as pessoas observam e registram os fatos de perspectivas diferentes",
      "Porque somente uma fonte pode ser verdadeira",
      "Porque a História não utiliza evidências",
      "Porque datas nunca são importantes"
    ],
    answer: 0,
    explanation: "A interpretação histórica considera diferentes sujeitos, contextos e tipos de fonte."
  },
  {
    id: 5,
    subject: "historia",
    difficulty: "dificil",
    type: "quiz",
    question: "Qual prática fortalece uma pesquisa histórica responsável?",
    options: [
      "Comparar diferentes fontes e verificar seu contexto",
      "Usar apenas relatos sem autoria",
      "Ignorar contradições entre documentos",
      "Escolher a versão mais famosa sem análise"
    ],
    answer: 0,
    explanation: "O cruzamento de fontes permite avaliar informações, interesses, silêncios e contradições."
  },
  {
    id: 6,
    subject: "historia",
    difficulty: "facil",
    type: "verdadeiro-falso",
    question: "Objetos, fotografias, músicas e relatos orais podem ser fontes históricas.",
    options: ["Verdadeiro", "Falso"],
    answer: 0,
    explanation: "Fontes históricas não são apenas documentos escritos."
  },
  {
    id: 7,
    subject: "historia",
    difficulty: "medio",
    type: "verdadeiro-falso",
    question: "A História estuda somente reis, guerras e governos.",
    options: ["Verdadeiro", "Falso"],
    answer: 1,
    explanation: "A História também pesquisa o cotidiano, o trabalho, as culturas, os grupos sociais e muitos outros temas."
  },

  {
    id: 8,
    subject: "matematica",
    difficulty: "facil",
    type: "quiz",
    question: "Quanto é 8 × 7?",
    options: ["54", "56", "63", "64"],
    answer: 1,
    explanation: "8 multiplicado por 7 é igual a 56."
  },
  {
    id: 9,
    subject: "matematica",
    difficulty: "facil",
    type: "quiz",
    question: "Uma caixa tem 24 lápis. Se forem divididos igualmente entre 6 estudantes, quantos lápis cada um recebe?",
    options: ["3", "4", "5", "6"],
    answer: 1,
    explanation: "24 ÷ 6 = 4."
  },
  {
    id: 10,
    subject: "matematica",
    difficulty: "medio",
    type: "quiz",
    question: "Qual fração representa a metade de uma unidade?",
    options: ["1/2", "1/3", "2/3", "3/4"],
    answer: 0,
    explanation: "Uma unidade dividida em duas partes iguais tem cada parte representada por 1/2."
  },
  {
    id: 11,
    subject: "matematica",
    difficulty: "medio",
    type: "quiz",
    question: "Um produto custa R$ 80 e recebeu desconto de 25%. Qual é o novo preço?",
    options: ["R$ 20", "R$ 55", "R$ 60", "R$ 75"],
    answer: 2,
    explanation: "25% de 80 é 20. Então, 80 - 20 = 60."
  },
  {
    id: 12,
    subject: "matematica",
    difficulty: "dificil",
    type: "quiz",
    question: "Se 3x + 5 = 20, qual é o valor de x?",
    options: ["3", "5", "7", "15"],
    answer: 1,
    explanation: "3x = 15 e, portanto, x = 5."
  },
  {
    id: 13,
    subject: "matematica",
    difficulty: "facil",
    type: "verdadeiro-falso",
    question: "O número 18 é divisível por 2 e por 3.",
    options: ["Verdadeiro", "Falso"],
    answer: 0,
    explanation: "18 ÷ 2 = 9 e 18 ÷ 3 = 6."
  },
  {
    id: 14,
    subject: "matematica",
    difficulty: "medio",
    type: "verdadeiro-falso",
    question: "A fração 2/4 é equivalente a 1/2.",
    options: ["Verdadeiro", "Falso"],
    answer: 0,
    explanation: "Dividindo o numerador e o denominador de 2/4 por 2, obtemos 1/2."
  },

  {
    id: 15,
    subject: "geografia",
    difficulty: "facil",
    type: "quiz",
    question: "Qual elemento de um mapa explica o significado dos símbolos utilizados?",
    options: ["Legenda", "Título", "Escala", "Fonte"],
    answer: 0,
    explanation: "A legenda apresenta o significado das cores, linhas e símbolos."
  },
  {
    id: 16,
    subject: "geografia",
    difficulty: "facil",
    type: "quiz",
    question: "Qual ponto cardeal indica a direção onde o Sol nasce aproximadamente?",
    options: ["Norte", "Sul", "Leste", "Oeste"],
    answer: 2,
    explanation: "O Sol nasce aproximadamente no leste e se põe no oeste."
  },
  {
    id: 17,
    subject: "geografia",
    difficulty: "medio",
    type: "quiz",
    question: "A paisagem pode ser definida como:",
    options: [
      "Tudo aquilo que percebemos em determinado espaço",
      "Somente elementos naturais",
      "Apenas prédios e ruas",
      "Um território sem presença humana"
    ],
    answer: 0,
    explanation: "A paisagem reúne elementos naturais e culturais percebidos pelos sentidos."
  },
  {
    id: 18,
    subject: "geografia",
    difficulty: "medio",
    type: "quiz",
    question: "Qual movimento da Terra está relacionado à alternância entre dia e noite?",
    options: ["Rotação", "Translação", "Precessão", "Erosão"],
    answer: 0,
    explanation: "A rotação é o movimento da Terra em torno de seu próprio eixo."
  },
  {
    id: 19,
    subject: "geografia",
    difficulty: "dificil",
    type: "quiz",
    question: "Em um mapa, a escala 1:100.000 indica que 1 cm representa:",
    options: ["100 metros", "500 metros", "1 quilômetro", "10 quilômetros"],
    answer: 2,
    explanation: "100.000 cm correspondem a 1.000 metros, ou seja, 1 quilômetro."
  },
  {
    id: 20,
    subject: "geografia",
    difficulty: "facil",
    type: "verdadeiro-falso",
    question: "O território envolve relações de poder e controle sobre uma área.",
    options: ["Verdadeiro", "Falso"],
    answer: 0,
    explanation: "O conceito de território está ligado à apropriação, ao poder e ao controle do espaço."
  },
  {
    id: 21,
    subject: "geografia",
    difficulty: "medio",
    type: "verdadeiro-falso",
    question: "Clima e tempo atmosférico são exatamente a mesma coisa.",
    options: ["Verdadeiro", "Falso"],
    answer: 1,
    explanation: "Tempo é a condição momentânea da atmosfera; clima é o padrão observado por longos períodos."
  },

  {
    id: 22,
    subject: "portugues",
    difficulty: "facil",
    type: "quiz",
    question: "Qual palavra está escrita corretamente?",
    options: ["Excessão", "Exceção", "Eceção", "Escessão"],
    answer: 1,
    explanation: "A grafia correta é exceção."
  },
  {
    id: 23,
    subject: "portugues",
    difficulty: "facil",
    type: "quiz",
    question: "Na frase “A menina alegre chegou cedo”, qual palavra caracteriza a menina?",
    options: ["Menina", "Alegre", "Chegou", "Cedo"],
    answer: 1,
    explanation: "“Alegre” é um adjetivo, pois atribui uma característica ao substantivo “menina”."
  },
  {
    id: 24,
    subject: "portugues",
    difficulty: "medio",
    type: "quiz",
    question: "Qual é o objetivo principal de um texto de notícia?",
    options: [
      "Informar sobre um acontecimento",
      "Ensinar uma receita",
      "Contar apenas uma história imaginária",
      "Apresentar regras de um jogo"
    ],
    answer: 0,
    explanation: "A notícia tem como finalidade principal informar fatos de interesse público."
  },
  {
    id: 25,
    subject: "portugues",
    difficulty: "medio",
    type: "quiz",
    question: "Em “João estudou, portanto conseguiu responder”, a palavra “portanto” indica:",
    options: ["Causa", "Conclusão", "Dúvida", "Lugar"],
    answer: 1,
    explanation: "“Portanto” introduz uma conclusão."
  },
  {
    id: 26,
    subject: "portugues",
    difficulty: "dificil",
    type: "quiz",
    question: "Em qual alternativa há linguagem figurada?",
    options: [
      "A lua derramava prata sobre o mar.",
      "A lua é um satélite natural.",
      "A noite começou às dezoito horas.",
      "O céu estava sem nuvens."
    ],
    answer: 0,
    explanation: "A expressão cria uma imagem poética, sem afirmar literalmente que a lua derrama prata."
  },
  {
    id: 27,
    subject: "portugues",
    difficulty: "facil",
    type: "verdadeiro-falso",
    question: "Um verbo pode indicar ação, estado ou fenômeno da natureza.",
    options: ["Verdadeiro", "Falso"],
    answer: 0,
    explanation: "Verbos podem expressar ações, estados e fenômenos."
  },
  {
    id: 28,
    subject: "portugues",
    difficulty: "medio",
    type: "verdadeiro-falso",
    question: "Todo texto precisa obrigatoriamente ter linguagem formal.",
    options: ["Verdadeiro", "Falso"],
    answer: 1,
    explanation: "A linguagem varia conforme a situação, o público, o objetivo e o gênero textual."
  },

  {
    id: 29,
    subject: "ciencias",
    difficulty: "facil",
    type: "quiz",
    question: "Qual órgão é responsável por bombear o sangue pelo corpo?",
    options: ["Pulmão", "Coração", "Estômago", "Rim"],
    answer: 1,
    explanation: "O coração impulsiona o sangue pelo sistema circulatório."
  },
  {
    id: 30,
    subject: "ciencias",
    difficulty: "facil",
    type: "quiz",
    question: "As plantas produzem parte de seu alimento por meio de qual processo?",
    options: ["Fotossíntese", "Evaporação", "Digestão", "Fermentação"],
    answer: 0,
    explanation: "Na fotossíntese, as plantas utilizam luz, água e gás carbônico para produzir alimento."
  },
  {
    id: 31,
    subject: "ciencias",
    difficulty: "medio",
    type: "quiz",
    question: "Qual destes materiais é um bom condutor de eletricidade?",
    options: ["Borracha", "Plástico", "Cobre", "Madeira seca"],
    answer: 2,
    explanation: "O cobre conduz eletricidade e é muito usado em fios."
  },
  {
    id: 32,
    subject: "ciencias",
    difficulty: "medio",
    type: "quiz",
    question: "Qual relação ocorre quando dois seres vivos se beneficiam?",
    options: ["Mutualismo", "Predação", "Competição", "Parasitismo"],
    answer: 0,
    explanation: "No mutualismo, os dois organismos obtêm benefícios."
  },
  {
    id: 33,
    subject: "ciencias",
    difficulty: "dificil",
    type: "quiz",
    question: "Por que a vacinação contribui para a saúde coletiva?",
    options: [
      "Reduz a circulação de agentes infecciosos e protege a comunidade",
      "Elimina instantaneamente todas as doenças",
      "Substitui hábitos de higiene",
      "Impede qualquer mutação dos microrganismos"
    ],
    answer: 0,
    explanation: "A vacinação diminui o risco de transmissão e ajuda a proteger inclusive pessoas vulneráveis."
  },
  {
    id: 34,
    subject: "ciencias",
    difficulty: "facil",
    type: "verdadeiro-falso",
    question: "A água pode ser encontrada nos estados sólido, líquido e gasoso.",
    options: ["Verdadeiro", "Falso"],
    answer: 0,
    explanation: "Gelo, água líquida e vapor são exemplos dos três estados físicos."
  },
  {
    id: 35,
    subject: "ciencias",
    difficulty: "medio",
    type: "verdadeiro-falso",
    question: "Todos os microrganismos causam doenças.",
    options: ["Verdadeiro", "Falso"],
    answer: 1,
    explanation: "Muitos microrganismos são úteis ou inofensivos; apenas alguns causam doenças."
  }
  ,
  {
    id: 36,
    subject: "vera-cruz",
    difficulty: "facil",
    type: "quiz",
    question: "O que significa a expressão latina “Vera Crux”?",
    options: ["A verdadeira cruz", "A ilha distante", "O grande oceano", "A nova cidade"],
    answer: 0,
    explanation: "Vera Crux significa “a verdadeira cruz” e está relacionada à origem religiosa do nome Vera Cruz."
  },
  {
    id: 37,
    subject: "vera-cruz",
    difficulty: "facil",
    type: "quiz",
    question: "Qual povo originário habitava a Ilha de Itaparica antes da ocupação portuguesa?",
    options: ["Tupinambás", "Romanos", "Fenícios", "Astecas"],
    answer: 0,
    explanation: "Os povos Tupinambás já habitavam a Ilha de Itaparica antes da chegada e da ocupação portuguesa."
  },
  {
    id: 38,
    subject: "vera-cruz",
    difficulty: "medio",
    type: "quiz",
    question: "O que ocorreu em 1560 na história de Vera Cruz?",
    options: [
      "A fundação de um povoado com a invocação do Senhor da Vera Cruz",
      "A emancipação política do município",
      "A criação da cidade de Salvador",
      "A construção da ponte Salvador-Itaparica"
    ],
    answer: 0,
    explanation: "Em 1560 foi fundado um povoado com a invocação do Senhor da Vera Cruz."
  },
  {
    id: 39,
    subject: "vera-cruz",
    difficulty: "medio",
    type: "quiz",
    question: "Qual construção religiosa foi fundada em 1561?",
    options: [
      "A Igreja do Nosso Senhor da Vera Cruz",
      "A Catedral de Brasília",
      "A Igreja do Bonfim de Salvador",
      "A Igreja da Sé de Olinda"
    ],
    answer: 0,
    explanation: "A Igreja do Nosso Senhor da Vera Cruz foi fundada em 1561."
  },
  {
    id: 40,
    subject: "vera-cruz",
    difficulty: "facil",
    type: "quiz",
    question: "Em que ano Vera Cruz conquistou sua emancipação política?",
    options: ["1500", "1563", "1822", "1962"],
    answer: 3,
    explanation: "A emancipação política de Vera Cruz ocorreu em 1962."
  },
  {
    id: 41,
    subject: "vera-cruz",
    difficulty: "medio",
    type: "quiz",
    question: "Qual localidade se tornou sede do município de Vera Cruz?",
    options: ["Mar Grande", "Cacha-Pregos", "Baiacu", "Gamboa"],
    answer: 0,
    explanation: "Mar Grande tornou-se a sede administrativa do novo município."
  },
  {
    id: 42,
    subject: "vera-cruz",
    difficulty: "dificil",
    type: "quiz",
    question: "Por que o nome Vera Cruz foi retomado na criação do município?",
    options: [
      "Como homenagem à antiga freguesia, à igreja e ao padroeiro",
      "Por causa de uma fábrica instalada na ilha",
      "Porque era o nome de um navio moderno",
      "Para copiar o nome de Salvador"
    ],
    answer: 0,
    explanation: "O nome retomou a memória da antiga freguesia, da igreja e da devoção ao Senhor da Vera Cruz."
  },
  {
    id: 43,
    subject: "vera-cruz",
    difficulty: "dificil",
    type: "quiz",
    question: "Qual foi um dos motivos defendidos pelos moradores para a emancipação?",
    options: [
      "Ter administração mais próxima e melhorar os serviços públicos",
      "Acabar com todas as comunidades da ilha",
      "Impedir a pesca artesanal",
      "Transferir a sede para Salvador"
    ],
    answer: 0,
    explanation: "A distância da antiga sede e a falta de serviços fortaleceram o desejo de uma administração própria."
  },
  {
    id: 44,
    subject: "vera-cruz",
    difficulty: "facil",
    type: "verdadeiro-falso",
    question: "A história de Vera Cruz começa apenas em 1962.",
    options: ["Verdadeiro", "Falso"],
    answer: 1,
    explanation: "A região possui uma história muito anterior, ligada aos povos originários e à formação da Ilha de Itaparica."
  },
  {
    id: 45,
    subject: "vera-cruz",
    difficulty: "facil",
    type: "verdadeiro-falso",
    question: "Em 1500, o Brasil chegou a ser chamado de Ilha de Vera Cruz.",
    options: ["Verdadeiro", "Falso"],
    answer: 0,
    explanation: "Ilha de Vera Cruz foi um dos primeiros nomes atribuídos ao território pelos portugueses."
  },
  {
    id: 46,
    subject: "vera-cruz",
    difficulty: "medio",
    type: "verdadeiro-falso",
    question: "Antes da emancipação, as localidades que formariam Vera Cruz estavam ligadas ao município de Itaparica.",
    options: ["Verdadeiro", "Falso"],
    answer: 0,
    explanation: "O território de Vera Cruz fazia parte do município de Itaparica antes da divisão política."
  },
  {
    id: 47,
    subject: "vera-cruz",
    difficulty: "medio",
    type: "verdadeiro-falso",
    question: "Uma freguesia colonial era formada somente pelo prédio da igreja.",
    options: ["Verdadeiro", "Falso"],
    answer: 1,
    explanation: "A freguesia podia reunir igreja, moradias, ruas, comércio e serviços."
  },
  {
    id: 48,
    subject: "vera-cruz",
    difficulty: "dificil",
    type: "verdadeiro-falso",
    question: "A emancipação de Vera Cruz ocorreu sem mobilização comunitária ou articulação política.",
    options: ["Verdadeiro", "Falso"],
    answer: 1,
    explanation: "O processo envolveu moradores, lideranças, vereadores e articulações políticas."
  },
  {
    id: 49,
    subject: "vera-cruz",
    difficulty: "medio",
    type: "verdadeiro-falso",
    question: "O mar faz parte da história do trabalho, das travessias e da identidade das comunidades da Ilha de Itaparica.",
    options: ["Verdadeiro", "Falso"],
    answer: 0,
    explanation: "A relação com as águas marca a paisagem, o cotidiano e os saberes de muitas comunidades da ilha."
  }

];

const elements = {
  menuButton: document.querySelector("#menuButton"),
  mainNav: document.querySelector("#mainNav"),
  studentName: document.querySelector("#studentName"),
  studentClass: document.querySelector("#studentClass"),
  saveStudentButton: document.querySelector("#saveStudentButton"),
  studentMessage: document.querySelector("#studentMessage"),

  gameLauncher: document.querySelector("#gameLauncher"),
  selectedSubjectTitle: document.querySelector("#selectedSubjectTitle"),
  closeLauncherButton: document.querySelector("#closeLauncherButton"),
  gameDifficulty: document.querySelector("#gameDifficulty"),
  gameQuestionCount: document.querySelector("#gameQuestionCount"),
  gameMode: document.querySelector("#gameMode"),
  startGameButton: document.querySelector("#startGameButton"),

  gameArea: document.querySelector("#gameArea"),
  gameSubjectLabel: document.querySelector("#gameSubjectLabel"),
  gameActivityTitle: document.querySelector("#gameActivityTitle"),
  quitGameButton: document.querySelector("#quitGameButton"),
  progressBar: document.querySelector("#progressBar"),
  questionCounter: document.querySelector("#questionCounter"),
  scoreCounter: document.querySelector("#scoreCounter"),
  timerCounter: document.querySelector("#timerCounter"),
  difficultyBadge: document.querySelector("#difficultyBadge"),
  questionText: document.querySelector("#questionText"),
  answerGrid: document.querySelector("#answerGrid"),
  feedbackBox: document.querySelector("#feedbackBox"),
  feedbackTitle: document.querySelector("#feedbackTitle"),
  feedbackText: document.querySelector("#feedbackText"),
  nextQuestionButton: document.querySelector("#nextQuestionButton"),

  teacherForm: document.querySelector("#teacherForm"),
  activityTitleInput: document.querySelector("#activityTitleInput"),
  teacherSubject: document.querySelector("#teacherSubject"),
  teacherDifficulty: document.querySelector("#teacherDifficulty"),
  teacherQuestionCount: document.querySelector("#teacherQuestionCount"),
  teacherTimer: document.querySelector("#teacherTimer"),
  teacherMode: document.querySelector("#teacherMode"),
  printPlanButton: document.querySelector("#printPlanButton"),
  previewTitle: document.querySelector("#previewTitle"),
  previewSubject: document.querySelector("#previewSubject"),
  previewDifficulty: document.querySelector("#previewDifficulty"),
  previewQuestions: document.querySelector("#previewQuestions"),
  previewTimer: document.querySelector("#previewTimer"),

  totalActivities: document.querySelector("#totalActivities"),
  averageScore: document.querySelector("#averageScore"),
  bestScore: document.querySelector("#bestScore"),
  resultsTableBody: document.querySelector("#resultsTableBody"),
  exportResultsButton: document.querySelector("#exportResultsButton"),
  clearResultsButton: document.querySelector("#clearResultsButton"),

  resultModal: document.querySelector("#resultModal"),
  resultModalIcon: document.querySelector("#resultModalIcon"),
  resultModalTitle: document.querySelector("#resultModalTitle"),
  resultModalText: document.querySelector("#resultModalText"),
  resultModalScore: document.querySelector("#resultModalScore"),
  resultModalDetails: document.querySelector("#resultModalDetails"),
  playAgainButton: document.querySelector("#playAgainButton"),
  closeResultModalButton: document.querySelector("#closeResultModalButton")
};

const state = {
  selectedSubject: "historia",
  title: "Missão do conhecimento",
  difficulty: "medio",
  mode: "quiz",
  timerSeconds: 0,
  remainingSeconds: 0,
  timerId: null,
  questions: [],
  currentIndex: 0,
  score: 0,
  answered: false,
  lastConfig: null
};

function shuffle(items) {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[randomIndex]] = [copy[randomIndex], copy[i]];
  }

  return copy;
}

function getStudent() {
  return {
    name: elements.studentName.value.trim(),
    className: elements.studentClass.value.trim()
  };
}

function saveStudent() {
  const student = getStudent();

  localStorage.setItem("missaoAprenderStudent", JSON.stringify(student));

  elements.studentMessage.textContent = student.name
    ? `Dados salvos para ${student.name}.`
    : "Dados salvos. Você pode preencher o nome depois.";
}

function loadStudent() {
  try {
    const student = JSON.parse(localStorage.getItem("missaoAprenderStudent"));

    if (!student) return;

    elements.studentName.value = student.name || "";
    elements.studentClass.value = student.className || "";
  } catch (error) {
    console.warn("Não foi possível carregar os dados do estudante.", error);
  }
}

function getResults() {
  try {
    return JSON.parse(localStorage.getItem("missaoAprenderResults")) || [];
  } catch (error) {
    console.warn("Não foi possível carregar os resultados.", error);
    return [];
  }
}

function saveResults(results) {
  localStorage.setItem("missaoAprenderResults", JSON.stringify(results));
}

function selectSubject(subject) {
  state.selectedSubject = subject;
  elements.selectedSubjectTitle.textContent = `Missão de ${SUBJECT_NAMES[subject]}`;
  elements.gameLauncher.hidden = false;
  elements.gameLauncher.scrollIntoView({ behavior: "smooth", block: "center" });
}

function getFilteredQuestions(config) {
  let pool = QUESTION_BANK.filter((item) => item.type === config.mode);

  if (config.subject !== "todas") {
    pool = pool.filter((item) => item.subject === config.subject);
  }

  if (config.difficulty !== "mista") {
    pool = pool.filter((item) => item.difficulty === config.difficulty);
  }

  if (pool.length < config.count) {
    const broaderPool = QUESTION_BANK.filter((item) => {
      const subjectMatch =
        config.subject === "todas" || item.subject === config.subject;
      const modeMatch = item.type === config.mode;

      return subjectMatch && modeMatch;
    });

    pool = [...pool, ...broaderPool.filter((item) => !pool.some((saved) => saved.id === item.id))];
  }

  return shuffle(pool).slice(0, Math.min(config.count, pool.length));
}

function startGame(config) {
  const questions = getFilteredQuestions(config);

  if (!questions.length) {
    window.alert("Não há perguntas disponíveis para essa combinação.");
    return;
  }

  clearInterval(state.timerId);

  state.selectedSubject = config.subject;
  state.title = config.title;
  state.difficulty = config.difficulty;
  state.mode = config.mode;
  state.timerSeconds = config.timerSeconds;
  state.remainingSeconds = config.timerSeconds;
  state.questions = questions;
  state.currentIndex = 0;
  state.score = 0;
  state.answered = false;
  state.lastConfig = { ...config };

  elements.gameLauncher.hidden = true;
  elements.gameArea.hidden = false;
  elements.gameSubjectLabel.textContent = SUBJECT_NAMES[config.subject];
  elements.gameActivityTitle.textContent = config.title;
  elements.scoreCounter.textContent = "0 pontos";

  if (config.timerSeconds > 0) {
    elements.timerCounter.hidden = false;
    updateTimerDisplay();
    state.timerId = setInterval(tickTimer, 1000);
  } else {
    elements.timerCounter.hidden = true;
  }

  renderQuestion();
  elements.gameArea.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderQuestion() {
  const question = state.questions[state.currentIndex];
  const total = state.questions.length;
  const questionNumber = state.currentIndex + 1;

  state.answered = false;

  elements.questionCounter.textContent = `Pergunta ${questionNumber} de ${total}`;
  elements.scoreCounter.textContent = `${state.score} ${state.score === 1 ? "ponto" : "pontos"}`;
  elements.progressBar.style.width = `${((questionNumber - 1) / total) * 100}%`;
  elements.difficultyBadge.textContent = `Nível ${DIFFICULTY_NAMES[question.difficulty].toLowerCase()}`;
  elements.questionText.textContent = question.question;
  elements.answerGrid.innerHTML = "";
  elements.feedbackBox.hidden = true;
  elements.nextQuestionButton.hidden = true;

  question.options.forEach((option, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "answer-button";
    button.textContent = option;
    button.addEventListener("click", () => checkAnswer(index, button));

    elements.answerGrid.appendChild(button);
  });
}

function checkAnswer(selectedIndex, selectedButton) {
  if (state.answered) return;

  state.answered = true;

  const question = state.questions[state.currentIndex];
  const buttons = [...elements.answerGrid.querySelectorAll(".answer-button")];
  const isCorrect = selectedIndex === question.answer;

  buttons.forEach((button, index) => {
    button.disabled = true;

    if (index === question.answer) {
      button.classList.add("is-correct");
    }
  });

  if (isCorrect) {
    state.score += 1;
    elements.feedbackTitle.textContent = "Resposta correta!";
    elements.feedbackText.textContent = question.explanation;
  } else {
    selectedButton.classList.add("is-wrong");
    elements.feedbackTitle.textContent = "Quase! A resposta correta foi destacada.";
    elements.feedbackText.textContent = question.explanation;
  }

  elements.scoreCounter.textContent = `${state.score} ${state.score === 1 ? "ponto" : "pontos"}`;
  elements.feedbackBox.hidden = false;
  elements.nextQuestionButton.hidden = false;
  elements.nextQuestionButton.textContent =
    state.currentIndex === state.questions.length - 1
      ? "Ver resultado"
      : "Próxima pergunta";
}

function nextQuestion() {
  if (!state.answered) return;

  if (state.currentIndex < state.questions.length - 1) {
    state.currentIndex += 1;
    renderQuestion();
    return;
  }

  finishGame(false);
}

function finishGame(timeExpired) {
  clearInterval(state.timerId);

  const total = state.questions.length;
  const percentage = Math.round((state.score / total) * 100);
  const student = getStudent();

  const result = {
    id: Date.now(),
    student: student.name || "Estudante sem nome",
    className: student.className || "Não informada",
    activity: state.title,
    subject: SUBJECT_NAMES[state.selectedSubject],
    correct: state.score,
    total,
    percentage,
    date: new Date().toLocaleString("pt-BR")
  };

  const results = getResults();
  results.unshift(result);
  saveResults(results.slice(0, 100));
  renderResults();

  elements.progressBar.style.width = "100%";

  let message = "Você concluiu a atividade e o resultado foi salvo neste navegador.";
  let icon = "🏆";

  if (percentage >= 80) {
    message = "Excelente desempenho. Seu conhecimento entrou em modo turbo.";
    icon = "🏆";
  } else if (percentage >= 60) {
    message = "Bom trabalho. Mais uma rodada e essa pontuação sobe.";
    icon = "⭐";
  } else {
    message = "A revisão mostrou onde concentrar os estudos. Cada erro virou pista.";
    icon = "🧭";
  }

  if (timeExpired) {
    message = `O tempo terminou. ${message}`;
  }

  elements.resultModalIcon.textContent = icon;
  elements.resultModalTitle.textContent = state.title;
  elements.resultModalText.textContent = message;
  elements.resultModalScore.textContent = `${percentage}%`;
  elements.resultModalDetails.textContent = `${state.score} de ${total} acertos`;
  elements.resultModal.hidden = false;
}

function quitGame() {
  const shouldQuit = window.confirm(
    "Deseja encerrar a atividade? O progresso atual não será salvo."
  );

  if (!shouldQuit) return;

  clearInterval(state.timerId);
  elements.gameArea.hidden = true;
  elements.gameLauncher.hidden = false;
  elements.gameLauncher.scrollIntoView({ behavior: "smooth", block: "center" });
}

function tickTimer() {
  state.remainingSeconds -= 1;
  updateTimerDisplay();

  if (state.remainingSeconds <= 0) {
    finishGame(true);
  }
}

function updateTimerDisplay() {
  const minutes = Math.floor(Math.max(state.remainingSeconds, 0) / 60);
  const seconds = Math.max(state.remainingSeconds, 0) % 60;

  elements.timerCounter.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateTeacherPreview() {
  const timerValue = Number(elements.teacherTimer.value);

  elements.previewTitle.textContent =
    elements.activityTitleInput.value.trim() || "Atividade sem título";
  elements.previewSubject.textContent =
    SUBJECT_NAMES[elements.teacherSubject.value];
  elements.previewDifficulty.textContent =
    DIFFICULTY_NAMES[elements.teacherDifficulty.value];
  elements.previewQuestions.textContent =
    elements.teacherQuestionCount.value;
  elements.previewTimer.textContent =
    timerValue === 0 ? "Sem cronômetro" : `${timerValue / 60} minutos`;
}

function applyTeacherActivity(event) {
  event.preventDefault();

  const config = {
    title: elements.activityTitleInput.value.trim() || "Atividade da turma",
    subject: elements.teacherSubject.value,
    difficulty: elements.teacherDifficulty.value,
    count: Number(elements.teacherQuestionCount.value),
    timerSeconds: Number(elements.teacherTimer.value),
    mode: elements.teacherMode.value
  };

  startGame(config);
}

function renderResults() {
  const results = getResults();

  if (!results.length) {
    elements.resultsTableBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="7">Nenhuma atividade realizada ainda.</td>
      </tr>
    `;
    elements.totalActivities.textContent = "0";
    elements.averageScore.textContent = "0%";
    elements.bestScore.textContent = "0%";
    return;
  }

  const average = Math.round(
    results.reduce((sum, item) => sum + item.percentage, 0) / results.length
  );
  const best = Math.max(...results.map((item) => item.percentage));

  elements.totalActivities.textContent = String(results.length);
  elements.averageScore.textContent = `${average}%`;
  elements.bestScore.textContent = `${best}%`;

  elements.resultsTableBody.innerHTML = results
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.student)}</td>
          <td>${escapeHtml(item.className)}</td>
          <td>${escapeHtml(item.activity)}</td>
          <td>${escapeHtml(item.subject)}</td>
          <td>${item.correct}/${item.total}</td>
          <td><span class="score-pill">${item.percentage}%</span></td>
          <td>${escapeHtml(item.date)}</td>
        </tr>
      `
    )
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function exportResults() {
  const results = getResults();

  if (!results.length) {
    window.alert("Ainda não existem resultados para exportar.");
    return;
  }

  const headers = [
    "Estudante",
    "Turma",
    "Atividade",
    "Disciplina",
    "Acertos",
    "Total",
    "Nota",
    "Data"
  ];

  const rows = results.map((item) => [
    item.student,
    item.className,
    item.activity,
    item.subject,
    item.correct,
    item.total,
    `${item.percentage}%`,
    item.date
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
        .join(";")
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "resultados-missao-aprender.csv";
  link.click();

  URL.revokeObjectURL(url);
}

function clearResults() {
  const shouldClear = window.confirm(
    "Deseja apagar todos os resultados salvos neste navegador?"
  );

  if (!shouldClear) return;

  localStorage.removeItem("missaoAprenderResults");
  renderResults();
}

function closeResultModal(goToResults = false) {
  elements.resultModal.hidden = true;

  if (goToResults) {
    document.querySelector("#resultados").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

document.querySelectorAll(".subject-button").forEach((button) => {
  button.addEventListener("click", () => {
    selectSubject(button.dataset.subject);
  });
});


elements.saveStudentButton.addEventListener("click", saveStudent);

elements.closeLauncherButton.addEventListener("click", () => {
  elements.gameLauncher.hidden = true;
});

elements.startGameButton.addEventListener("click", () => {
  startGame({
    title: `Missão de ${SUBJECT_NAMES[state.selectedSubject]}`,
    subject: state.selectedSubject,
    difficulty: elements.gameDifficulty.value,
    count: Number(elements.gameQuestionCount.value),
    timerSeconds: 0,
    mode: elements.gameMode.value
  });
});

elements.quitGameButton.addEventListener("click", quitGame);
elements.nextQuestionButton.addEventListener("click", nextQuestion);
elements.teacherForm.addEventListener("submit", applyTeacherActivity);
elements.printPlanButton.addEventListener("click", () => window.print());

[
  elements.activityTitleInput,
  elements.teacherSubject,
  elements.teacherDifficulty,
  elements.teacherQuestionCount,
  elements.teacherTimer,
  elements.teacherMode
].forEach((input) => {
  input.addEventListener("input", updateTeacherPreview);
  input.addEventListener("change", updateTeacherPreview);
});

elements.exportResultsButton.addEventListener("click", exportResults);
elements.clearResultsButton.addEventListener("click", clearResults);

elements.playAgainButton.addEventListener("click", () => {
  closeResultModal(false);

  if (state.lastConfig) {
    startGame(state.lastConfig);
  }
});

elements.closeResultModalButton.addEventListener("click", () => {
  closeResultModal(true);
});

document.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", () => closeResultModal(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !elements.resultModal.hidden) {
    closeResultModal(false);
  }
});


/* ==========================================================
   MAPA-JOGO DA ILHA DE ITAPARICA
   Coordenadas percentuais aproximadas a partir do mapa enviado.
   ========================================================== */
const ISLAND_MAP_PLACES = [
  {
    id: "ponta-de-areia",
    name: "Ponta de Areia",
    municipality: "Itaparica",
    position: "Extremo norte da ilha",
    clue: "Procure o ponto mais ao norte.",
    description: "Localidade situada na parte mais alta do mapa, próxima à cidade de Itaparica.",
    x: 56.5,
    y: 2.0,
    labelSide: "right"
  },
  {
    id: "itaparica",
    name: "Itaparica",
    municipality: "Itaparica",
    position: "Norte da ilha",
    clue: "Fica no norte, voltada para a Baía de Todos-os-Santos.",
    description: "Cidade localizada no norte da ilha e uma das principais referências históricas do território insular.",
    x: 56.8,
    y: 10.0,
    labelSide: "right"
  },
  {
    id: "amoreiras",
    name: "Amoreiras",
    municipality: "Itaparica",
    position: "Nordeste da ilha",
    clue: "Está a leste de Itaparica, ainda na parte norte.",
    description: "Localidade indicada no setor nordeste do mapa, próxima de Manguinhos.",
    x: 67.0,
    y: 8.8,
    labelSide: "right"
  },
  {
    id: "bom-despacho",
    name: "Bom Despacho",
    municipality: "Itaparica",
    position: "Nordeste da ilha",
    clue: "Procure a área de chegada do ferry-boat.",
    description: "Ponto importante de chegada e saída da ilha por transporte marítimo.",
    x: 78.2,
    y: 18.0,
    labelSide: "left"
  },
  {
    id: "misericordia",
    name: "Misericórdia",
    municipality: "Itaparica",
    position: "Norte central",
    clue: "Fica no interior da parte norte, abaixo de Itaparica.",
    description: "Localidade representada na parte norte central da Ilha de Itaparica.",
    x: 59.5,
    y: 24.2,
    labelSide: "left"
  },
  {
    id: "juerana",
    name: "Juerana",
    municipality: "Vera Cruz",
    position: "Norte central",
    clue: "Está no interior da ilha, acima de Vera Cruz.",
    description: "Comunidade indicada na porção norte central, em área interior.",
    x: 67.0,
    y: 27.5,
    labelSide: "right"
  },
  {
    id: "jaburu",
    name: "Jaburu",
    municipality: "Vera Cruz",
    position: "Costa leste, ao norte de Mar Grande",
    clue: "Procure a costa leste, logo acima de Mar Grande.",
    description: "Localidade da costa leste associada a paisagens históricas e ao conjunto da Ponta do Jaburu.",
    x: 84.0,
    y: 31.0,
    labelSide: "left"
  },
  {
    id: "mar-grande",
    name: "Mar Grande",
    municipality: "Vera Cruz",
    position: "Costa leste",
    clue: "É a sede de Vera Cruz e fica na costa leste.",
    description: "Sede administrativa do município de Vera Cruz e importante porta de entrada da ilha.",
    x: 84.2,
    y: 35.0,
    labelSide: "left"
  },
  {
    id: "gamboa",
    name: "Gamboa",
    municipality: "Vera Cruz",
    position: "Costa leste, ao sul de Mar Grande",
    clue: "Desça pela costa leste a partir de Mar Grande.",
    description: "Comunidade ligada à mariscagem, à cultura popular e às memórias do litoral.",
    x: 82.5,
    y: 40.5,
    labelSide: "left"
  },
  {
    id: "penha",
    name: "Penha",
    municipality: "Vera Cruz",
    position: "Costa leste",
    clue: "Fica abaixo da Gamboa e acima de Barra do Gil.",
    description: "Comunidade conhecida pela paisagem litorânea, pela igreja e pelas ruínas do antigo forno de cal.",
    x: 81.1,
    y: 45.0,
    labelSide: "left"
  },
  {
    id: "conceicao",
    name: "Conceição",
    municipality: "Vera Cruz",
    position: "Costa leste central",
    clue: "Procure o lado leste, aproximadamente no meio da ilha.",
    description: "Localidade indicada no setor leste central, próxima de Barra do Pote.",
    x: 71.5,
    y: 61.8,
    labelSide: "left"
  },
  {
    id: "barra-grande",
    name: "Barra Grande",
    municipality: "Vera Cruz",
    position: "Sudeste central",
    clue: "Fica na costa atlântica, ao sul de Conceição.",
    description: "Localidade situada na faixa sudeste central da Ilha de Itaparica.",
    x: 58.5,
    y: 71.2,
    labelSide: "right"
  },
  {
    id: "baiacu",
    name: "Baiacu",
    municipality: "Vera Cruz",
    position: "Centro-oeste",
    clue: "Procure o lado oeste, na área central da ilha.",
    description: "Comunidade de grande importância histórica, ligada a patrimônio, religiosidade e memória.",
    x: 44.2,
    y: 49.4,
    labelSide: "right"
  },
  {
    id: "matarandiba",
    name: "Matarandiba",
    municipality: "Vera Cruz",
    position: "Oeste da ilha",
    clue: "É uma ilha menor ligada ao lado oeste de Itaparica.",
    description: "Comunidade insular marcada por identidade coletiva, território e relações com as águas.",
    x: 23.5,
    y: 56.8,
    labelSide: "right"
  },
  {
    id: "tairu",
    name: "Tairu",
    municipality: "Vera Cruz",
    position: "Sudeste",
    clue: "Fica na costa atlântica, abaixo de Ponta da Cruz.",
    description: "Localidade da faixa sudeste, indicada junto à costa do Oceano Atlântico.",
    x: 40.8,
    y: 78.1,
    labelSide: "right"
  },
  {
    id: "aratuba",
    name: "Aratuba",
    municipality: "Vera Cruz",
    position: "Sul da ilha",
    clue: "Procure o sul, entre Tairu e Berlinque.",
    description: "Localidade situada na porção sul, próxima da costa atlântica.",
    x: 33.0,
    y: 85.2,
    labelSide: "right"
  },
  {
    id: "berlinque",
    name: "Berlinque",
    municipality: "Vera Cruz",
    position: "Sul da ilha",
    clue: "Está abaixo de Aratuba e acima de Cacha-Pregos.",
    description: "Comunidade localizada no trecho sul da Ilha de Itaparica.",
    x: 27.2,
    y: 91.4,
    labelSide: "right"
  },
  {
    id: "jiribatuba",
    name: "Jiribatuba",
    municipality: "Vera Cruz",
    position: "Sudoeste",
    clue: "Procure o lado sudoeste, próximo ao Canal de Itaparica.",
    description: "Comunidade do sudoeste associada a águas tranquilas, manguezais e pesca artesanal.",
    x: 17.8,
    y: 81.0,
    labelSide: "right"
  },
  {
    id: "catu",
    name: "Catu",
    municipality: "Vera Cruz",
    position: "Extremo sudoeste",
    clue: "Fica perto da parte mais ao sul, no lado oeste.",
    description: "Comunidade situada no sudoeste da ilha, próxima de Jiribatuba e do extremo sul.",
    x: 8.0,
    y: 93.0,
    labelSide: "right"
  },
  {
    id: "cacha-pregos",
    name: "Cacha-Pregos",
    municipality: "Vera Cruz",
    position: "Extremo sul",
    clue: "Procure a ponta mais ao sul da ilha.",
    description: "Comunidade localizada no extremo sul, ligada à pesca, às embarcações e às paisagens costeiras.",
    x: 5.2,
    y: 98.2,
    labelSide: "right"
  }
];

const islandMapElements = {
  section: document.querySelector("#mapa-jogo"),
  board: document.querySelector("#islandMapBoard"),
  image: document.querySelector("#islandMapImage"),
  hotspots: document.querySelector("#islandMapHotspots"),
  modeButtons: [...document.querySelectorAll("[data-map-mode]")],
  modeLabel: document.querySelector("#mapModeLabel"),
  scoreLabel: document.querySelector("#mapScoreLabel"),
  roundLabel: document.querySelector("#mapRoundLabel"),
  targetCard: document.querySelector("#mapTargetCard"),
  targetName: document.querySelector("#mapTargetName"),
  targetClue: document.querySelector("#mapTargetClue"),
  placeName: document.querySelector("#mapPlaceName"),
  placeDescription: document.querySelector("#mapPlaceDescription"),
  placeMunicipality: document.querySelector("#mapPlaceMunicipality"),
  placePosition: document.querySelector("#mapPlacePosition"),
  settings: document.querySelector("#mapChallengeSettings"),
  difficulty: document.querySelector("#mapDifficulty"),
  rounds: document.querySelector("#mapRounds"),
  feedback: document.querySelector("#mapFeedback"),
  reset: document.querySelector("#resetMapGame")
};

const islandMapState = {
  mode: "explore",
  difficulty: "medio",
  rounds: 10,
  currentRound: 0,
  score: 0,
  queue: [],
  target: null,
  locked: false,
  finished: false
};

function renderIslandMapHotspots() {
  if (!islandMapElements.hotspots) return;

  islandMapElements.hotspots.replaceChildren();

  ISLAND_MAP_PLACES.forEach((place) => {
    const button = document.createElement("button");
    const label = document.createElement("span");

    button.type = "button";
    button.className = `map-hotspot${place.labelSide === "left" ? " is-left" : ""}`;
    button.style.left = `${place.x}%`;
    button.style.top = `${place.y}%`;
    button.dataset.placeId = place.id;
    button.setAttribute("aria-label", place.name);

    label.className = "map-hotspot__label";
    label.textContent = place.name;
    button.appendChild(label);

    button.addEventListener("click", () => handleIslandMapPlace(place, button));
    islandMapElements.hotspots.appendChild(button);
  });
}

function showIslandMapPlace(place) {
  islandMapElements.placeName.textContent = place.name;
  islandMapElements.placeDescription.textContent = place.description;
  islandMapElements.placeMunicipality.textContent = place.municipality;
  islandMapElements.placePosition.textContent = place.position;
}

function setIslandMapFeedback(title, text, type = "") {
  islandMapElements.feedback.classList.remove("is-success", "is-error");
  if (type) islandMapElements.feedback.classList.add(type);
  islandMapElements.feedback.innerHTML = `<strong>${escapeHtml(title)}</strong><p>${escapeHtml(text)}</p>`;
}

function setIslandMapMode(mode) {
  islandMapState.mode = mode;

  islandMapElements.modeButtons.forEach((button) => {
    const active = button.dataset.mapMode === mode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  if (mode === "explore") {
    resetIslandMapGame();
    return;
  }

  islandMapElements.modeLabel.textContent = "Preparar desafio";
  islandMapElements.targetCard.hidden = true;
  islandMapElements.board.classList.add("is-challenge");
  islandMapElements.image.src = "assets/img/jogos/mapa-ilha-desafio.png";
  setIslandMapFeedback(
    "Escolha o nível e as rodadas.",
    "Depois clique em “Iniciar jogo” para começar a missão de localização."
  );
}

function resetIslandMapGame() {
  islandMapState.mode = "explore";
  islandMapState.currentRound = 0;
  islandMapState.score = 0;
  islandMapState.queue = [];
  islandMapState.target = null;
  islandMapState.locked = false;
  islandMapState.finished = false;

  islandMapElements.modeButtons.forEach((button) => {
    const active = button.dataset.mapMode === "explore";
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  islandMapElements.board.classList.remove("is-challenge", "is-easy");
  islandMapElements.image.src = "assets/img/jogos/mapa-ilha-referencia.png";
  islandMapElements.targetCard.hidden = true;
  islandMapElements.modeLabel.textContent = "Exploração livre";
  islandMapElements.scoreLabel.textContent = "0 pontos";
  islandMapElements.roundLabel.textContent = "Livre";

  islandMapElements.hotspots.querySelectorAll(".map-hotspot").forEach((button) => {
    button.classList.remove("is-correct", "is-wrong");
    button.disabled = false;
  });

  setIslandMapFeedback(
    "Modo exploração ativado.",
    "Toque nos marcadores para conhecer a ilha antes de jogar."
  );
}

function startIslandMapChallenge(event) {
  event.preventDefault();

  islandMapState.mode = "challenge";
  islandMapState.difficulty = islandMapElements.difficulty.value;
  islandMapState.rounds = Number(islandMapElements.rounds.value);
  islandMapState.currentRound = 0;
  islandMapState.score = 0;
  islandMapState.finished = false;
  islandMapState.locked = false;
  islandMapState.queue = shuffle(ISLAND_MAP_PLACES).slice(
    0,
    Math.min(islandMapState.rounds, ISLAND_MAP_PLACES.length)
  );

  islandMapElements.modeButtons.forEach((button) => {
    const active = button.dataset.mapMode === "challenge";
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  islandMapElements.board.classList.add("is-challenge");
  islandMapElements.board.classList.toggle(
    "is-easy",
    islandMapState.difficulty === "facil"
  );
  islandMapElements.image.src = "assets/img/jogos/mapa-ilha-desafio.png";
  islandMapElements.modeLabel.textContent =
    islandMapState.difficulty === "facil"
      ? "Desafio fácil"
      : islandMapState.difficulty === "medio"
        ? "Desafio médio"
        : "Desafio difícil";
  islandMapElements.scoreLabel.textContent = "0 pontos";

  nextIslandMapRound();
  islandMapElements.board.scrollIntoView({ behavior: "smooth", block: "center" });
}

function nextIslandMapRound() {
  if (islandMapState.currentRound >= islandMapState.queue.length) {
    finishIslandMapChallenge();
    return;
  }

  islandMapState.locked = false;
  islandMapState.target = islandMapState.queue[islandMapState.currentRound];

  islandMapElements.hotspots.querySelectorAll(".map-hotspot").forEach((button) => {
    button.classList.remove("is-correct", "is-wrong");
    button.disabled = false;
  });

  islandMapElements.targetCard.hidden = false;
  islandMapElements.targetName.textContent = islandMapState.target.name;
  islandMapElements.targetClue.textContent =
    islandMapState.difficulty === "dificil"
      ? "Sem pista nesta rodada."
      : islandMapState.target.clue;

  islandMapElements.roundLabel.textContent =
    `${islandMapState.currentRound + 1} de ${islandMapState.queue.length}`;

  setIslandMapFeedback(
    "Nova missão no mapa.",
    `Encontre ${islandMapState.target.name} e clique no marcador correspondente.`
  );
}

function handleIslandMapPlace(place, button) {
  showIslandMapPlace(place);

  if (islandMapState.mode !== "challenge" || islandMapState.finished) {
    setIslandMapFeedback(
      place.name,
      `${place.description} Município: ${place.municipality}.`
    );
    return;
  }

  if (islandMapState.locked) return;
  islandMapState.locked = true;

  const correct = place.id === islandMapState.target.id;

  if (correct) {
    islandMapState.score += 1;
    button.classList.add("is-correct");
    islandMapElements.scoreLabel.textContent =
      `${islandMapState.score} ${islandMapState.score === 1 ? "ponto" : "pontos"}`;
    setIslandMapFeedback(
      "Localização correta!",
      `${place.name} fica em ${place.position.toLowerCase()}.`,
      "is-success"
    );
  } else {
    button.classList.add("is-wrong");
    const correctButton = islandMapElements.hotspots.querySelector(
      `[data-place-id="${islandMapState.target.id}"]`
    );
    if (correctButton) correctButton.classList.add("is-correct");
    setIslandMapFeedback(
      "Ainda não foi desta vez.",
      `O ponto correto era ${islandMapState.target.name}. Observe a posição e guarde a pista para a próxima rodada.`,
      "is-error"
    );
  }

  islandMapElements.hotspots.querySelectorAll(".map-hotspot").forEach((node) => {
    node.disabled = true;
  });

  islandMapState.currentRound += 1;
  window.setTimeout(nextIslandMapRound, 1250);
}

function finishIslandMapChallenge() {
  islandMapState.finished = true;
  islandMapState.locked = true;
  islandMapElements.targetCard.hidden = true;
  islandMapElements.roundLabel.textContent = "Concluído";

  const total = islandMapState.queue.length;
  const percentage = Math.round((islandMapState.score / total) * 100);
  const student = getStudent();

  const result = {
    id: Date.now(),
    student: student.name || "Estudante sem nome",
    className: student.className || "Não informada",
    activity: "Mapa-jogo da Ilha de Itaparica",
    subject: "Geografia e História local",
    correct: islandMapState.score,
    total,
    percentage,
    date: new Date().toLocaleString("pt-BR")
  };

  const results = getResults();
  results.unshift(result);
  saveResults(results.slice(0, 100));
  renderResults();

  const message =
    percentage >= 80
      ? "Excelente! Você navegou pelo mapa com olhar de cartógrafo."
      : percentage >= 60
        ? "Bom resultado. Mais uma viagem pelo mapa e a rota fica ainda mais clara."
        : "O mapa mostrou os pontos que precisam de revisão. Explore novamente e tente outra rodada.";

  setIslandMapFeedback(
    `Desafio concluído: ${percentage}%`,
    `${message} Resultado salvo na tabela de atividades.`,
    percentage >= 60 ? "is-success" : "is-error"
  );

  islandMapElements.placeName.textContent = "Missão concluída";
  islandMapElements.placeDescription.textContent = message;
  islandMapElements.placeMunicipality.textContent = "Ilha de Itaparica";
  islandMapElements.placePosition.textContent =
    `${islandMapState.score} de ${total} localizações corretas`;
}

function setupIslandMapGame() {
  if (!islandMapElements.section) return;

  renderIslandMapHotspots();

  islandMapElements.modeButtons.forEach((button) => {
    button.addEventListener("click", () => setIslandMapMode(button.dataset.mapMode));
  });

  islandMapElements.settings.addEventListener("submit", startIslandMapChallenge);
  islandMapElements.reset.addEventListener("click", resetIslandMapGame);

  resetIslandMapGame();
}


loadStudent();
updateTeacherPreview();
renderResults();
setupIslandMapGame();
