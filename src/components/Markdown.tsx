import type { ReactNode } from "react";
import { isValidElement } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Element } from "hast";

function textOf(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(children)) return textOf(children.props.children);
  return "";
}

function onlyImages(children: ReactNode): boolean {
  const items = Array.isArray(children) ? children : [children];
  let images = 0;
  for (const item of items) {
    if (item == null) continue;
    if (typeof item === "string") {
      if (item.trim() !== "") return false;
      continue;
    }
    if (isValidElement(item) && item.type === "img") {
      images++;
      continue;
    }
    return false;
  }
  return images > 0;
}

function countImages(children: ReactNode): number {
  const items = Array.isArray(children) ? children : [children];
  return items.filter((item) => isValidElement(item) && item.type === "img").length;
}

const PERCENT = /^(\d+(?:[.,]\d+)?)\s*%$/;

function percentValue(text: string): number | null {
  const match = text.match(PERCENT);
  if (!match) return null;
  return Math.min(100, parseFloat(match[1].replace(",", ".")));
}

// Extrai o texto de um nó hast (a árvore que o react-markdown fornece via `node`).
function hastText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { type?: string; value?: string; children?: unknown[] };
  if (n.type === "text") return n.value ?? "";
  return (n.children ?? []).map(hastText).join("");
}

// Converte uma <table> hast em matriz de textos [linha][coluna].
function tableMatrix(node: Element): string[][] {
  const rows: string[][] = [];
  const visit = (n: Element) => {
    for (const child of n.children ?? []) {
      if (child.type !== "element") continue;
      if (child.tagName === "tr") {
        rows.push(
          child.children
            .filter((c): c is Element => c.type === "element" && (c.tagName === "th" || c.tagName === "td"))
            .map((c) => hastText(c).trim())
        );
      } else if (["thead", "tbody", "tfoot"].includes(child.tagName)) {
        visit(child);
      }
    }
  };
  visit(node);
  return rows;
}

// Tabela "de progresso": todas as células de dados são percentuais (ou vazias).
function isProgressMatrix(rows: string[][]): boolean {
  if (rows.length < 2 || (rows[0]?.length ?? 0) < 2) return false;
  let percents = 0;
  for (let i = 1; i < rows.length; i++) {
    for (let j = 1; j < rows[i].length; j++) {
      const cell = rows[i][j];
      if (!cell) continue;
      if (!PERCENT.test(cell)) return false;
      percents++;
    }
  }
  return percents > 0;
}

// Tabelas de progresso viram painéis por rota (sem scroll lateral em tela nenhuma).
function ProgressPanels({ rows }: { rows: string[][] }) {
  const header = rows[0];
  const dataRows = rows.slice(1);
  return (
    <div className="my-6 grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(13rem,1fr))]">
      {header.slice(1).map((route, j) => (
        <div key={j} className="rounded-lg border border-line bg-surface p-4">
          <p className="font-serif font-semibold">{route}</p>
          <div className="mt-3 space-y-3">
            {dataRows.map((row, i) => {
              const text = row[j + 1] ?? "";
              const value = percentValue(text) ?? 0;
              return (
                <div key={i}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs text-mist">{row[0]}</span>
                    <span className="text-xs tabular-nums text-mist">{text || "—"}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line">
                    <div
                      className={`h-full rounded-full ${value >= 100 ? "bg-accent" : "bg-accent/70"}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mt-10 mb-4 font-serif text-3xl font-bold tracking-tight">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-12 mb-4 border-b border-line pb-2 font-serif text-2xl font-semibold tracking-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-3 font-serif text-xl font-semibold">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-7 mb-2 font-serif font-semibold text-accent">{children}</h4>
  ),
  h5: ({ children }) => (
    <h5 className="mt-6 mb-2 text-sm font-bold uppercase tracking-widest text-mist">{children}</h5>
  ),
  p: ({ children }) => {
    if (onlyImages(children)) {
      const grid =
        countImages(children) > 1 ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "flex justify-center";
      return <div className={`my-6 ${grid}`}>{children}</div>;
    }
    return <p className="my-4 leading-7">{children}</p>;
  },
  a: ({ href = "", children }) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="font-medium text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
      >
        {children}
      </a>
    );
  },
  img: ({ src = "", alt = "" }) => (
    <img
      src={typeof src === "string" ? src : ""}
      alt={alt}
      loading="lazy"
      className="max-h-[32rem] w-full rounded-md border border-line object-contain"
    />
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 rounded-r-md border-l-2 border-accent bg-surface-2 px-5 py-3 text-mist [&_p]:my-2">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => <ul className="my-4 list-disc space-y-1.5 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 list-decimal space-y-1.5 pl-6">{children}</ol>,
  li: ({ children }) => <li className="leading-7">{children}</li>,
  hr: () => <hr className="my-10 border-line" />,
  em: ({ children }) => <em className="text-mist">{children}</em>,
  code: ({ children }) => (
    <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.9em]">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="my-6 overflow-x-auto rounded-md border border-line bg-surface-2 p-4 text-sm">
      {children}
    </pre>
  ),
  table: ({ node, children }) => {
    const rows = node ? tableMatrix(node) : [];
    if (isProgressMatrix(rows)) return <ProgressPanels rows={rows} />;
    return (
      <div className="my-6 overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-sm">{children}</table>
      </div>
    );
  },
  th: ({ children }) => (
    <th className="bg-surface-2 px-3 py-2.5 text-left font-semibold whitespace-nowrap">{children}</th>
  ),
  td: ({ children }) => {
    const text = textOf(children).trim();
    const match = text.match(PERCENT);
    if (match) {
      const value = Math.min(100, parseFloat(match[1].replace(",", ".")));
      return (
        <td className="border-t border-line px-3 py-2.5">
          <div className="flex min-w-20 items-center gap-1.5">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
              <div
                className={`h-full rounded-full ${value >= 100 ? "bg-accent" : "bg-accent/70"}`}
                style={{ width: `${value}%` }}
              />
            </div>
            <span className="shrink-0 text-right text-xs tabular-nums text-mist">{text}</span>
          </div>
        </td>
      );
    }
    return <td className="border-t border-line px-3 py-2.5">{children}</td>;
  },
};

export function Markdown({ children }: { children: string }) {
  return (
    <div className="text-[0.975rem] text-ink/95">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
