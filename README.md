# Conecta Vera Cruz

Site estático multipágina feito com HTML, CSS e JavaScript. Não precisa instalar Node.js, React ou banco de dados para funcionar.

## 1. Estrutura

```text
conecta-vera-cruz/
├── index.html
├── historia.html
├── bairros.html
├── pousadas.html
├── blog.html
├── nossa-historia.html
├── 404.html
├── assets/
│   ├── css/
│   │   ├── global.css
│   │   ├── pages/
│   │   ├── comunidades/
│   │   ├── artigos/
│   │   └── templates/
│   ├── js/main.js
│   └── img/
├── bairros/
│   ├── jiribatuba/index.html
│   ├── cacha-pregos/index.html
│   ├── gamboa/index.html
│   ├── baiacu/index.html
│   ├── mar-grande/index.html
│   ├── matarandiba/index.html
│   ├── catu/index.html
│   └── penha/index.html
├── blog/
│   ├── mariscagem-pinauna/index.html
│   ├── forno-da-penha/index.html
│   └── historia-vera-cruz/index.html
└── docs/referencia-visual.png
```

## 2. Abrir no VS Code

1. Extraia o arquivo ZIP.
2. Abra o VS Code.
3. Clique em **Arquivo > Abrir Pasta**.
4. Escolha a pasta `conecta-vera-cruz`.
5. Abra `index.html`.

## 3. Visualizar no computador

### Opção recomendada: extensão Live Server

1. Abra a aba **Extensões** do VS Code.
2. Pesquise `Live Server`.
3. Instale a extensão publicada por Ritwick Dey.
4. Clique com o botão direito em `index.html`.
5. Escolha **Open with Live Server**.

O site abrirá em um endereço local parecido com `http://127.0.0.1:5500`.

### Sem extensão

Você também pode dar dois cliques em `index.html`, mas um servidor local evita problemas com caminhos e atualização de arquivos.

## 4. Trocar textos

Abra a página desejada e edite o conteúdo entre as tags HTML.

Exemplo:

```html
<h1>Gamboa</h1>
<p>Seu novo texto aqui.</p>
```

## 5. Trocar imagens

As imagens atuais são ilustrações SVG para o projeto funcionar sem depender de sites externos.

Para usar fotos reais:

1. Coloque as fotos em `assets/img`.
2. Prefira nomes simples, sem espaços, como `gamboa.jpg`.
3. Na página, troque:

```html
<img src="../../assets/img/gamboa.svg" alt="Ilustração de Gamboa">
```

por:

```html
<img src="../../assets/img/gamboa.jpg" alt="Praia da Gamboa, Vera Cruz, Bahia">
```

Use fotografias autorizadas e mantenha os créditos.

## 6. Criar uma nova comunidade

1. Duplique a pasta de uma comunidade, por exemplo `bairros/catu`.
2. Renomeie a cópia, por exemplo `bairros/tairu`.
3. Edite o arquivo `bairros/tairu/index.html`.
4. Abra `bairros.html` e copie um cartão.
5. Troque o link para `bairros/tairu/`.
6. Crie `assets/css/comunidades/tairu.css` para o estilo exclusivo da nova página.
7. No novo HTML, carregue `global.css` e `comunidades/tairu.css`.
8. Repita o cartão em `index.html` caso queira mostrar a comunidade também na página inicial.

## 7. Alterar o menu

O menu está repetido em cada arquivo HTML. Procure por:

```html
<nav id="menu-principal" class="main-nav">
```

Ao adicionar uma página nova, inclua o link nos arquivos principais e nas páginas internas.

## 8. Publicar no GitHub Pages

1. Crie uma conta no GitHub.
2. Crie um repositório chamado `conecta-vera-cruz`.
3. No VS Code, abra o terminal em **Terminal > Novo Terminal**.
4. Execute:

```bash
git init
git add .
git commit -m "Primeira versão do Conecta Vera Cruz"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/conecta-vera-cruz.git
git push -u origin main
```

5. No GitHub, abra o repositório.
6. Entre em **Settings > Pages**.
7. Em **Build and deployment**, escolha **Deploy from a branch**.
8. Selecione a branch `main` e a pasta `/root`.
9. Salve.

O endereço normalmente será:

```text
https://SEU-USUARIO.github.io/conecta-vera-cruz/
```

## 9. Publicar rapidamente no Netlify

1. Entre no Netlify.
2. Abra a área de implantação manual.
3. Arraste a pasta `conecta-vera-cruz` ou o arquivo ZIP.
4. Aguarde a geração do endereço público.

Como o projeto é estático, não existe comando de build nem pasta de saída. O arquivo `index.html` já está na raiz.

## 10. Domínio próprio

Depois da publicação, conecte o domínio na plataforma escolhida. Atualize também o endereço dentro de `sitemap.xml`, trocando `https://SEU-DOMINIO/` pelo domínio real.

## 11. Antes de colocar no ar

- Troque o e-mail `contato@conectaveracruz.com.br` pelo contato oficial.
- Substitua as ilustrações pelas fotos autorizadas.
- Revise nomes, datas e informações históricas.
- Acrescente fontes e créditos.
- Teste todos os links no celular.
- Comprima fotos grandes para o site carregar rápido.

## 12. Organização da nova página inicial

A página `index.html` foi reconstruída seguindo o modelo visual do projeto. Ela possui:

- menu fixo e responsivo;
- banner principal do Conecta Vera Cruz;
- apresentação do projeto com fotografia de boas-vindas;
- chamada para as belezas naturais;
- três destaques do blog;
- seção Nossa História;
- mural demonstrativo de memórias;
- atalhos para bairros e comunidades;
- rodapé com links principais.

Os estilos específicos da página inicial estão em `assets/css/pages/inicio.css`.

## 13. Como funciona o mural de memórias

O formulário da página inicial usa `localStorage`, recurso do próprio navegador. Isso significa que as publicações ficam visíveis apenas no computador ou celular em que foram criadas.

Esse modo é ideal para testar o desenho e o funcionamento da seção sem configurar banco de dados. Para que as mensagens sejam compartilhadas entre todos os visitantes, será necessário conectar o formulário ao Firebase ou a outro serviço de banco de dados e criar regras de segurança e moderação.

A lógica atual está no final de:

```text
assets/js/main.js
```

## 14. Imagens principais da página inicial

```text
assets/img/banner-conecta-vera-cruz.webp
assets/img/logo-conecta-vera-cruz.webp
assets/img/boas-vindas-vera-cruz.webp
```

Essas imagens já foram otimizadas em formato WebP para reduzir o tempo de carregamento.

## Organização dos estilos

O site usa um arquivo global apenas para cabeçalho, rodapé, botões e regras gerais:

```text
assets/css/global.css
```

Cada página principal possui seu próprio CSS:

```text
assets/css/pages/inicio.css
assets/css/pages/historia.css
assets/css/pages/bairros.css
assets/css/pages/pousadas.css
assets/css/pages/blog.css
assets/css/pages/nossa-historia.css
assets/css/pages/erro-404.css
```

Cada comunidade também possui um arquivo independente dentro de `assets/css/comunidades/`. Os arquivos podem alterar cores, posição da imagem de capa e detalhes visuais sem modificar as demais comunidades.

As reportagens do blog possuem arquivos próprios dentro de `assets/css/artigos/`.
