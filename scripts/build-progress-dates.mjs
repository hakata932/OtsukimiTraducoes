#!/usr/bin/env node
// Gera src/generated/progress-dates.json com a data da última atualização de
// progresso de cada projeto, com base no histórico do git.
//
// Regra: conta apenas commits cujas mudanças no .md do projeto foram
// EXCLUSIVAMENTE em linhas de tabela (linhas começando com "|") e que tenham
// pelo menos um "%". Commit que também mexeu em texto NÃO atualiza a data.
//
// Fallbacks, nesta ordem, quando o git não encontra um commit assim (repo raso
// na Vercel, arquivo recém-criado etc.):
//   1. valor que já estava no JSON gerado anteriormente (commitado no repo);
//   2. campo "progressDate" do frontmatter do próprio .md.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PROJECTS_DIR = path.join(ROOT, "src", "content", "projetos");
const OUT_FILE = path.join(ROOT, "src", "generated", "progress-dates.json");

function git(args) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" });
}

// Data no fuso de Brasília, no formato DD/MM/AAAA.
function formatBr(iso) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

function frontmatterField(raw, key) {
  const match = raw.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---/);
  if (!match) return undefined;
  const line = match[1].split("\n").find((l) => l.trim().startsWith(`${key}:`));
  if (!line) return undefined;
  const value = line
    .slice(line.indexOf(":") + 1)
    .trim()
    .replace(/^["']|["']$/g, "");
  return value || undefined;
}

// Data do commit mais recente que mexeu SÓ em tabelas de porcentagem do arquivo.
function progressDateFromGit(relFile) {
  const log = git(["log", "--no-merges", "--format=%H %cI", "--", relFile]).trim();
  if (!log) return undefined;

  for (const line of log.split("\n")) {
    const [sha, iso] = line.split(" ");
    const touchedFiles = git(["show", "--format=", "--name-only", "--pretty=format:", sha])
      .split("\n")
      .map((entry) => entry.trim())
      .filter(Boolean);
    if (touchedFiles.length !== 1 || touchedFiles[0] !== relFile) continue;

    const diff = git(["show", sha, "--format=", "--unified=0", "--", relFile]);
    const changed = diff
      .split("\n")
      .filter((l) => /^[+-]/.test(l) && !/^(\+\+\+|---)/.test(l))
      .map((l) => l.slice(1).replace(/\r$/, "").trim())
      .filter((l) => l !== "");

    if (changed.length === 0) continue;
    const onlyTables = changed.every((l) => l.startsWith("|"));
    const hasPercent = changed.some((l) => l.includes("%"));
    if (onlyTables && hasPercent) return formatBr(iso);
  }
  return undefined;
}

let previous = {};
try {
  previous = JSON.parse(fs.readFileSync(OUT_FILE, "utf8"));
} catch {
  // primeira execução: sem JSON anterior
}

const result = {};
for (const file of fs.readdirSync(PROJECTS_DIR).sort()) {
  if (!file.endsWith(".md") || file.startsWith("_")) continue;

  const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf8");
  const slug = frontmatterField(raw, "slug") ?? file.replace(/\.md$/, "");

  let fromGit;
  try {
    fromGit = progressDateFromGit(`src/content/projetos/${file}`);
  } catch (error) {
    console.warn(`[progress-dates] git indisponível para ${file}: ${error.message}`);
  }

  const date = fromGit ?? previous[slug] ?? frontmatterField(raw, "progressDate");
  if (date) result[slug] = date;
}

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, `${JSON.stringify(result, null, 2)}\n`);
console.log(`[progress-dates] gerado: ${JSON.stringify(result)}`);
