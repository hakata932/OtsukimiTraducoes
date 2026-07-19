// Carrega o conteúdo editável do site (posts do blog, projetos e páginas),
// que vive em arquivos Markdown com frontmatter dentro de src/content/.
// Veja o COMO-EDITAR.md na raiz do repositório para o guia de edição.
//
// Regras pensadas para quem não programa:
// - Qualquer .md nas pastas vira post/projeto automaticamente.
// - Arquivos começando com "_" (ex.: _MODELO.md) são ignorados pelo site.
// - A data aceita tanto 2026-03-08 quanto 08/03/2026.
// - Sem "description"? O site usa o começo do texto.
// - Caminho de imagem sem "/" no início é corrigido sozinho.

import progressDatesJson from "@/generated/progress-dates.json";

const PROGRESS_DATES = progressDatesJson as Record<string, string | undefined>;

export interface Post {
  slug: string;
  title: string;
  date: string; // AAAA-MM-DD
  description: string;
  tags: string[];
  thumbnail?: string;
  author?: string;
  readingMinutes: number;
  body: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  cover?: string;
  status?: string;
  order: number;
  body: string;
  progressDate?: string; // DD/MM/AAAA, vinda do git (scripts/build-progress-dates.mjs)
}

export interface Page {
  slug: string;
  title: string;
  description: string;
  body: string;
}

type Frontmatter = Record<string, string>;

function parseFrontmatter(raw: string): { meta: Frontmatter; body: string } {
  const meta: Frontmatter = {};
  const normalized = raw.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { meta, body: normalized };

  for (const line of match[1].split("\n")) {
    const sep = line.indexOf(":");
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim();
    let value = line.slice(sep + 1).trim();
    if (key.startsWith("#") || !key) continue;
    value = value.replace(/^["']|["']$/g, "");
    if (value) meta[key] = value;
  }

  return { meta, body: normalized.slice(match[0].length) };
}

function parseTags(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[,\s]+/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

// Aceita "2026-03-08" e também "08/03/2026" (formato brasileiro).
function normalizeDate(value: string | undefined): string {
  if (!value) return "";
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const br = value.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (br) return `${br[3]}-${br[2]}-${br[1]}`;
  return "";
}

// Garante que caminhos de imagem funcionem mesmo sem a "/" inicial.
function normalizePath(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (/^(https?:)?\/\//.test(value) || value.startsWith("/")) return value;
  return `/${value.replace(/^\.?\//, "")}`;
}

// Sem description no frontmatter, usa o começo do texto (sem marcação).
function fallbackDescription(body: string): string {
  const plain = body
    .replace(/^#+\s.*$/gm, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>#|-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > 157 ? `${plain.slice(0, 157)}…` : plain;
}

function readingMinutes(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const postFiles = import.meta.glob("../content/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const projectFiles = import.meta.glob("../content/projetos/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const pageFiles = import.meta.glob("../content/paginas/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

function fileName(path: string): string {
  return path.split("/").pop()?.replace(/\.md$/, "") ?? path;
}

// Arquivos começando com "_" são modelos/rascunhos e não aparecem no site.
function isTemplate(path: string): boolean {
  return fileName(path).startsWith("_");
}

export function listPosts(): Post[] {
  const posts = Object.entries(postFiles)
    .filter(([path]) => !isTemplate(path))
    .map(([path, raw]) => {
      const { meta, body } = parseFrontmatter(raw);
      const name = fileName(path);
      const dateFromName = name.match(/^(\d{4}-\d{2}-\d{2})-/);
      const slug = dateFromName ? name.slice(11) : name;
      return {
        slug,
        title: meta.title ?? slug,
        date: normalizeDate(meta.date) || (dateFromName?.[1] ?? ""),
        description: meta.description ?? fallbackDescription(body),
        tags: parseTags(meta.tags),
        thumbnail: normalizePath(meta.thumbnail),
        author: meta.author,
        readingMinutes: readingMinutes(body),
        body,
      };
    });
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return listPosts().find((post) => post.slug === slug);
}

export function listProjects(): Project[] {
  const projects = Object.entries(projectFiles)
    .filter(([path]) => !isTemplate(path))
    .map(([path, raw]) => {
      const { meta, body } = parseFrontmatter(raw);
      const slug = meta.slug ?? fileName(path);
      return {
        slug,
        title: meta.title ?? slug,
        description: meta.description ?? fallbackDescription(body),
        cover: normalizePath(meta.cover),
        status: meta.status,
        order: Number(meta.order) || 99,
        body,
        progressDate: PROGRESS_DATES[slug] ?? meta.progressDate,
      };
    });
  return projects.sort((a, b) => a.order - b.order);
}

export function getProject(slug: string): Project | undefined {
  return listProjects().find((project) => project.slug === slug);
}

export async function getPage(slug: string): Promise<Page | undefined> {
  const entry = Object.entries(pageFiles).find(
    ([path]) => !isTemplate(path) && fileName(path) === slug
  );
  if (!entry) return undefined;
  const { meta, body } = parseFrontmatter(await entry[1]());
  return {
    slug,
    title: meta.title ?? slug,
    description: meta.description ?? fallbackDescription(body),
    body,
  };
}

// Injeta a linha "Última atualização de progresso em ..." no fim da seção
// "## Progresso" (antes do próximo "## " ou "---"). A data vem do commit que
// mexeu só nas tabelas — ninguém precisa atualizá-la à mão.
export function withProgressDate(markdown: string, date: string | undefined): string {
  if (!date) return markdown;
  const lines = markdown.split("\n");
  const start = lines.findIndex((line) => /^##\s+Progresso\b/i.test(line.trim()));
  if (start === -1) return markdown;

  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (/^##\s/.test(trimmed) || /^---+$/.test(trimmed)) {
      end = i;
      break;
    }
  }
  lines.splice(end, 0, "", `Última atualização de progresso em ${date}`);
  return lines.join("\n");
}

export function formatDate(date: string): string {
  if (!date) return "";
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
