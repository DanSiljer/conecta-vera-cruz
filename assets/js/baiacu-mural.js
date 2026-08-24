(function () {
  "use strict";

  const firebaseConfig = {
    apiKey: "AIzaSyBcsIZO9G_h7mTtWt-sBb6MFDC9_chpzMk",
    authDomain: "conecta-vera-cruz.firebaseapp.com",
    projectId: "conecta-vera-cruz",
    storageBucket: "conecta-vera-cruz.firebasestorage.app",
    messagingSenderId: "918702884700",
    appId: "1:918702884700:web:01b59897dd18f3ff65a399"
  };

  const CONFIGURACAO = {
    site: "Conecta Vera Cruz",
    localidade: "Baiacu",
    colecao: "memorias",
    maximoCaracteres: 500,
    minimoCaracteres: 10,
    intervaloEntreEnvios: 60000
  };

  const root = document.getElementById("mural-baiacu");
  if (!root) return;

  const nomeInput = document.getElementById("vc-mural-nome");
  const mensagemInput = document.getElementById("vc-mural-mensagem");
  const enviarButton = document.getElementById("vc-mural-enviar");
  const lista = document.getElementById("vc-mural-lista");
  const contador = document.getElementById("vc-mural-contador");
  const totalPublicacoes = document.getElementById("vc-mural-total");
  const aviso = document.getElementById("vc-mural-aviso");
  const status = document.getElementById("vc-mural-status");

  const LIKES_KEY = "conecta-vera-cruz-curtidas-baiacu-v1";
  const ULTIMO_ENVIO_KEY = "conecta-vera-cruz-ultimo-envio-baiacu-v1";

  let db = null;
  let firebasePronto = false;
  let publicacoes = [];
  let publicacoesCurtidas = carregarCurtidasLocais();

  function mostrarStatus(mensagem, tipo) {
    status.textContent = mensagem;
    status.className = "vc-send-status is-visible " + (tipo || "info");
  }

  function ocultarStatus() {
    status.textContent = "";
    status.className = "vc-send-status";
  }

  function mensagemDoErro(erro, contexto) {
    const codigo = erro && erro.code ? String(erro.code) : "erro-desconhecido";
    const detalhe = erro && erro.message ? String(erro.message) : "Sem detalhes.";

    if (codigo.includes("permission-denied")) {
      return "O Firestore recusou o acesso. Publique as regras fornecidas no pacote. Código: " + codigo;
    }

    if (codigo.includes("unavailable")) {
      return "O Firebase está temporariamente indisponível ou foi bloqueado pelo navegador.";
    }

    return contexto + " Código: " + codigo + ". " + detalhe;
  }

  function carregarCurtidasLocais() {
    try {
      const dados = JSON.parse(localStorage.getItem(LIKES_KEY) || "[]");
      return Array.isArray(dados) ? dados : [];
    } catch (erro) {
      return [];
    }
  }

  function salvarCurtidasLocais() {
    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(publicacoesCurtidas));
    } catch (erro) {
      console.warn("Não foi possível salvar as curtidas locais.", erro);
    }
  }

  function limparEspacos(texto) {
    return String(texto || "").replace(/\s+/g, " ").trim();
  }

  function gerarIniciais(nome) {
    const nomeFormatado = limparEspacos(nome);

    if (!nomeFormatado || nomeFormatado === "Visitante") {
      return "VC";
    }

    const partes = nomeFormatado.split(" ");

    if (partes.length === 1) {
      return partes[0].slice(0, 2).toUpperCase();
    }

    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }

  function formatarData(valor) {
    let data = null;

    if (valor && typeof valor.toDate === "function") {
      data = valor.toDate();
    } else if (valor) {
      data = new Date(valor);
    }

    if (!data || Number.isNaN(data.getTime())) {
      return "Agora";
    }

    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function atualizarFormulario() {
    const tamanho = mensagemInput.value.length;
    const possuiMensagem =
      mensagemInput.value.trim().length >= CONFIGURACAO.minimoCaracteres;

    contador.textContent = tamanho + " de " + CONFIGURACAO.maximoCaracteres;
    enviarButton.disabled = !firebasePronto || !possuiMensagem;

    aviso.textContent =
      tamanho > 0 && tamanho < CONFIGURACAO.minimoCaracteres
        ? "Escreva pelo menos " + CONFIGURACAO.minimoCaracteres + " caracteres."
        : "";
  }

  function atualizarTotal() {
    const quantidade = publicacoes.length;
    totalPublicacoes.textContent =
      quantidade === 1 ? "1 publicação" : quantidade + " publicações";
  }

  function criarEstadoVazio() {
    const vazio = document.createElement("div");
    vazio.className = "vc-empty-state";

    const titulo = document.createElement("strong");
    titulo.textContent = "O mural ainda está vazio";

    const texto = document.createElement("span");
    texto.textContent =
      "Compartilhe a primeira história ou curiosidade sobre Baiacu.";

    vazio.appendChild(titulo);
    vazio.appendChild(texto);
    return vazio;
  }

  function criarEstadoCarregando() {
    const carregando = document.createElement("div");
    carregando.className = "vc-empty-state";
    carregando.textContent = "Conectando ao Firebase e carregando as memórias...";
    return carregando;
  }

  function criarEstadoErro(mensagem) {
    const bloco = document.createElement("div");
    bloco.className = "vc-empty-state";
    bloco.textContent = mensagem;
    return bloco;
  }

  async function alternarCurtida(publicacao, button) {
    const foiCurtida = publicacoesCurtidas.includes(publicacao.id);
    const referencia = db.collection(CONFIGURACAO.colecao).doc(publicacao.id);
    button.disabled = true;

    try {
      await db.runTransaction(async function (transacao) {
        const snapshot = await transacao.get(referencia);

        if (!snapshot.exists) {
          throw new Error("Publicação não encontrada.");
        }

        const dados = snapshot.data();
        const curtidasAtuais = Math.max(0, Number(dados.curtidas || 0));
        const proximaQuantidade = foiCurtida
          ? Math.max(0, curtidasAtuais - 1)
          : curtidasAtuais + 1;

        transacao.update(referencia, { curtidas: proximaQuantidade });
      });

      if (foiCurtida) {
        publicacoesCurtidas = publicacoesCurtidas.filter(function (id) {
          return id !== publicacao.id;
        });
      } else {
        publicacoesCurtidas.push(publicacao.id);
      }

      salvarCurtidasLocais();
    } catch (erro) {
      console.error("Erro ao registrar curtida:", erro);
      mostrarStatus(
        mensagemDoErro(erro, "Não foi possível registrar a curtida."),
        "erro"
      );
      button.disabled = false;
    }
  }

  function criarBotaoCurtir(publicacao) {
    const button = document.createElement("button");
    const foiCurtida = publicacoesCurtidas.includes(publicacao.id);
    const quantidade = Math.max(0, Number(publicacao.curtidas || 0));

    button.type = "button";
    button.className = "vc-like-button" + (foiCurtida ? " is-liked" : "");
    button.textContent =
      (foiCurtida ? "♥ " : "♡ ") +
      "Curtir" +
      (quantidade > 0 ? " · " + quantidade : "");

    button.addEventListener("click", async function () {
      await alternarCurtida(publicacao, button);
    });

    return button;
  }

  function criarItem(publicacao) {
    const item = document.createElement("article");
    item.className = "vc-mural-item";

    const cabecalho = document.createElement("div");
    cabecalho.className = "vc-item-header";

    const avatar = document.createElement("div");
    avatar.className = "vc-avatar";
    avatar.textContent = gerarIniciais(publicacao.nome);
    avatar.setAttribute("aria-hidden", "true");

    const autorInfo = document.createElement("div");

    const nome = document.createElement("p");
    nome.className = "vc-item-name";
    nome.textContent = publicacao.nome || "Visitante";

    const data = document.createElement("p");
    data.className = "vc-item-date";
    data.textContent = formatarData(publicacao.createdAt);

    autorInfo.appendChild(nome);
    autorInfo.appendChild(data);
    cabecalho.appendChild(avatar);
    cabecalho.appendChild(autorInfo);

    const texto = document.createElement("p");
    texto.className = "vc-item-text";
    texto.textContent = publicacao.texto || "";

    const rodape = document.createElement("div");
    rodape.className = "vc-item-footer";

    const botaoCurtir = criarBotaoCurtir(publicacao);
    const localidade = document.createElement("span");
    localidade.className = "vc-location-tag";
    localidade.textContent = "Baiacu · Conecta Vera Cruz";

    rodape.appendChild(botaoCurtir);
    rodape.appendChild(localidade);
    item.appendChild(cabecalho);
    item.appendChild(texto);
    item.appendChild(rodape);

    return item;
  }

  function renderizarPublicacoes() {
    lista.replaceChildren();
    atualizarTotal();

    if (publicacoes.length === 0) {
      lista.appendChild(criarEstadoVazio());
      return;
    }

    publicacoes.forEach(function (publicacao) {
      lista.appendChild(criarItem(publicacao));
    });
  }

  function envioMuitoRapido() {
    try {
      const ultimoEnvio = Number(localStorage.getItem(ULTIMO_ENVIO_KEY) || 0);
      return Date.now() - ultimoEnvio < CONFIGURACAO.intervaloEntreEnvios;
    } catch (erro) {
      return false;
    }
  }

  function registrarHorarioDoEnvio() {
    try {
      localStorage.setItem(ULTIMO_ENVIO_KEY, String(Date.now()));
    } catch (erro) {
      console.warn("Não foi possível registrar o intervalo de envio.", erro);
    }
  }

  async function publicarMensagem() {
    const nomeDigitado = limparEspacos(nomeInput.value);
    const nome = nomeDigitado.length >= 2 ? nomeDigitado : "Visitante";
    const texto = mensagemInput.value.trim();

    if (texto.length < CONFIGURACAO.minimoCaracteres) {
      aviso.textContent =
        "Escreva pelo menos " + CONFIGURACAO.minimoCaracteres + " caracteres.";
      mensagemInput.focus();
      return;
    }

    if (envioMuitoRapido()) {
      mostrarStatus(
        "Aguarde um minuto antes de enviar outra publicação.",
        "erro"
      );
      return;
    }

    enviarButton.disabled = true;
    enviarButton.innerHTML = '<span aria-hidden="true">✦</span> Publicando...';
    ocultarStatus();

    try {
      await db.collection(CONFIGURACAO.colecao).add({
        site: CONFIGURACAO.site,
        localidade: CONFIGURACAO.localidade,
        nome: nome.slice(0, 40),
        texto: texto.slice(0, CONFIGURACAO.maximoCaracteres),
        aprovado: true,
        curtidas: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      registrarHorarioDoEnvio();
      nomeInput.value = "";
      mensagemInput.value = "";
      atualizarFormulario();
      mostrarStatus(
        "Sua memória foi publicada no Conecta Vera Cruz!",
        "sucesso"
      );
    } catch (erro) {
      console.error("Erro ao publicar mensagem:", erro);
      mostrarStatus(
        mensagemDoErro(erro, "Não foi possível publicar a memória."),
        "erro"
      );
    } finally {
      enviarButton.innerHTML =
        '<span aria-hidden="true">✦</span> Publicar memória';
      atualizarFormulario();
    }
  }

  function acompanharPublicacoes() {
    lista.replaceChildren(criarEstadoCarregando());

    return db
      .collection(CONFIGURACAO.colecao)
      .where("aprovado", "==", true)
      .limit(100)
      .onSnapshot(
        function (resultado) {
          publicacoes = resultado.docs
            .map(function (documento) {
              return Object.assign({ id: documento.id }, documento.data());
            })
            .filter(function (publicacao) {
              return (
                publicacao.site === CONFIGURACAO.site &&
                publicacao.localidade === CONFIGURACAO.localidade
              );
            })
            .sort(function (a, b) {
              const dataA =
                a.createdAt && a.createdAt.seconds ? a.createdAt.seconds : 0;
              const dataB =
                b.createdAt && b.createdAt.seconds ? b.createdAt.seconds : 0;
              return dataB - dataA;
            });

          firebasePronto = true;
          ocultarStatus();
          atualizarFormulario();
          renderizarPublicacoes();
        },
        function (erro) {
          console.error("Erro ao carregar publicações:", erro);
          firebasePronto = false;
          atualizarFormulario();

          const mensagem = mensagemDoErro(
            erro,
            "Não foi possível carregar o mural."
          );

          lista.replaceChildren(criarEstadoErro(mensagem));
          totalPublicacoes.textContent = "Mural indisponível";
          mostrarStatus(mensagem, "erro");
        }
      );
  }

  function iniciarMural() {
    mostrarStatus("Conectando ao Firebase do Conecta Vera Cruz...", "info");
    lista.replaceChildren(criarEstadoCarregando());
    atualizarFormulario();

    try {
      if (!window.firebase || typeof window.firebase.initializeApp !== "function") {
        throw new Error(
          "As bibliotecas do Firebase não foram carregadas."
        );
      }

      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }

      db = firebase.firestore();
      acompanharPublicacoes();
    } catch (erro) {
      console.error("Erro ao iniciar Firebase:", erro);
      firebasePronto = false;
      atualizarFormulario();

      const mensagem = mensagemDoErro(
        erro,
        "Não foi possível iniciar o Firebase."
      );

      mostrarStatus(mensagem, "erro");
      lista.replaceChildren(criarEstadoErro(mensagem));
      totalPublicacoes.textContent = "Mural indisponível";
    }
  }

  mensagemInput.addEventListener("input", atualizarFormulario);
  enviarButton.addEventListener("click", publicarMensagem);

  mensagemInput.addEventListener("keydown", function (event) {
    if (
      event.key === "Enter" &&
      (event.ctrlKey || event.metaKey) &&
      !enviarButton.disabled
    ) {
      event.preventDefault();
      publicarMensagem();
    }
  });

  atualizarFormulario();
  iniciarMural();
})();
