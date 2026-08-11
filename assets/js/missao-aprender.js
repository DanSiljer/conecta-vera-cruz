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

/* ==========================================================
   BANCO AMPLIADO DE PERGUNTAS · v11
   Acrescenta pelo menos 10 novas perguntas por disciplina,
   nível e modo, sem misturar dificuldades.
   ========================================================== */
(function expandMissionQuestionBank() {
  let nextGeneratedId = 1000;

  function makeQuiz(subject, difficulty, seed) {
    const [question, correct, wrong1, wrong2, wrong3, explanation] = seed;
    const options = shuffle([correct, wrong1, wrong2, wrong3]);
    return {
      id: nextGeneratedId++,
      subject,
      difficulty,
      type: "quiz",
      question,
      options,
      answer: options.indexOf(correct),
      explanation
    };
  }

  function makeTrueFalse(subject, difficulty, seed, index) {
    const [question, correct, wrong1, , , explanation] = seed;
    const isTrue = index % 2 === 0;

    return {
      id: nextGeneratedId++,
      subject,
      difficulty,
      type: "verdadeiro-falso",
      question: isTrue
        ? explanation
        : `A alternativa “${wrong1}” responde corretamente à pergunta: “${question}”`,
      options: ["Verdadeiro", "Falso"],
      answer: isTrue ? 0 : 1,
      explanation: isTrue
        ? explanation
        : `A afirmação é falsa. A resposta correta é “${correct}”. ${explanation}`
    };
  }

  const SEEDS = {
    historia: {
      facil: [
        ["Quem costuma estudar objetos e vestígios materiais de sociedades antigas?", "Arqueólogo", "Astrônomo", "Meteorologista", "Engenheiro", "A arqueologia estuda vestígios materiais para compreender sociedades do passado."],
        ["Como chamamos o período anterior à invenção da escrita?", "Pré-História", "Idade Moderna", "Idade Média", "Antiguidade Clássica", "A Pré-História corresponde ao período anterior ao surgimento da escrita."],
        ["Qual característica é associada ao Paleolítico?", "Nomadismo", "Industrialização", "Uso de internet", "Produção em fábricas", "No Paleolítico, muitos grupos eram nômades e viviam da caça, pesca e coleta."],
        ["Qual mudança favoreceu o surgimento de aldeias permanentes no Neolítico?", "Agricultura", "Máquina a vapor", "Imprensa", "Moeda de papel", "A agricultura favoreceu a sedentarização e a formação de aldeias."],
        ["O que é uma fonte histórica?", "Um vestígio usado para estudar o passado", "Uma previsão do futuro", "Uma regra matemática", "Um mapa do clima", "Fontes históricas são vestígios que ajudam a investigar e interpretar o passado."],
        ["Qual destes pode ser uma fonte oral?", "Entrevista com um morador", "Moeda antiga", "Vaso de cerâmica", "Carta escrita", "Relatos e entrevistas são exemplos de fontes orais."],
        ["Qual invenção costuma marcar o fim da Pré-História?", "Escrita", "Telefone", "Automóvel", "Televisão", "O surgimento da escrita é tradicionalmente usado como marco para o fim da Pré-História."],
        ["Por que o domínio do fogo foi importante para grupos humanos antigos?", "Ajudou no aquecimento, proteção e preparo de alimentos", "Criou a agricultura imediatamente", "Inventou a escrita", "Eliminou todas as doenças", "O domínio do fogo trouxe proteção, calor e novas formas de preparar alimentos."],
        ["O que significa dizer que um grupo era sedentário?", "Vivia de forma mais permanente em um lugar", "Mudava de lugar todos os dias", "Vivia apenas em navios", "Não produzia alimentos", "Sedentarização é a permanência mais estável em um território."],
        ["Qual atividade foi muito importante no Neolítico?", "Domesticação de animais", "Construção de ferrovias", "Produção de automóveis", "Uso de satélites", "No Neolítico, agricultura e domesticação de animais transformaram o modo de vida humano."]
      ],
      medio: [
        ["Na Grécia Antiga, como eram chamadas as cidades-estado?", "Pólis", "Feudos", "Capitanias", "Províncias", "As pólis eram cidades-estado com governo, leis e organização próprios."],
        ["Qual cidade grega ficou conhecida pela valorização da participação política de cidadãos?", "Atenas", "Esparta", "Troia", "Alexandria", "Atenas ficou conhecida pelo desenvolvimento de formas de participação política entre cidadãos."],
        ["Qual cidade grega é lembrada pela forte educação militar?", "Esparta", "Atenas", "Roma", "Cartago", "Esparta organizava a educação dos cidadãos com forte orientação militar."],
        ["Na Roma Antiga, qual período veio depois da Monarquia?", "República", "Feudalismo", "Renascimento", "Iluminismo", "A República romana sucedeu a fase monárquica."],
        ["Qual era uma função do Senado na República Romana?", "Participar das decisões políticas", "Cultivar todas as terras", "Comandar escolas medievais", "Criar pirâmides", "O Senado foi uma instituição central na vida política romana."],
        ["O que caracterizava o feudalismo europeu?", "Relações de dependência e economia agrária", "Economia industrial mecanizada", "Comércio digital", "Democracia moderna universal", "O feudalismo tinha forte base agrária e relações de dependência entre grupos sociais."],
        ["O Renascimento valorizou especialmente qual ideia?", "Humanismo", "Isolamento cultural", "Fim das artes", "Rejeição do conhecimento clássico", "O humanismo renascentista valorizou o ser humano, as artes e referências da Antiguidade clássica."],
        ["As Grandes Navegações europeias dos séculos XV e XVI buscavam principalmente o quê?", "Novas rotas comerciais", "Criar ferrovias", "Fundar redes sociais", "Eliminar o comércio marítimo", "As navegações buscavam novas rotas, mercados e produtos."],
        ["Qual princípio iluminista defendia limites ao poder absoluto?", "Separação de poderes", "Poder sem leis", "Herança feudal obrigatória", "Fim da razão", "Pensadores iluministas defenderam limites ao absolutismo e novas formas de organização política."],
        ["A Revolução Industrial começou primeiro em qual país?", "Inglaterra", "Brasil", "Egito", "México", "A Inglaterra foi pioneira na industrialização a partir do século XVIII."]
      ],
      dificil: [
        ["Ao comparar duas fontes que apresentam versões diferentes de um fato, o historiador deve primeiro:", "Analisar autoria, contexto e finalidade de cada fonte", "Escolher a versão mais antiga sem análise", "Descartar as duas fontes", "Usar apenas a versão mais popular", "A crítica das fontes considera autoria, contexto, interesses e finalidade."],
        ["Por que a periodização histórica deve ser usada com cuidado?", "Porque os marcos podem não representar todas as sociedades da mesma forma", "Porque datas nunca existem", "Porque não há mudanças históricas", "Porque todo povo viveu os mesmos períodos", "Periodizações são ferramentas de organização e podem refletir contextos específicos."],
        ["O conceito de anacronismo significa:", "Aplicar ideias de uma época a outra de forma inadequada", "Comparar fontes diferentes", "Estudar documentos escritos", "Organizar fatos em ordem cronológica", "Anacronismo ocorre quando valores ou conceitos são deslocados de seu contexto histórico."],
        ["Qual prática ajuda a evitar conclusões históricas frágeis?", "Cruzar diferentes tipos de fontes", "Usar apenas uma fonte sem autoria", "Ignorar documentos contraditórios", "Descartar o contexto", "O cruzamento de fontes fortalece a investigação histórica."],
        ["O imperialismo do século XIX esteve ligado principalmente a:", "Expansão econômica e política das potências industriais", "Fim das disputas territoriais", "Desaparecimento do nacionalismo", "Isolamento europeu", "O imperialismo articulou interesses econômicos, estratégicos e políticos das potências industriais."],
        ["A Conferência de Berlim de 1884-1885 relaciona-se a:", "Regras para a ocupação colonial europeia na África", "Independência do Brasil", "Formação da União Europeia", "Fim do Império Romano", "A conferência definiu critérios europeus para a ocupação de territórios africanos."],
        ["Uma causa estrutural da Primeira Guerra Mundial foi:", "Rivalidade imperialista entre potências", "Invenção da agricultura", "Queda do Império Romano", "Fim das cidades", "Rivalidades imperialistas, nacionalismos e alianças contribuíram para a guerra."],
        ["O Tratado de Versalhes afetou a Alemanha porque:", "Impôs perdas territoriais, limitações militares e reparações", "Transformou a Alemanha em colônia brasileira", "Acabou com toda indústria europeia", "Criou o Império Romano", "O tratado impôs duras condições à Alemanha após a Primeira Guerra Mundial."],
        ["Por que a história de grupos populares pode aparecer menos em documentos oficiais?", "Porque muitos registros foram produzidos por instituições de poder", "Porque esses grupos não existiam", "Porque documentos oficiais nunca tratam de pessoas", "Porque a História só estuda reis", "A produção documental reflete relações de poder e pode silenciar determinados grupos."],
        ["O que significa dizer que a História é uma interpretação baseada em evidências?", "Que explicações são construídas a partir de fontes analisadas criticamente", "Que qualquer opinião vale como prova", "Que fatos não importam", "Que não é necessário pesquisar", "A interpretação histórica precisa ser fundamentada em evidências e análise crítica."]
      ]
    },

    geografia: {
      facil: [
        ["Qual ponto cardeal fica oposto ao Norte?", "Sul", "Leste", "Oeste", "Nordeste", "O Sul é o ponto cardeal oposto ao Norte."],
        ["Qual instrumento indica os pontos cardeais?", "Rosa dos ventos", "Termômetro", "Microscópio", "Calendário", "A rosa dos ventos representa direções como Norte, Sul, Leste e Oeste."],
        ["Qual é o maior oceano do planeta?", "Pacífico", "Atlântico", "Índico", "Ártico", "O Oceano Pacífico é o maior oceano da Terra."],
        ["Em qual continente está o Brasil?", "América do Sul", "Europa", "África", "Ásia", "O Brasil localiza-se na América do Sul."],
        ["Quantas regiões oficiais possui o Brasil?", "5", "3", "6", "8", "O Brasil é dividido em cinco regiões: Norte, Nordeste, Centro-Oeste, Sudeste e Sul."],
        ["Em qual região brasileira está a Bahia?", "Nordeste", "Norte", "Sul", "Centro-Oeste", "A Bahia pertence à Região Nordeste."],
        ["O que a legenda de um mapa apresenta?", "O significado de símbolos e cores", "A previsão do tempo", "O preço dos produtos", "A idade dos habitantes", "A legenda explica o significado dos símbolos utilizados em um mapa."],
        ["Qual movimento da Terra dura aproximadamente 24 horas?", "Rotação", "Translação", "Erosão", "Sedimentação", "A rotação é o movimento da Terra em torno de seu próprio eixo."],
        ["O que é paisagem geográfica?", "Conjunto de elementos percebidos em um lugar", "Apenas montanhas", "Somente construções", "Uma área sem pessoas", "A paisagem reúne elementos naturais e culturais percebidos no espaço."],
        ["Qual destas é uma forma de relevo?", "Planície", "Latitude", "Legenda", "Fuso horário", "Planície é uma das formas de relevo."]
      ],
      medio: [
        ["Qual movimento da Terra está relacionado às estações do ano?", "Translação", "Rotação", "Erosão", "Vulcanismo", "A translação, combinada à inclinação do eixo terrestre, está ligada às estações do ano."],
        ["O que diferencia tempo atmosférico de clima?", "Tempo é momentâneo; clima é observado por longos períodos", "São exatamente iguais", "Clima muda a cada hora", "Tempo só existe no verão", "Tempo descreve condições momentâneas, enquanto clima considera padrões de longo prazo."],
        ["O que é urbanização?", "Crescimento da população e dos espaços urbanos", "Retorno obrigatório ao campo", "Formação de oceanos", "Redução de todas as cidades", "Urbanização envolve crescimento das cidades e aumento da população urbana."],
        ["O que representa uma escala cartográfica?", "Relação entre a medida no mapa e a medida real", "Quantidade de rios", "Número de habitantes", "Altitude máxima", "A escala indica a proporção entre o espaço representado e o espaço real."],
        ["Qual bioma ocupa grande parte da Região Norte do Brasil?", "Amazônia", "Pampa", "Caatinga", "Mata de Araucárias", "A Amazônia ocupa grande parte da Região Norte."],
        ["A Caatinga é predominante em qual região brasileira?", "Nordeste", "Sul", "Norte", "Sudeste", "A Caatinga é um bioma característico de áreas semiáridas do Nordeste."],
        ["O que é migração?", "Deslocamento de pessoas entre lugares", "Movimento das placas tectônicas", "Mudança diária do clima", "Crescimento das plantas", "Migração é o deslocamento de pessoas de um lugar para outro."],
        ["Qual atividade pertence ao setor primário da economia?", "Agricultura", "Banco", "Indústria automobilística", "Comércio eletrônico", "Agricultura, pecuária, pesca e extrativismo fazem parte do setor primário."],
        ["O que é densidade demográfica?", "Número de habitantes por área", "Quantidade de cidades de um país", "Média de chuvas", "Altura das montanhas", "Densidade demográfica relaciona população e área ocupada."],
        ["Por que os rios são importantes para as sociedades?", "Fornecem água e podem apoiar transporte, energia e produção", "Servem apenas para turismo", "Impedem qualquer agricultura", "Não influenciam cidades", "Rios têm funções ambientais, econômicas e sociais importantes."]
      ],
      dificil: [
        ["Em uma escala 1:50.000, 1 cm no mapa representa:", "500 metros", "50 metros", "5 quilômetros", "50 quilômetros", "Em 1:50.000, 1 cm equivale a 50.000 cm, ou 500 metros."],
        ["O conceito de território envolve principalmente:", "Relações de poder e controle sobre o espaço", "Apenas elementos naturais", "Somente clima", "Apenas população absoluta", "Território está relacionado à apropriação, poder e controle do espaço."],
        ["Latitude é a distância, em graus, medida a partir de:", "Linha do Equador", "Meridiano de Greenwich", "Trópico de Capricórnio", "Polo Norte apenas", "A latitude é medida a partir da Linha do Equador."],
        ["Longitude é medida a partir de qual referência?", "Meridiano de Greenwich", "Linha do Equador", "Trópico de Câncer", "Círculo Polar Ártico", "A longitude é medida em relação ao Meridiano de Greenwich."],
        ["O fenômeno da ilha de calor urbana ocorre principalmente por:", "Concentração de concreto, asfalto e pouca vegetação", "Excesso de florestas", "Ausência de construções", "Diminuição completa do trânsito", "Superfícies urbanas absorvem calor e a falta de vegetação reduz o resfriamento."],
        ["O que caracteriza a globalização contemporânea?", "Intensificação de fluxos de informação, capital e mercadorias", "Fim das comunicações", "Desaparecimento do comércio", "Isolamento completo dos países", "A globalização intensifica conexões e fluxos em escala mundial."],
        ["Qual indicador relaciona nascimentos e mortes para analisar o crescimento natural?", "Taxas de natalidade e mortalidade", "Longitude e latitude", "Escala e legenda", "Altitude e relevo", "O crescimento natural é analisado pela diferença entre natalidade e mortalidade."],
        ["O desmatamento pode alterar o ciclo da água porque:", "Reduz evapotranspiração e modifica o escoamento", "Aumenta automaticamente todos os rios", "Impede qualquer chuva no planeta", "Não interfere no solo", "A retirada de vegetação modifica infiltração, evapotranspiração e escoamento."],
        ["O que é uma bacia hidrográfica?", "Área drenada por um rio principal e seus afluentes", "Uma região sem rios", "Um tipo de oceano", "Uma divisão política", "Bacia hidrográfica é o conjunto de terras drenadas por um rio e seus afluentes."],
        ["Por que mapas em diferentes projeções podem apresentar distorções?", "Porque é necessário representar uma superfície curva em um plano", "Porque mapas não usam medidas", "Porque a Terra é plana", "Porque escalas não existem", "Toda projeção cartográfica apresenta algum tipo de distorção ao planificar a superfície terrestre."]
      ]
    },

    portugues: {
      facil: [
        ["Qual destas palavras é um substantivo?", "Casa", "Bonito", "Correr", "Rapidamente", "Substantivos nomeiam seres, lugares, objetos, ideias e sentimentos."],
        ["Qual destas palavras é um verbo?", "Estudar", "Caderno", "Azul", "Calmamente", "Verbos podem indicar ação, estado ou fenômeno."],
        ["Qual destas palavras é um adjetivo?", "Alegre", "Menina", "Cantar", "Ontem", "Adjetivos caracterizam substantivos."],
        ["Qual sinal costuma encerrar uma pergunta?", "Ponto de interrogação", "Vírgula", "Dois-pontos", "Ponto e vírgula", "O ponto de interrogação é usado para marcar perguntas diretas."],
        ["Qual é o plural de 'animal'?", "Animais", "Animals", "Animales", "Animãos", "O plural correto de animal é animais."],
        ["Qual palavra é sinônimo de 'feliz'?", "Contente", "Triste", "Lento", "Escuro", "Sinônimos possuem sentidos semelhantes em determinado contexto."],
        ["Qual palavra é antônimo de 'alto'?", "Baixo", "Grande", "Largo", "Forte", "Antônimos apresentam sentidos opostos."],
        ["Na frase 'Pedro correu para casa', quem praticou a ação?", "Pedro", "Casa", "Para", "Correu", "Pedro é o sujeito que pratica a ação expressa pelo verbo."],
        ["Qual destas palavras está grafada corretamente?", "Exemplo", "Ezemplo", "Esemplo", "Exenplo", "A grafia correta é exemplo."],
        ["Em 'A menina bonita sorriu', qual palavra caracteriza 'menina'?", "Bonita", "Sorriu", "A", "Menina", "Bonita é o adjetivo que caracteriza o substantivo menina."]
      ],
      medio: [
        ["Em 'Choveu muito ontem', o verbo indica:", "Fenômeno da natureza", "Nome de pessoa", "Característica", "Lugar", "O verbo chover expressa um fenômeno da natureza."],
        ["Qual conectivo indica ideia de oposição?", "Porém", "Portanto", "Porque", "Então", "Porém introduz uma ideia de contraste ou oposição."],
        ["Qual conectivo indica conclusão?", "Portanto", "Embora", "Enquanto", "Porque", "Portanto é usado para introduzir uma conclusão."],
        ["Em 'Os alunos fizeram a atividade', qual é o sujeito?", "Os alunos", "A atividade", "Fizeram", "Atividade", "O sujeito é o termo sobre o qual se declara algo."],
        ["Qual é a principal finalidade de uma notícia?", "Informar sobre acontecimentos", "Ensinar apenas receitas", "Criar regras de jogos", "Vender obrigatoriamente produtos", "A notícia tem como função principal informar fatos de interesse público."],
        ["Em um texto, o título ajuda principalmente a:", "Antecipar o tema", "Eliminar a leitura", "Substituir todo o texto", "Corrigir a ortografia automaticamente", "O título orienta o leitor e pode antecipar o assunto tratado."],
        ["Qual frase apresenta discurso direto?", "Ana disse: 'Vou estudar agora.'", "Ana disse que estudaria depois.", "Ana estudou em silêncio.", "A estudante abriu o caderno.", "O discurso direto reproduz diretamente a fala de uma personagem ou pessoa."],
        ["Em 'Ele estudou porque teria prova', 'porque' indica:", "Causa", "Lugar", "Conclusão", "Oposição", "Porque pode introduzir a causa de uma ação."],
        ["Qual recurso ajuda a evitar repetição excessiva de palavras em um texto?", "Pronomes e sinônimos", "Erros ortográficos", "Frases sem pontuação", "Palavras aleatórias", "Pronomes e sinônimos ajudam na coesão e evitam repetições desnecessárias."],
        ["Qual gênero textual costuma apresentar ingredientes e modo de preparo?", "Receita", "Notícia", "Poema", "Bilhete", "Receitas organizam ingredientes e etapas de preparo."]
      ],
      dificil: [
        ["Em 'A lua derramava prata sobre o mar', ocorre principalmente:", "Metáfora", "Linguagem literal", "Enumeração técnica", "Definição científica", "A expressão cria uma imagem figurada ao associar a luz da lua à prata."],
        ["Em 'Estou morrendo de fome', há um exemplo de:", "Hipérbole", "Eufemismo", "Onomatopeia", "Antítese", "A hipérbole exagera uma ideia para produzir efeito expressivo."],
        ["Em 'O vento sussurrava entre as árvores', ocorre:", "Personificação", "Metonímia", "Pleonasmo", "Ironia", "Personificação atribui características humanas a seres ou elementos não humanos."],
        ["Qual alternativa apresenta uma oração subordinada causal?", "Fiquei em casa porque chovia.", "Estudei e fiz a prova.", "Cheguei, portanto sentei.", "Ou você vai ou fica.", "A oração introduzida por 'porque' expressa a causa de ficar em casa."],
        ["Na frase 'Embora estivesse cansado, continuou estudando', 'embora' indica:", "Concessão", "Causa", "Conclusão", "Explicação", "Embora introduz uma ideia concessiva, isto é, um fato que não impede a ação principal."],
        ["O que é ambiguidade?", "Possibilidade de mais de uma interpretação", "Erro obrigatório de ortografia", "Ausência de verbo", "Uso de apenas uma palavra", "Ambiguidade ocorre quando uma expressão admite mais de uma interpretação."],
        ["O que é coesão textual?", "Ligação entre partes do texto por recursos linguísticos", "Quantidade de páginas", "Tamanho da fonte", "Uso exclusivo de frases longas", "A coesão organiza as relações entre palavras, frases e parágrafos."],
        ["Em 'Li Machado de Assis', quando o nome do autor representa sua obra, ocorre:", "Metonímia", "Hipérbole", "Antítese", "Onomatopeia", "A metonímia substitui um termo por outro com o qual mantém relação de proximidade."],
        ["Qual é a função de uma tese em um texto argumentativo?", "Apresentar a ideia principal defendida", "Narrar apenas fatos fictícios", "Substituir os argumentos", "Listar palavras sem relação", "A tese apresenta o ponto de vista central que será defendido."],
        ["Qual recurso fortalece um argumento?", "Dados, exemplos e evidências pertinentes", "Repetição sem justificativa", "Ofensas ao leitor", "Informações sem relação", "Argumentos se tornam mais consistentes quando apoiados por evidências e exemplos relevantes."]
      ]
    },

    ciencias: {
      facil: [
        ["Qual órgão participa principalmente da respiração?", "Pulmões", "Estômago", "Fêmur", "Bexiga", "Os pulmões realizam trocas gasosas essenciais à respiração."],
        ["Qual órgão bombeia o sangue?", "Coração", "Fígado", "Pele", "Intestino", "O coração impulsiona o sangue pelo sistema circulatório."],
        ["Qual processo permite às plantas produzir alimento usando luz?", "Fotossíntese", "Digestão", "Fermentação", "Condensação", "Na fotossíntese, plantas utilizam luz, água e gás carbônico para produzir matéria orgânica."],
        ["Qual estado físico da água é o gelo?", "Sólido", "Líquido", "Gasoso", "Plasma", "O gelo é água no estado sólido."],
        ["Qual planeta é conhecido por abrigar vida?", "Terra", "Marte", "Vênus", "Mercúrio", "A Terra reúne condições conhecidas para a existência de vida."],
        ["Qual é a principal fonte de luz e calor para a Terra?", "Sol", "Lua", "Júpiter", "Marte", "O Sol fornece energia luminosa e térmica à Terra."],
        ["Qual destes é um ser vivo?", "Árvore", "Pedra", "Vidro", "Plástico", "Árvores são organismos vivos."],
        ["Qual sentido usamos principalmente para perceber sons?", "Audição", "Visão", "Paladar", "Olfato", "A audição permite perceber ondas sonoras."],
        ["O que acontece com a água líquida ao congelar?", "Torna-se sólida", "Torna-se metal", "Desaparece", "Vira areia", "No congelamento, a água passa do estado líquido para o sólido."],
        ["Qual material é atraído por um ímã comum?", "Ferro", "Madeira", "Papel", "Vidro", "Materiais ferromagnéticos, como o ferro, podem ser atraídos por ímãs."]
      ],
      medio: [
        ["Qual estrutura é considerada a unidade básica dos seres vivos?", "Célula", "Átomo", "Rocha", "Planeta", "A célula é a unidade estrutural e funcional básica dos seres vivos."],
        ["Qual relação ecológica ocorre quando um animal caça outro para se alimentar?", "Predação", "Mutualismo", "Comensalismo", "Cooperação", "Predação ocorre quando um organismo captura e consome outro."],
        ["Qual material é bom condutor elétrico?", "Cobre", "Borracha", "Plástico", "Madeira seca", "Metais como o cobre conduzem bem a corrente elétrica."],
        ["O que é uma mistura homogênea?", "Mistura com aspecto uniforme", "Mistura sempre sólida", "Substância sem partículas", "Elemento químico puro", "Uma mistura homogênea apresenta uma única fase visível."],
        ["Qual sistema do corpo transporta oxigênio e nutrientes?", "Circulatório", "Digestório apenas", "Esquelético", "Tegumentar", "O sistema circulatório transporta sangue, gases e nutrientes pelo corpo."],
        ["Qual gás é absorvido pelas plantas durante a fotossíntese?", "Gás carbônico", "Oxigênio apenas", "Hélio", "Hidrogênio puro", "As plantas utilizam gás carbônico na fotossíntese."],
        ["O que caracteriza uma cadeia alimentar?", "Transferência de matéria e energia entre organismos", "Lista de planetas", "Sequência de rochas", "Mapa de rios", "Cadeias alimentares representam relações de alimentação em um ecossistema."],
        ["Qual mudança de estado ocorre quando o vapor vira líquido?", "Condensação", "Fusão", "Sublimação", "Solidificação", "Condensação é a passagem do estado gasoso para o líquido."],
        ["Qual é uma função dos rins?", "Filtrar o sangue e formar urina", "Bombear sangue", "Produzir luz", "Realizar fotossíntese", "Os rins filtram substâncias do sangue e participam da formação da urina."],
        ["Por que a vacinação é importante?", "Ajuda o sistema imune a reconhecer agentes infecciosos", "Substitui toda higiene", "Impede qualquer doença para sempre", "Elimina a necessidade de saúde pública", "Vacinas estimulam respostas do sistema imunológico e reduzem riscos de doenças."]
      ],
      dificil: [
        ["Qual molécula armazena a informação genética na maioria dos seres vivos?", "DNA", "Água", "Glicose", "Oxigênio", "O DNA armazena informações genéticas essenciais à hereditariedade."],
        ["Em um circuito simples, o que acontece se o circuito estiver aberto?", "A corrente elétrica é interrompida", "A corrente aumenta infinitamente", "A pilha desaparece", "A lâmpada sempre acende", "Um circuito aberto não permite um caminho contínuo para a corrente."],
        ["Qual princípio explica que energia não é criada nem destruída, apenas transformada?", "Conservação da energia", "Seleção natural", "Lei da gravidade apenas", "Fermentação", "O princípio da conservação da energia afirma que ela se transforma, mas não surge do nada nem desaparece."],
        ["O efeito estufa natural é importante porque:", "Ajuda a manter a temperatura do planeta adequada à vida", "É sempre causado apenas por fábricas", "Impede toda radiação solar", "Congela os oceanos", "O efeito estufa natural mantém parte do calor na atmosfera e torna a Terra habitável."],
        ["O aumento excessivo de gases de efeito estufa pode levar a:", "Aquecimento global", "Fim da gravidade", "Desaparecimento do Sol", "Paralisação da rotação terrestre", "A maior concentração de gases de efeito estufa intensifica a retenção de calor."],
        ["Qual processo explica mudanças hereditárias em populações ao longo das gerações?", "Evolução biológica", "Evaporação", "Combustão", "Condensação", "A evolução biológica descreve mudanças nas populações ao longo do tempo."],
        ["Na seleção natural, indivíduos com características favoráveis tendem a:", "Deixar mais descendentes em determinado ambiente", "Parar de se reproduzir", "Transformar-se instantaneamente", "Eliminar toda variação genética", "Características que aumentam sucesso reprodutivo podem tornar-se mais frequentes."],
        ["Qual é a diferença básica entre massa e peso?", "Massa mede quantidade de matéria; peso depende da gravidade", "São sempre exatamente a mesma grandeza", "Peso não depende da gravidade", "Massa só existe na Terra", "Massa e peso são grandezas diferentes; o peso depende do campo gravitacional."],
        ["O pH abaixo de 7 indica, em geral, uma solução:", "Ácida", "Básica", "Neutra", "Metálica", "Em condições usuais, pH menor que 7 indica acidez."],
        ["Por que antibióticos não devem ser usados contra vírus sem indicação médica?", "Porque antibióticos atuam contra bactérias, não contra vírus", "Porque vírus são metais", "Porque antibióticos são vacinas", "Porque bactérias e vírus são iguais", "Antibióticos são medicamentos direcionados a bactérias e não tratam infecções virais comuns."]
      ]
    },

    "vera-cruz": {
      facil: [
        ["Qual povo originário habitava a Ilha de Itaparica antes da ocupação portuguesa?", "Tupinambás", "Romanos", "Vikings", "Fenícios", "Os Tupinambás já habitavam a Ilha de Itaparica antes da ocupação portuguesa."],
        ["O que significa 'Vera Crux'?", "A verdadeira cruz", "A grande ilha", "O mar azul", "A nova terra", "Vera Crux é uma expressão latina que significa 'a verdadeira cruz'."],
        ["Em qual município está Mar Grande?", "Vera Cruz", "Salvador", "Cairu", "Valença", "Mar Grande é a sede administrativa do município de Vera Cruz."],
        ["Qual elemento natural marca fortemente a vida das comunidades de Vera Cruz?", "Mar", "Deserto", "Neve", "Geleira", "O mar participa do trabalho, das travessias, da cultura e da memória das comunidades."],
        ["Em que ano Vera Cruz conquistou sua emancipação política?", "1962", "1500", "1822", "2000", "A emancipação política de Vera Cruz ocorreu em 1962."],
        ["Qual localidade é a sede de Vera Cruz?", "Mar Grande", "Baiacu", "Gamboa", "Penha", "Mar Grande tornou-se a sede administrativa do município."],
        ["Qual destes lugares pertence a Vera Cruz?", "Cacha-Pregos", "Pelourinho", "Feira de Santana", "Lençóis", "Cacha-Pregos é uma comunidade do município de Vera Cruz."],
        ["Qual atividade tradicional está ligada às águas da ilha?", "Pesca artesanal", "Mineração de neve", "Criação de renas", "Cultivo de trigo em geleiras", "Pesca e mariscagem fazem parte de modos de vida tradicionais ligados ao mar."],
        ["Em 1500, qual nome chegou a ser usado para o território brasileiro?", "Ilha de Vera Cruz", "Ilha de Mar Grande", "Reino de Itaparica", "Província do Atlântico", "Ilha de Vera Cruz foi um dos primeiros nomes atribuídos ao território pelos portugueses."],
        ["Qual comunidade é conhecida no projeto por mariscagem e cultura local?", "Gamboa", "Brasília", "Copacabana", "Olinda", "A Gamboa aparece no projeto ligada à mariscagem, cultura popular e memória comunitária."]
      ],
      medio: [
        ["O que ocorreu em 1560 na história local apresentada pelo site?", "Fundação do povoado com a invocação do Senhor da Vera Cruz", "Emancipação municipal", "Construção de uma ponte para Salvador", "Criação da República", "Em 1560 foi fundado um povoado com a invocação do Senhor da Vera Cruz."],
        ["Qual igreja foi fundada em 1561 segundo a história apresentada no site?", "Igreja do Nosso Senhor da Vera Cruz", "Igreja da Pampulha", "Catedral de Brasília", "Igreja de São Francisco de Ouro Preto", "A Igreja do Nosso Senhor da Vera Cruz foi fundada em 1561."],
        ["O que aconteceu em 1563 na antiga Vera Cruz?", "Criação da primeira freguesia da Ilha de Itaparica", "Primeira eleição presidencial", "Construção do aeroporto", "Fim da colonização", "Em 1563 foi criada a primeira freguesia da Ilha de Itaparica."],
        ["Antes da emancipação, o território de Vera Cruz estava ligado a qual município?", "Itaparica", "Salvador", "Cairu", "Santo Amaro", "Antes da emancipação, as localidades que formariam Vera Cruz integravam o município de Itaparica."],
        ["Qual era uma das reivindicações dos moradores no movimento emancipacionista?", "Administração mais próxima e melhores serviços públicos", "Fim das escolas", "Proibição da pesca", "Transferência da ilha para outro estado", "A busca por serviços e administração mais próxima fortaleceu o movimento pela autonomia."],
        ["Por que uma freguesia colonial não era apenas uma igreja?", "Porque reunia também moradias, ruas, comércio e serviços", "Porque era somente um navio", "Porque não havia moradores", "Porque era uma fábrica", "A freguesia funcionava como uma centralidade religiosa e comunitária."],
        ["Qual nome é citado como 'Pai de Vera Cruz' no conteúdo do site?", "José Eloy de Carvalho", "Pedro Álvares Cabral", "Tomé de Sousa", "Tiradentes", "José Eloy de Carvalho é apresentado como liderança ligada à municipalização de Vera Cruz."],
        ["Quem foi o primeiro prefeito de Vera Cruz citado no site?", "Almiro Antunes de Brito", "José Bonifácio", "Rui Barbosa", "Jorge Amado", "Almiro Antunes de Brito foi o primeiro prefeito de Vera Cruz, governando de 1963 a 1967."],
        ["Qual comunidade aparece ligada ao antigo Forno da Cal?", "Penha", "Mar Grande", "Gamboa", "Jiribatuba", "O Forno da Penha integra a memória histórica da comunidade da Penha."],
        ["Qual relação melhor descreve Vera Cruz e o mar?", "O mar influencia trabalho, transporte, cultura e memória", "O mar não interfere na vida local", "O município não possui litoral", "As comunidades evitam atividades marítimas", "As águas fazem parte da paisagem, das travessias e dos modos de vida de Vera Cruz."]
      ],
      dificil: [
        ["Por que o nome Vera Cruz foi retomado na criação do município?", "Como homenagem à antiga freguesia, à igreja e ao padroeiro", "Por causa de uma fábrica moderna", "Porque era o nome de uma companhia aérea", "Para copiar o nome de Salvador", "O nome recupera a memória da antiga freguesia, da igreja e da devoção ao Senhor da Vera Cruz."],
        ["Qual lei estadual é citada no site como referente à criação do município?", "Lei Estadual nº 1.773", "Lei Áurea", "Constituição de 1988", "Lei nº 10.639", "A página de história cita a Lei Estadual nº 1.773, de 30 de julho de 1962."],
        ["Qual aspecto econômico ajudava a sustentar a defesa da emancipação?", "Pesca, agricultura, comércio e atividades marítimas", "Apenas indústria automobilística", "Extração de petróleo em larga escala", "Produção de neve artificial", "A economia local era apoiada por pesca, agricultura, comércio, cal, veraneio e circulação marítima."],
        ["Qual fator territorial dificultava a administração antes da emancipação?", "Distância entre comunidades e a antiga sede", "Ausência total de população", "Excesso de metrôs", "Falta de mar", "A distância e as dificuldades de deslocamento reforçaram a busca por administração própria."],
        ["Quem é citado como uma das primeiras lideranças a levantar a bandeira da emancipação em Mar Grande?", "Pedro Martiniano Rodrigues Menezes", "Dom Pedro II", "Castro Alves", "Zumbi dos Palmares", "Pedro Martiniano Rodrigues Menezes, conhecido como Pedro Piroca, aparece como liderança inicial do movimento."],
        ["Qual deputado é citado como responsável por encaminhar a resolução à Assembleia Legislativa?", "Jorge Calmon", "Ulysses Guimarães", "Rui Barbosa", "Tancredo Neves", "Segundo o conteúdo do site, Jorge Calmon recebeu a resolução e encaminhou o processo à Assembleia Legislativa."],
        ["Qual símbolo da bandeira de Vera Cruz representa bravura, força e coragem?", "Cruz de Malta", "Estrela vermelha", "Ramo de café", "Engrenagem", "A Cruz de Malta é apresentada como símbolo de bravura, força e coragem."],
        ["O que a concha amarela representa na bandeira, segundo o site?", "Alimentação, fertilidade e crescimento", "Somente indústria", "Neve e inverno", "Transporte ferroviário", "A concha amarela simboliza alimentação e, em sentido simbólico, fertilidade e crescimento."],
        ["O que representam as linhas azuis da bandeira de Vera Cruz?", "Céu e profundezas do mar", "Estradas e ferrovias", "Montanhas e desertos", "Fábricas e comércio", "As linhas azuis representam o céu e as profundezas do mar."],
        ["Por que a emancipação de Vera Cruz também gerou resistência política?", "Havia temor de perda de território, arrecadação e influência por Itaparica", "Porque não existiam moradores", "Porque Vera Cruz não tinha comunidades", "Porque a ilha seria transferida para outro país", "Parte dos moradores e políticos de Itaparica temia perdas territoriais, econômicas e políticas."]
      ]
    }
  };

  /* Matemática é gerada por cálculo, garantindo variação real. */
  SEEDS.matematica = {
    facil: [
      ["Quanto é 12 + 9?", "21", "19", "20", "22", "12 + 9 = 21."],
      ["Quanto é 30 - 14?", "16", "14", "15", "18", "30 - 14 = 16."],
      ["Quanto é 6 × 8?", "48", "42", "46", "54", "6 × 8 = 48."],
      ["Quanto é 72 ÷ 8?", "9", "8", "7", "10", "72 ÷ 8 = 9."],
      ["Qual é o dobro de 35?", "70", "65", "75", "60", "O dobro de 35 é 70."],
      ["Qual é a metade de 90?", "45", "40", "50", "35", "A metade de 90 é 45."],
      ["Quanto é 7 × 9?", "63", "56", "72", "69", "7 × 9 = 63."],
      ["Quanto é 100 - 37?", "63", "67", "73", "53", "100 - 37 = 63."],
      ["Quanto é 45 + 28?", "73", "63", "72", "83", "45 + 28 = 73."],
      ["Se 20 balas são divididas igualmente entre 4 crianças, quantas cada uma recebe?", "5", "4", "6", "8", "20 ÷ 4 = 5."]
    ],
    medio: [
      ["Quanto é 25% de 200?", "50", "25", "75", "100", "25% de 200 corresponde a 50."],
      ["Qual fração é equivalente a 3/6?", "1/2", "1/3", "2/3", "3/4", "3/6 simplifica para 1/2."],
      ["Quanto é 2,5 + 1,75?", "4,25", "3,25", "4,15", "5,25", "2,5 + 1,75 = 4,25."],
      ["Um retângulo mede 8 cm por 5 cm. Qual é sua área?", "40 cm²", "26 cm²", "13 cm²", "80 cm²", "Área do retângulo = base × altura = 8 × 5 = 40 cm²."],
      ["Se 3 cadernos custam R$ 24, quanto custa cada um?", "R$ 8", "R$ 6", "R$ 9", "R$ 12", "24 ÷ 3 = 8."],
      ["Qual é o resultado de 3/4 de 20?", "15", "12", "16", "18", "3/4 de 20 = 15."],
      ["Um produto de R$ 120 teve desconto de 10%. Qual o novo preço?", "R$ 108", "R$ 110", "R$ 100", "R$ 118", "10% de 120 é 12; 120 - 12 = 108."],
      ["Qual é a média de 6, 8 e 10?", "8", "7", "9", "10", "(6 + 8 + 10) ÷ 3 = 8."],
      ["Quanto é 1,2 × 10?", "12", "1,02", "120", "0,12", "Multiplicar por 10 desloca a vírgula uma casa: 1,2 × 10 = 12."],
      ["Uma razão 2:5 é equivalente a qual fração?", "2/5", "5/2", "2/7", "5/7", "A razão 2:5 pode ser escrita como 2/5."]
    ],
    dificil: [
      ["Se 4x - 6 = 18, qual é o valor de x?", "6", "3", "4", "8", "4x = 24, então x = 6."],
      ["Quanto é 2³ × 2²?", "32", "16", "64", "8", "2³ × 2² = 2⁵ = 32."],
      ["Qual é a raiz quadrada de 144?", "12", "14", "10", "16", "12 × 12 = 144."],
      ["Um triângulo tem base 10 cm e altura 6 cm. Qual é a área?", "30 cm²", "60 cm²", "16 cm²", "36 cm²", "Área do triângulo = base × altura ÷ 2 = 30 cm²."],
      ["Se 5x + 10 = 45, qual é x?", "7", "5", "9", "11", "5x = 35, então x = 7."],
      ["Qual é 15% de 360?", "54", "45", "36", "72", "15% de 360 = 54."],
      ["Em uma turma, 12 de 30 alunos escolheram futebol. Qual porcentagem isso representa?", "40%", "30%", "50%", "60%", "12 ÷ 30 = 0,4, ou 40%."],
      ["Quanto é (3 + 5) × 4 - 6?", "26", "20", "32", "14", "Primeiro 3 + 5 = 8; depois 8 × 4 = 32; 32 - 6 = 26."],
      ["Qual é o MMC de 6 e 8?", "24", "12", "18", "48", "24 é o menor múltiplo comum de 6 e 8."],
      ["Uma caixa tem 3 bolas vermelhas e 2 azuis. Qual a probabilidade de retirar uma azul?", "2/5", "3/5", "1/2", "2/3", "Há 2 bolas azuis em um total de 5, portanto a probabilidade é 2/5."]
    ]
  };

  Object.entries(SEEDS).forEach(([subject, levels]) => {
    Object.entries(levels).forEach(([difficulty, seeds]) => {
      seeds.forEach((seed, index) => {
        QUESTION_BANK.push(makeQuiz(subject, difficulty, seed));
        QUESTION_BANK.push(makeTrueFalse(subject, difficulty, seed, index));
      });
    });
  });
})();

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
  syncLauncherQuestionCount();
  elements.gameLauncher.hidden = false;
  elements.gameLauncher.scrollIntoView({ behavior: "smooth", block: "center" });
}

function getQuestionPool(config) {
  return QUESTION_BANK.filter((item) => {
    const subjectMatch =
      config.subject === "todas" || item.subject === config.subject;
    const modeMatch = item.type === config.mode;
    const difficultyMatch =
      config.difficulty === "mista" || item.difficulty === config.difficulty;

    return subjectMatch && modeMatch && difficultyMatch;
  });
}

function getFilteredQuestions(config) {
  const pool = getQuestionPool(config);
  return shuffle(pool).slice(0, Math.min(config.count, pool.length));
}

function buildQuestionCountChoices(maxAvailable, preferredValue) {
  if (maxAvailable <= 0) return [];

  const standard = [5, 8, 10, 15].filter((value) => value <= maxAvailable);
  const choices = [...standard];

  if (!choices.length || choices[choices.length - 1] !== maxAvailable) {
    choices.push(maxAvailable);
  }

  const unique = [...new Set(choices)].sort((a, b) => a - b);

  if (preferredValue && preferredValue <= maxAvailable && !unique.includes(preferredValue)) {
    unique.push(preferredValue);
    unique.sort((a, b) => a - b);
  }

  return unique;
}

function updateQuestionCountSelect(select, maxAvailable, preferredValue) {
  if (!select) return;

  const previous = Number(preferredValue || select.value || 0);
  const choices = buildQuestionCountChoices(maxAvailable, previous);

  select.innerHTML = "";

  if (!choices.length) {
    const option = document.createElement("option");
    option.value = "0";
    option.textContent = "Sem perguntas disponíveis";
    select.appendChild(option);
    select.disabled = true;
    return;
  }

  choices.forEach((value) => {
    const option = document.createElement("option");
    option.value = String(value);
    option.textContent = `${value} ${value === 1 ? "pergunta" : "perguntas"}`;
    select.appendChild(option);
  });

  select.disabled = false;

  const desired =
    choices.includes(previous)
      ? previous
      : choices.includes(8)
        ? 8
        : choices[choices.length - 1];

  select.value = String(desired);
}

function syncLauncherQuestionCount() {
  if (!elements.gameQuestionCount) return;

  const config = {
    subject: state.selectedSubject,
    difficulty: elements.gameDifficulty.value,
    mode: elements.gameMode.value
  };

  const maxAvailable = getQuestionPool(config).length;
  updateQuestionCountSelect(
    elements.gameQuestionCount,
    maxAvailable,
    Number(elements.gameQuestionCount.value)
  );
}

function syncTeacherQuestionCount() {
  if (
    !elements.teacherQuestionCount ||
    !elements.teacherSubject ||
    !elements.teacherDifficulty ||
    !elements.teacherMode
  ) {
    return;
  }

  const config = {
    subject: elements.teacherSubject.value,
    difficulty: elements.teacherDifficulty.value,
    mode: elements.teacherMode.value
  };

  const maxAvailable = getQuestionPool(config).length;
  updateQuestionCountSelect(
    elements.teacherQuestionCount,
    maxAvailable,
    Number(elements.teacherQuestionCount.value)
  );

  updateTeacherPreview();
}

function startGame(config) {
  const available = getQuestionPool(config).length;

  if (!available) {
    window.alert("Não há perguntas disponíveis para essa combinação de disciplina, nível e tipo.");
    return;
  }

  const safeConfig = {
    ...config,
    count: Math.min(Number(config.count) || available, available)
  };

  const questions = getFilteredQuestions(safeConfig);

  clearInterval(state.timerId);

  state.selectedSubject = safeConfig.subject;
  state.title = safeConfig.title;
  state.difficulty = safeConfig.difficulty;
  state.mode = safeConfig.mode;
  state.timerSeconds = safeConfig.timerSeconds;
  state.remainingSeconds = safeConfig.timerSeconds;
  state.questions = questions;
  state.currentIndex = 0;
  state.score = 0;
  state.answered = false;
  state.lastConfig = { ...safeConfig };

  elements.gameLauncher.hidden = true;
  elements.gameArea.hidden = false;
  elements.gameSubjectLabel.textContent = SUBJECT_NAMES[safeConfig.subject];
  elements.gameActivityTitle.textContent = safeConfig.title;
  elements.scoreCounter.textContent = "0 pontos";

  if (safeConfig.timerSeconds > 0) {
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

elements.gameDifficulty.addEventListener("change", syncLauncherQuestionCount);
elements.gameMode.addEventListener("change", syncLauncherQuestionCount);

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
  elements.teacherQuestionCount,
  elements.teacherTimer
].forEach((input) => {
  input.addEventListener("input", updateTeacherPreview);
  input.addEventListener("change", updateTeacherPreview);
});

[
  elements.teacherSubject,
  elements.teacherDifficulty,
  elements.teacherMode
].forEach((input) => {
  input.addEventListener("change", syncTeacherQuestionCount);
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
   INICIALIZAÇÃO
   O mapa-jogo é controlado exclusivamente por assets/js/mapa-ilha.js.
   Não mantenha uma segunda implementação do mapa neste arquivo.
   ========================================================== */

loadStudent();
syncLauncherQuestionCount();
syncTeacherQuestionCount();
renderResults();
