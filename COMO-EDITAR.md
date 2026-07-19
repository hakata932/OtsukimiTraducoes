# 🎑 Como editar o site da Otsukimi

Este guia é para quem vai atualizar o site **sem precisar entender de programação**.
Todo o conteúdo fica em arquivos de texto simples (Markdown, `.md`). Você edita o arquivo, salva, e o site se atualiza sozinho.

## Como funciona a atualização

1. Edite um arquivo (pode ser direto pelo site do GitHub, veja abaixo).
2. Salve (no GitHub isso se chama *commit*).
3. Pronto! A Vercel percebe a mudança e publica o site novo em 1–2 minutos.

### Editando direto pelo navegador (jeito mais fácil)

1. Abra o repositório no GitHub: `https://github.com/ThiagoKrz/OtsukimiTraducoes`
2. Navegue até o arquivo que quer mudar (veja o mapa abaixo).
3. Clique no ícone de **lápis** (✏️ "Edit this file") no canto direito.
4. Faça a mudança, desça a página e clique em **"Commit changes"**.

> ⚠️ Você precisa de uma conta no GitHub com permissão no repositório. Peça ao responsável para te adicionar como colaborador.

## 🗺️ Mapa: o que editar e onde

| O que você quer fazer | Arquivo |
| --- | --- |
| Atualizar o **progresso** do WA2 | `src/content/projetos/whitealbum2.md` |
| Escrever um **post no blog** | criar arquivo em `src/content/posts/` |
| Mudar a página **Quem somos?** | `src/content/paginas/quem-somos.md` |
| Mudar o **FAQ** | `src/content/paginas/faq.md` |
| Adicionar um **projeto novo** | criar arquivo em `src/content/projetos/` |
| Mudar **links de Discord/YouTube/X** | `src/config/site.ts` |
| Adicionar **imagens** | pasta `public/images/` |

O resto (pastas `src/components`, `src/pages`, etc.) é o código do site — não precisa mexer.

## 📊 Atualizando o progresso da tradução

Abra `src/content/projetos/whitealbum2.md` e procure a seção `## Progresso`. As tabelas são assim:

```markdown
| Rota     | Comum | Koharu |
| -------- | ----- | ------ |
| Tradução | 17,2% | 100%   |
| Revisão  | 4,6%  | 3,2%   |
```

- Só troque os números (pode usar vírgula: `87,1%`).
- O site transforma a tabela inteira em painéis com barrinhas de progresso automaticamente — cada coluna (rota) vira um painel, sem tabela larga na tela.
- **A data de "última atualização de progresso" é automática**: ela vem do commit. Regra importante — pra data atualizar, o commit precisa mexer **só nos números das tabelas**. Se você mudar tabela E texto no mesmo commit, a data não muda (faça em dois commits separados).

## ✍️ Criando um post no blog

**Jeito mais fácil:** dentro de `src/content/posts/` existe um arquivo chamado **`_MODELO.md`**. Copie ele, renomeie e preencha — as instruções estão dentro do próprio arquivo. (Arquivos que começam com `_` nunca aparecem no site, então o modelo pode ficar lá para sempre.)

Passo a passo:

1. Vá em `src/content/posts/` e crie um arquivo novo (no GitHub: botão **"Add file" → "Create new file"**).
2. O nome do arquivo deve começar com a data: `AAAA-MM-DD-titulo-curto.md`
   - Exemplo: `2026-08-15-patch-do-closing-chapter.md`
3. Cole este modelo e preencha:

```markdown
---
title: Título do post
date: 2026-08-15
description: Um resumo curto do post, que aparece na lista do blog e no Google.
tags: vn, anúncio
author: SeuNome
thumbnail: /images/blog/minha-imagem.png
---

Aqui começa o texto do post. Escreva normalmente.

## Um subtítulo

Mais texto. Para **negrito** use asteriscos duplos, para *itálico* use um asterisco.

![Descrição da imagem](/images/blog/outra-imagem.png)

*Legenda da imagem (opcional, em itálico)*

[Texto de um link](https://exemplo.com)
```

- `thumbnail`, `author` e até `description` são opcionais — pode apagar as linhas se não tiver (sem description, o site usa o começo do texto).
- A data pode ser escrita como `2026-08-15` **ou** `15/08/2026` — os dois funcionam.
- O post aparece automaticamente na lista do blog e na home, com data e tempo de leitura calculados sozinhos. **Todo arquivo `.md` na pasta vira um post** — não precisa registrar em lugar nenhum.

## 🖼️ Adicionando imagens

1. Coloque o arquivo de imagem em `public/images/blog/` (posts) ou `public/images/wa2/` (projeto).
   - No GitHub: **"Add file" → "Upload files"** dentro da pasta.
2. Use no texto assim: `![descrição](/images/blog/nome-do-arquivo.png)`
   - O caminho começa com `/images/`, **sem** o `public`.
3. Se colocar várias imagens juntas (uma por linha, sem linha em branco entre elas), o site monta uma galeria automaticamente.

## 🎮 Adicionando um projeto novo

**Jeito mais fácil:** copie o arquivo **`_MODELO.md`** que está em `src/content/projetos/` — as instruções estão dentro dele.

Ou crie um arquivo em `src/content/projetos/`, por exemplo `whitealbum1.md`:

```markdown
---
title: White Album
slug: whitealbum1
description: Tradução em PT-BR (Português do Brasil)
cover: /images/wa1/capa.jpg
status: Em andamento
order: 2
---

> **Atenção**: Esse é um patch feito de fãs para fãs sem nenhum fim lucrativo.

## Sinopse

...

## Progresso

...
```

- `slug` vira o endereço da página: `/projetos/whitealbum1`
- `order` define a ordem na home e no menu (menor aparece primeiro).
- O projeto entra **sozinho** no menu do topo e na lista da home. Não precisa mexer em mais nada!

## 🔗 Mudando links sociais, nome ou tagline

Abra `src/config/site.ts`. É um arquivo pequeno e autoexplicativo:

```ts
social: {
  discord: "",   // cole o link do servidor aqui quando existir
  youtube: "",   // idem, canal do YouTube
  twitter: "",   // idem, perfil no X/Twitter
},
```

Link vazio (`""`) = o ícone não aparece no site. É só colar o link quando o canal existir.

## 🆘 Deu errado?

- O site não atualizou? Espere 2 minutos e recarregue com `Ctrl+F5`.
- Ainda nada? Veja no painel da Vercel se o *deploy* falhou — geralmente é um erro de digitação no bloco entre `---` no topo do arquivo (o "frontmatter"). Confira se cada linha tem o formato `chave: valor`.
- Tabela quebrada? Confira se todas as linhas têm o mesmo número de barras verticais `|`.
- Na dúvida, chame quem cuida da parte técnica do grupo. 🎑
