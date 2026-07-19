# Otsukimi 🎑

Site do grupo **Otsukimi**, dedicado à tradução de White Album 2 e obras da Leaf para o português do Brasil.

> ✍️ **Vai atualizar o conteúdo do site (blog, progresso, páginas)?**
> Leia o **[COMO-EDITAR.md](./COMO-EDITAR.md)** — não precisa saber programar.

## Desenvolvimento

- Stack: React 19 + Vite 7 + TypeScript + Tailwind CSS 4
- Conteúdo em Markdown (`src/content/`), renderizado no cliente
- Deploy: Vercel (push na `main` publica automaticamente)

```bash
npm install   # instala as dependências
npm run dev   # roda em http://localhost:5173
npm run build # build de produção (com checagem de tipos)
```
