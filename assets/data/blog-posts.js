/*
  ================================================================
  BLOG CONECTA VERA CRUZ — ARQUIVO DE POSTAGENS
  ================================================================

  PARA PUBLICAR UMA NOVA NOTÍCIA:
  1. Copie o MODELO no final deste arquivo.
  2. Cole a cópia logo abaixo desta explicação, dentro da lista.
  3. Preencha título, data, resumo, imagem e conteúdo.
  4. Salve o arquivo. O blog se reorganiza sozinho pela data.

  IMPORTANTE:
  - Use uma slug sem espaços, acentos ou letras maiúsculas.
  - Coloque a imagem dentro de assets/img/blog/.
  - Informe o caminho como: assets/img/blog/nome-da-imagem.webp
  - A data deve seguir o formato AAAA-MM-DD.
*/

window.CONECTA_BLOG_POSTS = [
  {
    slug: "transporte-gratuito-eleicoes-2026-ilha-itaparica",
    titulo: "Eleições 2026: transporte gratuito em Salvador e na travessia para a Ilha de Itaparica",
    subtitulo: "Lanchinhas Salvador–Mar Grande e ferry-boat estão entre os serviços com gratuidade no período do primeiro turno.",
    resumo: "A gratuidade inclui as lanchinhas da travessia Salvador–Mar Grande e o ferry-boat, neste caso somente para pedestres. Em Salvador, ônibus, BRT, STEC, metrô e Elevador Lacerda também terão operação gratuita em períodos definidos para o dia da votação.",
    data: "2026-10-01",
    dataTexto: "1º de outubro de 2026",
    categoria: "Utilidade pública",
    categoriaSlug: "utilidade-publica",
    tags: ["Eleições 2026", "Transporte", "Mar Grande", "Ilha de Itaparica", "Lanchinhas", "Ferry-Boat", "Salvador"],
    autor: "Equipe Conecta Vera Cruz",
    tempoLeitura: "2 min",
    imagem: "assets/img/mar-grande/orla-mar-grande.webp",
    imagemAlt: "Orla de Mar Grande, em Vera Cruz, na Ilha de Itaparica",
    destaque: true,
    destaqueRotulo: "Serviço · Eleições 2026",
    conteudo: [
      {
        tipo: "paragrafo",
        texto: "Eleitores que precisam se deslocar entre Salvador, Vera Cruz, Itaparica e outros municípios da Bahia terão opções de transporte público gratuito durante o período do primeiro turno das Eleições 2026. A medida foi estabelecida pelos Decretos estaduais nº 24.833 e nº 24.834."
      },
      {
        tipo: "titulo",
        texto: "Travessia Salvador–Mar Grande"
      },
      {
        tipo: "paragrafo",
        texto: "As lanchinhas que fazem a travessia Salvador–Mar Grande estão incluídas na gratuidade prevista para o período eleitoral. Pelo Decreto nº 24.834, o benefício no primeiro turno começa às 18h de sábado, 3 de outubro, e vai até 23h59 de domingo, 4 de outubro."
      },
      {
        tipo: "video",
        src: "assets/video/blog/sobre-a-lancha-eleicoes-2026.mp4",
        poster: "assets/img/mar-grande/orla-mar-grande.webp",
        legenda: "Vídeo informativo sobre a travessia Salvador–Mar Grande e a gratuidade no período eleitoral."
      },
      {
        tipo: "titulo",
        texto: "Ferry-Boat: gratuidade somente para pedestres"
      },
      {
        tipo: "paragrafo",
        texto: "No Sistema Ferry-Boat, a gratuidade é exclusiva para passageiros pedestres. Veículos continuam sujeitos à cobrança normal. A Internacional Travessias Salvador orienta que o eleitor procure a bilheteria de pedestres e apresente o título de eleitor para retirar o bilhete gratuito."
      },
      {
        tipo: "nota",
        texto: "A operadora do Ferry-Boat informa, para o primeiro turno, gratuidade das 18h de 3 de outubro até 23h30 de 4 de outubro e recomenda chegar com antecedência aos terminais."
      },
      {
        tipo: "titulo",
        texto: "Transporte gratuito em Salvador"
      },
      {
        tipo: "paragrafo",
        texto: "No domingo, 4 de outubro, Salvador também terá gratuidade em sistemas municipais de transporte, incluindo ônibus convencionais, BRT, STEC (amarelinhos) e Elevador Lacerda. O metrô Salvador–Lauro de Freitas também terá acesso gratuito no dia da votação."
      },
      {
        tipo: "lista",
        itens: [
          "Lanchinhas Salvador–Mar Grande: incluídas na gratuidade estadual do período eleitoral.",
          "Ferry-Boat: gratuidade apenas para pedestres; veículos pagam normalmente.",
          "Ferry-Boat: para retirar o bilhete gratuito, a operadora orienta apresentar o título de eleitor na bilheteria de pedestres.",
          "Ônibus municipais de Salvador, BRT, STEC e Elevador Lacerda: gratuidade no domingo da votação.",
          "Metrô Salvador–Lauro de Freitas: gratuidade no domingo da eleição."
        ]
      },
      {
        tipo: "titulo",
        texto: "Se houver segundo turno"
      },
      {
        tipo: "paragrafo",
        texto: "A gratuidade estadual está prevista novamente das 18h de 24 de outubro até 23h59 de 25 de outubro. No Ferry-Boat, a operadora informou funcionamento do benefício até 23h30 do dia 25."
      },
      {
        tipo: "nota",
        texto: "Planeje o deslocamento com antecedência. Horários operacionais podem variar entre os sistemas, e a procura tende a aumentar no período da votação."
      },
      {
        tipo: "link",
        href: "https://g1.globo.com/ba/bahia/eleicoes/2026/noticia/2026/09/29/transportes-da-bahia-serao-gratuitos-nas-eleicoes-2026.ghtml",
        texto: "Fonte principal: g1 Bahia"
      },
      {
        tipo: "link",
        href: "https://www.internacionaltravessias.com.br/2026/09/30/informe-its-30-09-2026/",
        texto: "Orientação oficial do Sistema Ferry-Boat"
      }
    ]
  },
  {
    slug: "grande-final-copa-integracao-gamboa-2026",
    titulo: "Grande Final da Copa Integração da Gamboa: Cava Uma Falta x Joia Juve",
    subtitulo: "A decisão da Liga Esportiva e Distrital da Gamboa reúne as equipes da Gamboa e de Tairu.",
    resumo: "Cava Uma Falta F.C., da Gamboa, e Joia Juve, de Tairu, fazem a grande final da Copa Integração. A comunidade está convidada a acompanhar a decisão.",
    data: "2026-09-27",
    dataTexto: "27 de setembro de 2026",
    categoria: "Esporte",
    categoriaSlug: "esporte",
    tags: ["Esporte", "Gamboa", "Futebol", "Copa Integração"],
    autor: "Equipe Conecta Vera Cruz",
    tempoLeitura: "1 min",
    imagem: "assets/img/blog/grande-final-copa-integracao-gamboa-2026.png",
    imagemAlt: "Cartaz da grande final da Copa Integração de Futebol da Gamboa entre Cava Uma Falta F.C. e Joia Juve",
    destaque: false,
    conteudo: [
      {
        tipo: "paragrafo",
        texto: "A Gamboa recebe a grande final da Copa Integração de Futebol da Liga Esportiva e Distrital da Gamboa. A decisão coloca frente a frente Cava Uma Falta F.C., da Gamboa, e Joia Juve, de Tairu."
      },
      {
        tipo: "titulo",
        texto: "Futebol local e encontro entre comunidades"
      },
      {
        tipo: "paragrafo",
        texto: "A final reúne atletas, torcedores, famílias e moradores em mais um momento de valorização do esporte amador e da participação comunitária em Vera Cruz."
      },
      {
        tipo: "nota",
        texto: "As artes compartilhadas apresentam horários diferentes para a partida. Confirme o horário diretamente com a organização da competição antes de sair de casa."
      },
      {
        tipo: "imagem",
        src: "assets/img/blog/grande-final-copa-integracao-gamboa-2026.png",
        alt: "Cartaz da grande final da Copa Integração de Futebol da Gamboa",
        legenda: "Divulgação da grande final da Copa Integração de Futebol da Gamboa."
      }
    ]
  },
  {
    slug: "quilombo-tereré-luiz-eduardo-magalhaes",
    titulo: "Alunos da Escola Municipal Luís Eduardo Magalhães conhecem o Quilombo do Tereré",
    subtitulo: "Visita realizada em 15 de agosto de 2026.",
    resumo: "Uma aula de campo no Quilombo do Tereré aproximou os estudantes da história, da cultura, da memória e dos saberes preservados pela comunidade.",
    data: "2026-08-06",
    dataTexto: "18 de agosto de 2026",
    categoria: "Educação",
    categoriaSlug: "educacao",
    tags: ["Educação · Quilombo do Tereré · Aula de campo · História local · Cultura afro-brasileira · Memória · Escola Municipal Luís Eduardo Magalhães"],
    autor: "Equipe Conecta Vera Cruz",
    tempoLeitura: "2 min",
    imagem: "assets/img/blog/quilombo-terere/quilombo-terere.jpeg",
    imagemAlt: "Card do Colégio Luiz Eduardo Magalhães mostrando a evolução do IDEB dos anos finais de 3,1 em 2023 para 5,2 em 2025",
    destaque: false,
    conteudo: [
      {
        tipo: "paragrafo",
        texto: "Visita realizada em 15 de agosto aproximou os estudantes da história, da cultura e dos saberes preservados pela comunidade quilombola."
      },
       {
        tipo: "paragrafo",
        texto: "No dia 15 de agosto de 2026, alunos da Escola Municipal Luís Eduardo Magalhães participaram de uma aula de campo no Quilombo do Tereré. A visita proporcionou uma experiência de aprendizagem para além da sala de aula, colocando os estudantes em contato direto com o território e com conhecimentos construídos e preservados pela comunidade."
      },
      {
        tipo: "titulo",
        texto: "Aprender onde a história acontece"
      },
     
      {
        tipo: "paragrafo",
        texto: "Durante a visita, os estudantes puderam observar o espaço, acompanhar explicações e conhecer diferentes aspectos da vida e dos saberes presentes na comunidade."
      },
        {
        tipo: "paragrafo",
        texto: "A experiência ajudou a aproximar conteúdos estudados na escola de histórias, práticas e memórias que continuam vivas no território."
      },
         {
        tipo: "titulo",
        texto: "Memória, identidade e resistência"
      },
          {
        tipo: "paragrafo",
        texto: "Conhecer uma comunidade quilombola também amplia a compreensão sobre a participação da população negra na formação da sociedade brasileira e sobre a importância da resistência, da ancestralidade e da preservação da memória."
      },
          {
        tipo: "paragrafo",
        texto: "Mais do que uma visita, a atividade foi um convite para observar, ouvir, perguntar e aprender com quem vive e constrói a história do lugar."
      },
     
      {
        tipo: "citacao",
        texto: "Conhecer o território é também reconhecer as pessoas, as memórias e os saberes que fazem parte dele."
      },
      {
        tipo: "titulo",
        texto: "A escola além dos seus muros"
      },
      {
        tipo: "paragrafo",
        texto: "A aula de campo reforçou uma ideia importante para o trabalho desenvolvido pela escola: o território também pode ser espaço de aprendizagem."
      },
      {
        tipo: "paragrafo",
        texto: "Quando os estudantes conhecem de perto comunidades, patrimônios, modos de vida e histórias locais, o conteúdo dos livros ganha novos sentidos e passa a dialogar diretamente com a realidade."
      },
      {
        tipo: "paragrafo",
        texto: "Conhecer o território é também aprender a valorizar as pessoas, as memórias e os saberes que fazem parte dele."
      },
      
      {
        tipo: "galeria",
        imagens: [
          {
            src: "assets/img/blog/quilombo-terere/abelha-terere.jpeg",
            alt: "Alunos da Escola Municipal Luís Eduardo Magalhães durante visita ao Quilombo do Tereré",
            legenda: "Estudantes durante a visita ao Quilombo do Tereré."
          },
          {
            src: "assets/img/blog/quilombo-terere/quilombo do terere.jpeg",
            alt: "Momento de explicação durante a visita dos alunos ao Quilombo do Tereré",
            legenda: "A visita aproximou os estudantes da história, da memória e da cultura quilombola."
          },
          {
            src: "assets/img/blog/quilombo-terere/parede-eira-e-beiras.jpeg",
            alt: "Grupo de alunos em atividade educativa no Quilombo do Tereré",
            legenda: ""
          },
            {
            src: "assets/img/blog/quilombo-terere/agua-terere.jpeg",
            alt: "Grupo de alunos em atividade educativa no Quilombo do Tereré",
            legenda: "A fonte de água doce atraiu os primeiros moradores e formou o núcleo da comunidade quilombola"
          }
        ]
      },


    ]
  },
  {
    slug: "ideb-2025-luiz-eduardo-magalhaes",
    titulo: "Colégio Luiz Eduardo Magalhães conquista 1º lugar no IDEB de Vera Cruz",
    subtitulo: "Com nota 5,2 nos anos finais, o colégio celebra a evolução da aprendizagem e o melhor resultado do município.",
    resumo: "O Colégio Luiz Eduardo Magalhães alcançou nota 5,2 no IDEB 2025 e ficou em 1º lugar no município. O resultado representa um salto em relação à média 3,1 registrada em 2023.",
    data: "2026-08-06",
    dataTexto: "6 de agosto de 2026",
    categoria: "Educação",
    categoriaSlug: "educacao",
    tags: ["IDEB 2025", "Educação", "Gamboa", "Colégio Luiz Eduardo Magalhães", "Anos finais"],
    autor: "Equipe Conecta Vera Cruz",
    tempoLeitura: "2 min",
    imagem: "assets/img/blog/card-ideb.png",
    imagemAlt: "Card do Colégio Luiz Eduardo Magalhães mostrando a evolução do IDEB dos anos finais de 3,1 em 2023 para 5,2 em 2025",
    destaque: false,
    conteudo: [
      {
        tipo: "paragrafo",
        texto: "O Colégio Luiz Eduardo Magalhães, localizado na Gamboa, alcançou a nota 5,2 no IDEB 2025 nos anos finais e conquistou o 1º lugar entre os colégios do município de Vera Cruz."
      },
      {
        tipo: "titulo",
        texto: "Um avanço que merece destaque"
      },
      {
        tipo: "paragrafo",
        texto: "O resultado mostra uma evolução importante. Em 2023, a escola havia registrado média 3,1. Em 2025, chegou a 5,2, representando um crescimento de 2,1 pontos."
      },
      {
        tipo: "lista",
        itens: [
          "IDEB dos anos finais em 2023: 3,1.",
          "IDEB dos anos finais em 2025: 5,2.",
          "Crescimento registrado: 2,1 pontos.",
          "Posição no município: 1º lugar."
        ]
      },
      {
        tipo: "citacao",
        texto: "O sucesso de qualquer projeto depende do esforço coletivo."
      },
      {
        tipo: "titulo",
        texto: "Uma conquista construída por muitas mãos"
      },
      {
        tipo: "paragrafo",
        texto: "A conquista é resultado da dedicação dos estudantes, do compromisso dos professores, do trabalho da gestão e dos demais profissionais da escola, além da parceria das famílias."
      },
      {
        tipo: "paragrafo",
        texto: "Mais do que um número, a nota representa aprendizagem, planejamento, acompanhamento pedagógico e confiança no potencial dos alunos. A comunidade escolar comemora o resultado e segue trabalhando para alcançar novos avanços."
      },
      {
        tipo: "nota",
        texto: "Informações e médias apresentadas conforme o material de divulgação fornecido pela Escola Luiz Eduardo Magalhães."
      }
    ]
  },

  {
    slug: "festival-64-anos",
    titulo: "Festival de Aniversário movimenta a Orla de Mar Grande",
    subtitulo: "A programação dos 64 anos de Vera Cruz reuniu atrações em duas noites de música, encontro e celebração.",
    resumo: "Shows, diferentes ritmos e a paisagem da Orla de Mar Grande marcaram a programação musical do aniversário do município.",
    data: "2026-08-02",
    dataTexto: "2 de agosto de 2026",
    categoria: "Eventos",
    categoriaSlug: "eventos",
    tags: ["64 anos", "Festival", "Mar Grande", "Cultura"],
    autor: "Equipe Conecta Vera Cruz",
    tempoLeitura: "4 min",
    imagem: "assets/img/blog/64-anos/festival-programacao.webp",
    imagemAlt: "Cartaz do Festival de Aniversário de 64 anos de Vera Cruz",
    destaque: false,
    conteudo: [
      {
        tipo: "paragrafo",
        texto: "O Festival de Aniversário integrou a programação dos 64 anos de Vera Cruz e levou música à Orla de Mar Grande. O cartaz divulgado apresentou atrações para o sábado, 1º de agosto, e o domingo, 2 de agosto."
      },
      {
        tipo: "paragrafo",
        texto: "A festa reuniu diferentes ritmos e transformou a orla em ponto de encontro para moradores e visitantes, conectando a celebração municipal à paisagem de Mar Grande."
      },
      { tipo: "titulo", texto: "Programação divulgada" },
      {
        tipo: "lista",
        itens: [
          "Sábado, 1º de agosto: Jau, Escandurras e Tony Salles.",
          "Domingo, 2 de agosto: Sorriso Maroto e Xanddy Harmonia."
        ]
      },
      { tipo: "titulo", texto: "Registros do palco" },
      {
        tipo: "paragrafo",
        texto: "As fotografias mostram a energia das apresentações, o jogo de luzes e a proximidade entre artistas e público durante a programação comemorativa."
      },
      {
        tipo: "galeria",
        imagens: [
          {
            src: "assets/img/blog/64-anos/festival-palco-01.webp",
            alt: "Artista durante apresentação no Festival de Aniversário",
            legenda: "Música e celebração na Orla de Mar Grande."
          },
          {
            src: "assets/img/blog/64-anos/festival-palco-02.webp",
            alt: "Artista com microfone durante apresentação noturna",
            legenda: "Encontro do público com diferentes ritmos."
          },
          {
            src: "assets/img/blog/64-anos/festival-palco-03.webp",
            alt: "Artista cantando sob luzes coloridas do palco",
            legenda: "Dois dias para comemorar Vera Cruz."
          }
        ]
      },
      {
        tipo: "citacao",
        texto: "Celebrar a cidade também é reunir pessoas, ocupar os espaços públicos e criar novas lembranças."
      }
    ]
  },

  {
    slug: "vera-cruz-64-anos",
    titulo: "Rede Municipal de Ensino celebra os 64 anos de Vera Cruz nas ruas",
    subtitulo: "Crianças, jovens, professores e equipes escolares homenagearam a história do município e mostraram como a educação ajuda a construir o futuro da cidade.",
    resumo: "O ato cívico valorizou a história, a cultura e o orgulho de pertencer a Vera Cruz.",
    data: "2026-08-01",
    dataTexto: "1º de agosto de 2026",
    categoria: "Educação",
    categoriaSlug: "educacao",
    tags: ["64 anos", "Educação", "Cultura", "Ato cívico"],
    autor: "Equipe Conecta Vera Cruz",
    tempoLeitura: "4 min",
    imagem: "assets/img/blog/64-anos/ato-civico-cultura.webp",
    imagemAlt: "Estudante erguendo a mensagem Nossa origem, nossa cultura",
    destaque: false,
    conteudo: [
      {
        tipo: "paragrafo",
        texto: "As comemorações pelo aniversário de Vera Cruz contaram com a participação especial da Rede Municipal de Ensino. Em um ato cívico repleto de respeito e patriotismo, crianças e jovens homenagearam a história do município e reforçaram o compromisso com um futuro cada vez melhor."
      },
      {
        tipo: "paragrafo",
        texto: "Estudantes, professores e equipes escolares se dedicaram para abrilhantar o momento. A presença das escolas transformou a celebração em uma grande aula pública sobre pertencimento, memória e cidadania."
      },
      {
        tipo: "citacao",
        texto: "Nossa origem, nossa cultura."
      },
      { tipo: "titulo", texto: "Educação que sai da sala de aula" },
      {
        tipo: "paragrafo",
        texto: "Em celebração ao aniversário da cidade, estudantes, professores e equipes pedagógicas foram para a rua demonstrar o orgulho de fazer parte desta história. O ato cívico resgatou tradições, valorizou a cultura e mostrou que o futuro da população já está sendo construído com educação e dedicação."
      },
      {
        tipo: "paragrafo",
        texto: "A participação das comunidades escolares deu voz às diferentes gerações. Cada apresentação, faixa e manifestação cultural ajudou a lembrar que a história de Vera Cruz não vive apenas nos livros: ela também está nas festas, nos saberes comunitários, nas paisagens e nas experiências de quem mora no município."
      },
      { tipo: "titulo", texto: "Uma homenagem construída por muitas mãos" },
      {
        tipo: "paragrafo",
        texto: "O aniversário da cidade se tornou uma oportunidade para unir aprendizagem e celebração. O trabalho dos estudantes ganhou as ruas, enquanto professores e equipes escolares organizaram atividades que aproximaram escola, comunidade e memória local."
      },
      {
        tipo: "nota",
        texto: "Parabéns a todos os estudantes, professores e equipes escolares que fizeram deste momento algo inesquecível."
      }
    ]
  },

  {
    slug: "inauguracoes-64-anos",
    titulo: "Entregas e inaugurações marcam o aniversário de Vera Cruz",
    subtitulo: "A programação divulgada destacou ações em saúde, educação, esporte, infraestrutura e desenvolvimento.",
    resumo: "O aniversário municipal também foi apresentado como um período de entregas e melhorias em diferentes localidades.",
    data: "2026-07-07",
    dataTexto: "7 de julho de 2026",
    categoria: "Cidade",
    categoriaSlug: "cidade",
    tags: ["64 anos", "Inaugurações", "Serviços públicos", "Cidade"],
    autor: "Equipe Conecta Vera Cruz",
    tempoLeitura: "3 min",
    imagem: "assets/img/blog/64-anos/inauguracoes-programacao.webp",
    imagemAlt: "Cartaz da programação de inaugurações do aniversário de Vera Cruz",
    destaque: false,
    conteudo: [
      {
        tipo: "paragrafo",
        texto: "As comemorações pelos 64 anos de Vera Cruz também foram apresentadas como um festival de entregas para a população. Segundo a divulgação municipal, a programação reuniu obras e ações em diferentes áreas e localidades."
      },
      {
        tipo: "paragrafo",
        texto: "Saúde, educação, esporte, infraestrutura e desenvolvimento aparecem entre os setores destacados. A proposta divulgada foi associar o aniversário da cidade a melhorias nos serviços e nos espaços utilizados pelas comunidades."
      },
      { tipo: "titulo", texto: "Comemorar olhando para o futuro" },
      {
        tipo: "paragrafo",
        texto: "O aniversário municipal se tornou um momento para relembrar a história e, ao mesmo tempo, apresentar ações voltadas ao presente. Escolas, equipamentos públicos, espaços esportivos e estruturas de atendimento apareceram na comunicação da programação."
      },
      {
        tipo: "citacao",
        texto: "O melhor presente para a cidade é transformar a celebração em cuidado com as pessoas e com os lugares onde elas vivem."
      },
      { tipo: "titulo", texto: "Registro para acompanhar a cidade" },
      {
        tipo: "paragrafo",
        texto: "Ao reunir essas notícias no blog, o Conecta Vera Cruz cria um registro digital da programação. Esse arquivo ajuda estudantes e moradores a acompanhar mudanças, comparar períodos e compreender como o município se transforma ao longo do tempo."
      },
      {
        tipo: "nota",
        texto: "Esta notícia foi elaborada a partir da programação e dos textos de divulgação compartilhados para o especial dos 64 anos."
      }
    ]
  },

  {
    slug: "mariscagem-pinauna",
    titulo: "Mariscagem de pinaúna na Gamboa",
    subtitulo: "Uma tradição ligada à maré, ao trabalho comunitário e aos saberes transmitidos entre gerações.",
    resumo: "Mulheres da Gamboa preservam conhecimentos sobre o mar, as pedras e o tempo certo da coleta.",
    data: "2026-07-24",
    dataTexto: "24 de julho de 2026",
    categoria: "Cultura",
    categoriaSlug: "cultura",
    tags: ["Gamboa", "Pinaúna", "Mariscagem", "Tradição"],
    autor: "Estudantes do Conecta Vera Cruz",
    tempoLeitura: "5 min",
    imagem: "assets/img/nossa-historia/marisqueiras-pinauna.webp",
    imagemAlt: "Marisqueiras realizando a coleta de pinaúna na Gamboa",
    destaque: false,
    conteudo: [
      { tipo: "titulo", texto: "Uma prática ligada à maré" },
      {
        tipo: "paragrafo",
        texto: "A coleta de pinaúna depende do conhecimento do ambiente, das pedras, da maré e dos períodos adequados. Esse saber é construído pela experiência e transmitido entre gerações."
      },
      { tipo: "titulo", texto: "Trabalho, alimento e identidade" },
      {
        tipo: "paragrafo",
        texto: "Na Gamboa, a tradição é contada pelas mulheres e famílias que conhecem o mar. A prática faz parte da memória comunitária e da relação cotidiana dos moradores com o território."
      },
      { tipo: "titulo", texto: "Conhecimento e cuidado" },
      {
        tipo: "paragrafo",
        texto: "Registrar a mariscagem exige ouvir as pessoas que realizam a coleta, respeitar os limites definidos pelos moradores e explicar os cuidados ambientais relacionados à prática."
      }
    ]
  },

  {
    slug: "forno-da-penha",
    titulo: "O forno de cal da Penha",
    subtitulo: "Ruínas que ajudam a compreender técnicas de produção, trabalho e transformações na paisagem.",
    resumo: "O antigo forno guarda vestígios da produção de cal e das atividades que ajudaram a construir edificações na ilha e em Salvador.",
    data: "2026-07-18",
    dataTexto: "18 de julho de 2026",
    categoria: "Patrimônio",
    categoriaSlug: "patrimonio",
    tags: ["Penha", "Forno de cal", "Patrimônio", "História"],
    autor: "Estudantes do Conecta Vera Cruz",
    tempoLeitura: "5 min",
    imagem: "assets/img/hero-forno-penha.webp",
    imagemAlt: "Ruínas do forno de cal da Penha",
    destaque: false,
    conteudo: [
      { tipo: "titulo", texto: "O que era produzido" },
      {
        tipo: "paragrafo",
        texto: "Fornos de cal transformavam materiais calcários em cal, utilizada em construções, revestimentos e pinturas. A produção exigia altas temperaturas e longos períodos de queima."
      },
      { tipo: "titulo", texto: "Patrimônio do trabalho" },
      {
        tipo: "paragrafo",
        texto: "As ruínas ajudam a discutir técnicas, circulação de materiais, transformações da paisagem e condições de trabalho."
      },
      { tipo: "titulo", texto: "Memórias delicadas" },
      {
        tipo: "paragrafo",
        texto: "Relatos difíceis associados ao lugar devem ser apresentados com cautela, fontes claras e respeito às pessoas e famílias envolvidas."
      }
    ]
  },

  {
    slug: "como-contar-historia-vera-cruz",
    titulo: "Como contar a história de Vera Cruz",
    subtitulo: "Fontes, documentos, paisagens e memória oral ajudam a construir uma narrativa mais responsável.",
    resumo: "Um guia para pesquisar, comparar versões e mostrar as referências usadas nas páginas do projeto.",
    data: "2026-07-10",
    dataTexto: "10 de julho de 2026",
    categoria: "Pesquisa",
    categoriaSlug: "pesquisa",
    tags: ["História", "Pesquisa escolar", "Fontes", "Memória oral"],
    autor: "Equipe Conecta Vera Cruz",
    tempoLeitura: "4 min",
    imagem: "assets/img/hero-igreja-baiacu.webp",
    imagemAlt: "Patrimônio histórico de Vera Cruz",
    destaque: false,
    conteudo: [
      { tipo: "titulo", texto: "Comece pelas fontes" },
      {
        tipo: "paragrafo",
        texto: "Documentos oficiais, jornais, mapas, fotografias, objetos, prédios, paisagens e depoimentos podem ser comparados para construir uma narrativa mais confiável."
      },
      { tipo: "titulo", texto: "Escute versões diferentes" },
      {
        tipo: "paragrafo",
        texto: "Uma mesma transformação pode ser lembrada de modos distintos. Registrar divergências é mais honesto do que apagar vozes para criar uma história sem conflitos."
      },
      { tipo: "titulo", texto: "Mostre as referências" },
      {
        tipo: "paragrafo",
        texto: "Cada página deve informar de onde vieram os dados, quem concedeu entrevistas, quem produziu as fotografias e quando a pesquisa foi atualizada."
      },
      {
        tipo: "lista",
        itens: [
          "Conferir nomes e datas.",
          "Citar as fontes consultadas.",
          "Pedir autorização para publicar imagens.",
          "Revisar o texto com moradores e pessoas entrevistadas.",
          "Informar a data da última atualização."
        ]
      }
    ]
  }

  /*
  ================================================================
  MODELO PARA UMA NOVA POSTAGEM
  ================================================================

  ,{
    slug: "titulo-da-noticia",
    titulo: "Título da notícia",
    subtitulo: "Uma frase que apresenta a reportagem.",
    resumo: "Resumo curto usado nos cards do blog.",
    data: "2026-08-03",
    dataTexto: "3 de agosto de 2026",
    categoria: "Cultura",
    categoriaSlug: "cultura",
    tags: ["Vera Cruz", "Cultura"],
    autor: "Equipe Conecta Vera Cruz",
    tempoLeitura: "3 min",
    imagem: "assets/img/blog/nome-da-imagem.webp",
    imagemAlt: "Descrição acessível da fotografia",
    destaque: false,
    conteudo: [
      { tipo: "paragrafo", texto: "Primeiro parágrafo da notícia." },
      { tipo: "titulo", texto: "Título de uma seção" },
      { tipo: "paragrafo", texto: "Outro parágrafo." },
      { tipo: "citacao", texto: "Uma frase de destaque." },
      { tipo: "lista", itens: ["Item 1", "Item 2"] }
    ]
  }
  */
];
