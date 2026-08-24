# Menu e rodapé padrão

O cabeçalho e o rodapé de todas as páginas agora são gerados por um único arquivo:

```text
assets/js/layout.js
```

O visual compartilhado fica em:

```text
assets/css/layout.css
```

## Como alterar o menu em todo o site

Abra `assets/js/layout.js` e edite a lista `links`:

```js
const links = [
  ["inicio", "Início", "index.html"],
  ["historia", "História de Vera Cruz", "historia.html"],
  ["bairros", "Bairros", "bairros.html"],
  ["pousadas", "Pousadas", "pousadas.html"],
  ["blog", "Blog", "blog.html"],
  ["nossa-historia", "Nossa História", "nossa-historia.html"]
];
```

Uma alteração nesse local aparece automaticamente em todas as páginas.

## Como alterar o rodapé

No mesmo arquivo `assets/js/layout.js`, procure pelo bloco:

```js
<footer class="cv-footer">
```

Edite textos, links ou comunidades somente nesse bloco.

## Como usar em novas páginas

No lugar do menu, coloque:

```html
<div data-cv-header></div>
```

No lugar do rodapé, coloque:

```html
<div data-cv-footer></div>
```

Inclua também o CSS e o JavaScript compartilhados. Para uma página na raiz:

```html
<link rel="stylesheet" href="assets/css/layout.css">
<script defer src="assets/js/layout.js"></script>
```

Para uma página dentro de `bairros/nome-da-comunidade/`:

```html
<link rel="stylesheet" href="../../assets/css/layout.css">
<script defer src="../../assets/js/layout.js"></script>
```

O script identifica automaticamente a página atual, destaca o item correto do menu e corrige os caminhos mesmo quando a página está em uma subpasta.
