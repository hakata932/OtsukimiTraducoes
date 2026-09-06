#!/usr/bin/env node
// Confere os arquivos de src/content/ ANTES do site ser gerado.
//
// Existe porque os erros mais comuns de edição são silenciosos: o build passa,
// o site sobe, e só depois alguém percebe que a data do post está errada ou que
// a imagem não carrega. Aqui o build para na hora, com o nome do arquivo e o
// que precisa ser corrigido.
//
// Regras conferidas:
//   - todo post/projeto/página precisa de "title";
//   - todo post precisa de uma "date" que exista de verdade no calendário;
//   - "progressDate" de projeto precisa estar em DD/MM/AAAA;
//   - toda imagem citada (thumbnail, cover e as do texto) precisa existir
//     dentro de public/.
//
// Arquivos que começam com "_" (modelos e rascunhos) são ignorados, igual ao site.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "src", "content");
const PUBLIC_DIR = path.join(ROOT, "public");

const problems = [];

function report(file, message, hint) {
  problems.push({ file, message, hint });
}

// Mesma leitura de frontmatter usada pelo site (src/lib/content.ts).
function parseFrontmatter(raw) {
  const meta = {};
  const normalized = raw.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { meta, body: normalized, hasFrontmatter: false };

  for (const line of match[1].split("\n")) {
    const sep = line.indexOf(":");
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim();
    let value = line.slice(sep + 1).trim();
    if (key.startsWith("#") || !key) continue;
    value = value.replace(/^["']|["']$/g, "");
    if (value) meta[key] = value;
  }

  return { meta, body: normalized.slice(match[0].length), hasFrontmatter: true };
}

function isRealDate(year, month, day) {
  if (month < 1 || month > 12 || day < 1) return false;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return day <= daysInMonth;
}

// Confere "date" de post. Aceita 2026-08-22 e 22/08/2026, igual ao site.
function checkPostDate(file, value) {
  if (!value) {
    report(file, 'está sem a linha "date:".', "Escreva a data assim: date: 2026-08-22");
    return;
  }

  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    const [, y, m, d] = iso.map(Number);
    if (!isRealDate(y, m, d)) {
      report(file, `tem a data "${value}", que não existe no calendário.`, "Confira o dia e o mês.");
    }
    return;
  }

  const br = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (br) {
    const day = Number(br[1]);
    const month = Number(br[2]);
    const year = Number(br[3]);
    if (!isRealDate(year, month, day)) {
      // Erro clássico: escreveram no formato americano MM/DD/AAAA.
      const parecAmericano = month > 12 && day >= 1 && day <= 12;
      const sugestao = parecAmericano
        ? `Isso parece o formato americano (mês/dia/ano). Se você quis dizer ${String(month).padStart(2, "0")} de ${["", "janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"][day]} de ${year}, escreva: date: ${year}-${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}`
        : "No formato brasileiro a ordem é dia/mês/ano.";
      report(file, `tem a data "${value}", que não existe no calendário.`, sugestao);
    }
    return;
  }

  report(
    file,
    `tem a data "${value}", que não está num formato que o site entenda.`,
    "Use 2026-08-22 (ano-mês-dia) ou 22/08/2026 (dia/mês/ano)."
  );
}

function checkProgressDate(file, value) {
  if (!value) return;
  const br = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!br || !isRealDate(Number(br[3]), Number(br[2]), Number(br[1]))) {
    report(
      file,
      `tem "progressDate: ${value}", que não é uma data válida.`,
      "O progressDate usa sempre dia/mês/ano, assim: progressDate: 31/08/2026"
    );
  }
}

// Caminho de imagem do jeito que o site resolve: tudo vira caminho a partir de public/.
function checkImage(file, rawPath, origem) {
  if (!rawPath) return;
  if (/^(https?:)?\/\//.test(rawPath) || rawPath.startsWith("data:")) return;

  const publicPath = rawPath.startsWith("/") ? rawPath : `/${rawPath.replace(/^\.?\//, "")}`;
  const onDisk = path.join(PUBLIC_DIR, decodeURIComponent(publicPath).replace(/^\//, ""));
  if (!fs.existsSync(onDisk)) {
    report(
      file,
      `aponta para a imagem "${rawPath}" (${origem}), que não existe.`,
      `Coloque o arquivo em public${publicPath} — confira também maiúsculas e a extensão (.png, .jpg, .gif).`
    );
  }
}

function checkBodyImages(file, body) {
  for (const match of body.matchAll(/!\[[^\]]*\]\(\s*([^)\s]+)/g)) {
    checkImage(file, match[1], "imagem no texto");
  }
}

function readContentFiles(folder) {
  const dir = path.join(CONTENT_DIR, folder);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".md") && !name.startsWith("_"))
    .sort()
    .map((name) => ({
      rel: `src/content/${folder}/${name}`,
      ...parseFrontmatter(fs.readFileSync(path.join(dir, name), "utf8")),
    }));
}

for (const post of readContentFiles("posts")) {
  if (!post.hasFrontmatter) {
    report(post.rel, "não tem o bloco de informações no topo.", 'O arquivo precisa começar com uma linha "---".');
    continue;
  }
  if (!post.meta.title) report(post.rel, 'está sem a linha "title:".', "Sem título o site mostra o nome do arquivo.");
  checkPostDate(post.rel, post.meta.date);
  checkImage(post.rel, post.meta.thumbnail, "thumbnail");
  checkBodyImages(post.rel, post.body);
}

for (const projeto of readContentFiles("projetos")) {
  if (!projeto.hasFrontmatter) {
    report(projeto.rel, "não tem o bloco de informações no topo.", 'O arquivo precisa começar com uma linha "---".');
    continue;
  }
  if (!projeto.meta.title) report(projeto.rel, 'está sem a linha "title:".', "Sem título o site mostra o nome do arquivo.");
  checkProgressDate(projeto.rel, projeto.meta.progressDate);
  checkImage(projeto.rel, projeto.meta.cover, "cover");
  checkBodyImages(projeto.rel, projeto.body);
}

for (const pagina of readContentFiles("paginas")) {
  if (!pagina.hasFrontmatter) {
    report(pagina.rel, "não tem o bloco de informações no topo.", 'O arquivo precisa começar com uma linha "---".');
    continue;
  }
  if (!pagina.meta.title) report(pagina.rel, 'está sem a linha "title:".', "Sem título o site mostra o nome do arquivo.");
  checkBodyImages(pagina.rel, pagina.body);
}

if (problems.length === 0) {
  console.log("[check-content] conteúdo conferido, tudo certo.");
  process.exit(0);
}

console.error("");
console.error(`[check-content] ${problems.length} problema(s) no conteúdo — o site NÃO foi gerado:`);
console.error("");
for (const { file, message, hint } of problems) {
  console.error(`  ✗ ${file}`);
  console.error(`    ${message}`);
  if (hint) console.error(`    → ${hint}`);
  console.error("");
}
console.error("Corrija os pontos acima e envie de novo. Nada foi publicado.");
process.exit(1);
