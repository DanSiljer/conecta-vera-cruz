# Mural de memórias do Conecta Vera Cruz

A página `bairros.html` usa o SDK modular do Firebase e grava as mensagens na coleção `memorias` do Firestore.

## Arquivos usados

- `assets/js/firebase-config.js`: configuração e inicialização do Firebase.
- `assets/js/memorias.js`: envio, leitura em tempo real, filtro e curtidas.
- `firestore.rules`: regras recomendadas para a coleção `memorias`.

## Publicar as regras

1. Entre no Console do Firebase.
2. Abra o projeto `conecta-vera-cruz`.
3. Acesse **Firestore Database > Regras**.
4. Substitua o conteúdo pelas regras do arquivo `firestore.rules`.
5. Clique em **Publicar**.

## Testar no VS Code

Abra o projeto usando **Live Server**. Não abra o HTML apenas com duplo clique, pois os módulos JavaScript precisam ser executados por um servidor local.

## Campos gravados

Cada documento criado na coleção `memorias` contém:

- `site`: `Conecta Vera Cruz`
- `localidade`: comunidade escolhida
- `nome`: nome informado ou `Visitante`
- `texto`: história ou curiosidade
- `aprovado`: `true`
- `curtidas`: `0`
- `createdAt`: horário do servidor

As mensagens aprovadas aparecem automaticamente no mural da página Bairros.
