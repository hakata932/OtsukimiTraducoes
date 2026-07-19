import { useEffect, useState } from "react";
import { Markdown } from "@/components/Markdown";
import { Seo } from "@/components/Seo";
import { getPage, type Page } from "@/lib/content";
import NotFound from "./NotFound";

// Renderiza uma página estática de src/content/paginas/<slug>.md
export default function Pagina({ slug }: { slug: string }) {
  const [page, setPage] = useState<Page | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    getPage(slug).then((result) => {
      if (active) setPage(result ?? null);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (page === undefined) return <div className="min-h-[50vh]" />;
  if (page === null) return <NotFound />;

  return (
    <>
      <Seo title={page.title} description={page.description} path={`/${slug}`} />
      <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="font-serif text-4xl font-bold tracking-tight">{page.title}</h1>
        <div className="mt-6">
          <Markdown>{page.body}</Markdown>
        </div>
      </div>
    </>
  );
}
