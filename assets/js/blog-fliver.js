(() => {
  "use strict";

  const POST = {
    slug: "fliver-feira-literaria-vera-cruz-2026",
    categoria: "Educação e Cultura",
    dataTexto: "29 de agosto de 2026",
    autor: "Conecta Vera Cruz",
    tempoLeitura: "6 min de leitura",
    titulo: "FLIVER mobiliza escolas de Vera Cruz em celebração à literatura e à ancestralidade",
    tituloDestaque: "FLIVER mobiliza escolas de Vera Cruz",
    subtitulo:
      "Realizada simultaneamente nas escolas de Vera Cruz, a FLIVER mobilizou a rede municipal em torno da leitura, da cultura e da ancestralidade. No Colégio Luís Eduardo Magalhães, a programação ganhou exposições, apresentações e encontros com escritores locais.",
    resumo:
      "Com o tema “Entre sol, mar e areia: palavras que contam nossa ancestralidade”, a FLIVER aconteceu simultaneamente nas escolas de Vera Cruz, envolvendo estudantes, professores e comunidades escolares em atividades de literatura, cultura e identidade local.",
    imagem: "assets/img/blog/fliver/fliver-cartaz-principal.jpeg"
  };

  const gallery = [
    ["assets/img/blog/fliver/fliver-banner-escola.jpeg", "Banner da FLIVER exposto no Colégio Luís Eduardo Magalhães."],
    ["assets/img/blog/fliver/fliver-mesa-livros.jpeg", "Livros em exposição durante a programação literária."],
    ["assets/img/blog/fliver/fliver-apresentacao.jpeg", "Apresentação cultural durante a FLIVER."],
    ["assets/img/blog/fliver/fliver-palestra.jpeg", "Momento de fala e partilha com o público."],
    ["assets/img/blog/fliver/fliver-alunos-exposicao.jpeg", "Estudantes visitando produções e exposições da feira."],
    ["assets/img/blog/fliver/fliver-tenda-escritores-carla.jpeg", "Participação da escritora Carla Lacerda na Tenda dos Escritores de Vera Cruz."],
    ["assets/img/blog/fliver/fliver-tenda-escritores-gil.jpeg", "Participação da escritora Gil Lima na Tenda dos Escritores de Vera Cruz."],
    ["assets/img/blog/fliver/fliver-tenda-escritores-fernando.jpeg", "Participação do escritor Fernado Bernardes na Tenda dos Escritores de Vera Cruz."],
    ["assets/img/blog/fliver/fliver-alunos.jpeg", "Estudantes reunidos durante a programação da FLIVER."],
    ["assets/img/blog/fliver/fliver-convidados.jpeg", "Convidados e equipe em registro da programação literária."],
    ["assets/img/blog/fliver/fliver-convite.jpeg", "Convite oficial da FLIVER."],
    ["assets/img/blog/fliver/fliver-programacao.jpeg", "Programação do Festival Escolar Literário de Vera Cruz."],
  ];

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function makeImage(src, alt, eager = false) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.loading = eager ? "eager" : "lazy";
    if (eager) img.fetchPriority = "high";
    return img;
  }

  function renderFeatured() {
    const host = document.querySelector("[data-blog-featured]");
    if (!host) return;

    const label = el("div", "blog-featured-label");
    label.append(
      el("strong", "", "Em destaque"),
      el("span", "", "FLIVER · Literatura, cultura e identidade")
    );

    const article = el("article", "blog-lead-story blog-lead-story--fliver");
    const media = el("button", "blog-lead-story__media blog-fliver-open");
    media.type = "button";
    media.setAttribute("aria-label", `Ler reportagem: ${POST.titulo}`);
    media.append(
      makeImage(POST.imagem, "Cartaz da FLIVER utilizado pelo Colégio Luís Eduardo Magalhães durante a programação da Feira Literária de Vera Cruz", true),
      el("span", "blog-lead-story__category", POST.categoria)
    );

    const content = el("div", "blog-lead-story__content");
    const meta = el("div", "blog-meta");
    meta.append(el("span", "", POST.dataTexto), el("span", "", POST.tempoLeitura));

    const h2 = el("h2", "blog-fliver-featured-title", POST.tituloDestaque || POST.titulo);

    const read = el("button", "blog-read-link blog-fliver-open");
    read.type = "button";
    read.append(document.createTextNode("Ler reportagem"), el("span", "", "→"));

    content.append(meta, h2, el("p", "", POST.resumo), read);
    article.append(media, content);
    host.replaceChildren(label, article);

    host.querySelectorAll(".blog-fliver-open").forEach((button) => {
      button.addEventListener("click", openReport);
    });
  }

  function paragraph(text) {
    return el("p", "blog-article__paragraph", text);
  }

  function sectionTitle(text) {
    return el("h3", "blog-article__section-title", text);
  }

  function figure(src, caption, extraClass = "") {
    const fig = el("figure", `blog-article__figure ${extraClass}`.trim());
    fig.append(makeImage(src, caption));
    fig.appendChild(el("figcaption", "", caption));
    return fig;
  }

  function galleryBlock(items) {
    const wrap = el("div", "blog-article__gallery blog-fliver-gallery");
    items.forEach(([src, caption]) => {
      const fig = el("figure");
      fig.append(makeImage(src, caption), el("figcaption", "", caption));
      wrap.appendChild(fig);
    });
    return wrap;
  }

  function videoBlock() {
    const section = el("section", "blog-fliver-video");
    const copy = el("div", "blog-fliver-video__copy");
    copy.append(
      el("span", "blog-fliver-video__kicker", "FLIVER em outras escolas"),
      el("h3", "", "Um olhar sobre a FLIVER no Colégio Municipal Geralda Maria da Conceição"),
      el(
        "p",
        "",
        "A FLIVER aconteceu ao mesmo tempo nas escolas de Vera Cruz, mas cada comunidade escolar viveu a proposta do seu jeito. Neste registro, você pode acompanhar um pouco da programação realizada no Colégio Municipal Geralda Maria da Conceição."
      )
    );

    const videoWrap = el("div", "blog-fliver-video__media");
    const video = document.createElement("video");
    video.controls = true;
    video.preload = "metadata";
    video.playsInline = true;
    video.poster = "assets/img/blog/fliver/fliver-programacao-cmgm.jpeg";
    video.setAttribute(
      "aria-label",
      "Vídeo da FLIVER no Colégio Municipal Geralda Maria da Conceição"
    );

    const source = document.createElement("source");
    source.src = "assets/video/flivarGeraldaMaria.mp4";
    source.type = "video/mp4";
    video.appendChild(source);

    const fallback = document.createElement("p");
    fallback.textContent = "Seu navegador não conseguiu reproduzir este vídeo.";
    video.appendChild(fallback);

    const videoStatus = el("p", "blog-fliver-video__status", "");
    video.addEventListener("loadedmetadata", () => {
      videoStatus.textContent = "";
    });
    video.addEventListener("error", () => {
      videoStatus.textContent = "O vídeo não foi carregado. Verifique se o arquivo assets/video/flivarGeraldaMaria.mp4 está publicado com esse mesmo nome.";
    });

    videoWrap.append(video, videoStatus);
    section.append(copy, videoWrap);
    return section;
  }

  function openReport() {
    const reader = document.querySelector("[data-blog-reader]");
    if (!reader) return;

    const shell = el("div", "container blog-reader-shell blog-fliver-report");
    const close = el("button", "blog-reader-close", "← Voltar ao blog");
    close.type = "button";
    close.addEventListener("click", () => {
      reader.hidden = true;
      reader.replaceChildren();
      document.querySelector(".blog-masthead")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    const header = el("header", "blog-reader-header");
    const eyebrow = el("div", "blog-full-post__eyebrow");
    eyebrow.append(
      el("span", "blog-full-post__category", POST.categoria),
      el("span", "", POST.dataTexto)
    );
    header.append(eyebrow, el("h2", "", POST.titulo), el("p", "blog-reader-subtitle", POST.subtitulo));

    const meta = el("div", "blog-full-post__meta");
    meta.append(el("span", "", POST.autor), el("span", "", POST.tempoLeitura));
    header.appendChild(meta);

    const cover = el("figure", "blog-reader-cover blog-fliver-cover");
    cover.append(
      makeImage(POST.imagem, "Cartaz principal da FLIVER, Feira Literária de Vera Cruz", true),
      el("figcaption", "", "FLIVER · Festival Escolar Literário de Vera Cruz")
    );

    const body = el("article", "blog-article__body blog-fliver-body");
    body.append(
      paragraph("Se você passou por uma escola de Vera Cruz durante a FLIVER, encontrou muito mais do que livros sobre mesas. A leitura tomou conta dos espaços, ganhou voz, imagem, música, teatro e conversa. Com o tema “Entre sol, mar e areia: palavras que contam nossa ancestralidade”, a feira reuniu as escolas do município em uma mesma celebração da literatura, da cultura e da identidade."),
      paragraph("A FLIVER aconteceu simultaneamente nas escolas de Vera Cruz. Cada unidade criou sua própria programação e encontrou maneiras diferentes de aproximar os estudantes das histórias do território. Nesta reportagem, você acompanha principalmente registros do Colégio Luís Eduardo Magalhães, na Gamboa, e também pode assistir a um momento vivido no Colégio Municipal Geralda Maria da Conceição."),
      figure("assets/img/blog/fliver/fliver-programacao.jpeg", "No Colégio Luís Eduardo Magalhães, a programação reuniu dramatização, exposição de fotografias, palestra, geladeira literária, árvore literária, podcast, cordel, xilogravura, documentário e releituras de livros e revistas em quadrinhos."),
      sectionTitle("Uma feira que aconteceu ao mesmo tempo em diferentes comunidades"),
      paragraph("A proposta era comum, mas a experiência não precisava ser igual. Em cada escola, professores e estudantes deram forma à FLIVER a partir de suas produções, convidados e vivências. Foi justamente aí que a feira ganhou força: a literatura apareceu ligada ao lugar, às pessoas e às memórias que fazem parte da vida de cada comunidade."),
      galleryBlock(gallery.slice(0, 5)),
      videoBlock(),
      sectionTitle("Quando os escritores estão perto, a literatura muda de endereço"),
      paragraph("Na Gamboa, um dos espaços que mais chamou atenção foi a Tenda dos Escritores de Vera Cruz. Ali, os livros deixaram de ser apenas nomes em uma estante. Os estudantes puderam enxergar autores ligados ao próprio município e perceber que escrever também é uma forma de guardar experiências, fazer perguntas e contar a ilha por outros caminhos."),
      paragraph("Talvez essa seja uma das imagens mais bonitas deixadas pela FLIVER: a de estudantes diante de obras que falam de pessoas, lugares e histórias próximas. Quando isso acontece, a literatura deixa de parecer algo distante e passa a conversar diretamente com quem lê."),
      galleryBlock(gallery.slice(5, 8)),
      sectionTitle("Os estudantes não ficaram apenas na plateia"),
      paragraph("Dramatizações, fotografias, releituras, documentário, podcast e oficinas colocaram os alunos no centro da programação. Eles leram, apresentaram, observaram, produziram e compartilharam. A feira mostrou que a leitura pode começar em um livro, mas não precisa terminar nele."),
      paragraph("Ao transformar o conteúdo em voz, cena, imagem e criação, os estudantes também passaram a contar suas próprias versões das histórias que estudam. E é nesse movimento que a escola deixa de ser apenas lugar de receber conhecimento e se torna lugar de produzir memória."),
      galleryBlock(gallery.slice(8, 10)),
      sectionTitle("Entre sol, mar e areia, de quem são as histórias que contamos?"),
      paragraph("O tema da ancestralidade convidou cada escola a olhar para Vera Cruz não apenas como cenário, mas como fonte de histórias. O mar, as comunidades, os modos de viver, os saberes, as lembranças e as pessoas que construíram o município entraram na conversa com a literatura."),
      paragraph("A FLIVER terminou, mas a pergunta continua aberta para quem participou e para quem chega agora a esta reportagem: quais histórias de Vera Cruz ainda precisam ser lidas, registradas e compartilhadas? Talvez a próxima página comece justamente com uma lembrança da sua comunidade."),
      galleryBlock(gallery.slice(10))
    );

    const tags = el("div", "blog-article__tags");
    ["FLIVER", "Educação", "Literatura", "Cultura", "Vera Cruz", "Ancestralidade", "Protagonismo estudantil"].forEach((tag) => tags.appendChild(el("span", "", tag)));
    body.appendChild(tags);

    const comments = el("section", "blog-featured-comments");
    comments.dataset.blogComments = "";
    comments.dataset.postSlug = POST.slug;

    shell.append(close, header, cover, body, comments);
    reader.replaceChildren(shell);
    reader.hidden = false;
    reader.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function boot() {
    renderFeatured();
    window.setTimeout(renderFeatured, 40);
    window.setTimeout(renderFeatured, 220);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
