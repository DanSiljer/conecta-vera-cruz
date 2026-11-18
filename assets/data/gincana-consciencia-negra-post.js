/* Matéria da Gincana da Consciência Negra 2026 — complemento de blog-posts.js.
   Carregar depois de feira-ciencias-post.js. Não altera a notícia em destaque. */
(function () {
  "use strict";
  if (!Array.isArray(window.CONECTA_BLOG_POSTS)) window.CONECTA_BLOG_POSTS = [];
  const novo = {
    slug: "primeiro-dia-gincana-consciencia-negra-2026",
    titulo: "Gincana da Consciência Negra: primeiro dia reúne cultura e aprendizagem na Gamboa",
    subtitulo: "Colégio Municipal Luiz Eduardo Magalhães realizou o primeiro dia da gincana em 18 de novembro, com atividades de valorização da história e da cultura afro-brasileira.",
    resumo: "Figurinos, pinturas corporais e participação da comunidade escolar marcaram o primeiro dia da Gincana da Consciência Negra, realizado em 18 de novembro.",
    data: "2026-11-18",
    dataTexto: "18 de novembro de 2026",
    categoria: "Educação",
    categoriaSlug: "educacao",
    tags: ["Gincana", "Consciência Negra", "Gamboa", "Educação antirracista", "Cultura afro-brasileira", "Colégio Municipal Luiz Eduardo Magalhães"],
    autor: "Equipe Conecta Vera Cruz",
    tempoLeitura: "2 min",
    imagem: "assets/img/blog/gincana-consciencia-negra/gincana-01.webp",
    imagemAlt: "Estudantes com figurinos culturais e pinturas corporais no primeiro dia da gincana",
    destaque: false,
    conteudo: [
      { tipo: "paragrafo", texto: "O Colégio Municipal Luiz Eduardo Magalhães, localizado na comunidade da Gamboa, em Vera Cruz, realizou nesta quarta-feira, 18 de novembro de 2026, o primeiro dia da Gincana da Consciência Negra." },
      { tipo: "paragrafo", texto: "A programação integra as atividades escolares de valorização da história e da cultura afro-brasileira. Nos registros do encontro, aparecem estudantes com figurinos, acessórios e pinturas corporais, além de integrantes da comunidade escolar reunidos no espaço da escola." },
      { tipo: "titulo", texto: "Identidade e representatividade" },
      { tipo: "paragrafo", texto: "As caracterizações apresentadas no primeiro dia deram visibilidade a referências culturais e abriram espaço para refletir sobre ancestralidade, identidade e a participação da população negra na formação do Brasil." },
      { tipo: "paragrafo", texto: "A proposta da gincana também é aproximar os estudantes de temas como resistência negra, respeito às diferenças e combate ao racismo, associando conhecimento histórico à expressão artística e à convivência." },
      { tipo: "titulo", texto: "Aprendizagem construída coletivamente" },
      { tipo: "paragrafo", texto: "A gincana vai além da competição. A participação dos estudantes e o envolvimento da equipe escolar transformam o momento em uma oportunidade de pesquisar, criar, apresentar e aprender em conjunto." },
      { tipo: "titulo", texto: "Registros do primeiro dia" },
      { tipo: "galeria", imagens: [
        { src: "assets/img/blog/gincana-consciencia-negra/gincana-01.webp", alt: "Participantes com figurinos, acessórios e pinturas corporais na quadra da escola", legenda: "Participantes caracterizados durante a programação da gincana." },
        { src: "assets/img/blog/gincana-consciencia-negra/gincana-02.webp", alt: "Integrantes da comunidade escolar reunidos na quadra", legenda: "Registro da comunidade escolar durante o primeiro dia de atividades." }
      ] },
      { tipo: "titulo", texto: "Consciência Negra na escola" },
      { tipo: "paragrafo", texto: "Realizada na semana do Dia da Consciência Negra, a atividade reforça a importância de reconhecer as contribuições africanas e afro-brasileiras para a sociedade e de manter o diálogo sobre igualdade racial ao longo de todo o ano letivo." },
      { tipo: "paragrafo", texto: "O primeiro dia deixou registros de participação e valorização cultural, mostrando como a escola pode ser um espaço de memória, identidade e construção coletiva do conhecimento." }
    ]
  };
  window.CONECTA_BLOG_POSTS = window.CONECTA_BLOG_POSTS.filter(p => p.slug !== novo.slug);
  window.CONECTA_BLOG_POSTS.unshift(novo);
})();
