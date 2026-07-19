import { useParams } from "react-router-dom";
import { Markdown } from "@/components/Markdown";
import { Seo } from "@/components/Seo";
import { Snowfall } from "@/components/Snowfall";
import { site } from "@/config/site";
import { getProject } from "@/lib/content";
import NotFound from "./NotFound";

export default function Projeto() {
  const { slug } = useParams();
  const project = slug ? getProject(slug) : undefined;

  if (!project) return <NotFound />;

  return (
    <>
      <Seo
        title={`${project.title} — Tradução PT-BR`}
        description={`${project.description ? `${project.description}. ` : ""}Acompanhe o progresso e baixe o patch de tradução de ${project.title} em português no ${site.name}.`}
        path={`/projetos/${project.slug}`}
        image={project.cover}
        type="article"
      />

      <section className="relative overflow-hidden border-b border-line bg-surface">
        <Snowfall />
        <div className="relative mx-auto flex max-w-3xl flex-col gap-8 px-4 py-14 sm:flex-row sm:items-center sm:px-6">
          {project.cover ? (
            <img
              src={project.cover}
              alt={`Capa de ${project.title}`}
              className="w-40 shrink-0 self-center rounded-md border border-line sm:self-auto"
            />
          ) : null}
          <div>
            <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
              {project.title}
            </h1>
            {project.status ? (
              <p className="mt-2 font-serif italic text-accent">{project.status}</p>
            ) : null}
            {project.description ? (
              <p className="mt-3 leading-7 text-mist">{project.description}</p>
            ) : null}
          </div>
        </div>
      </section>

      <article className="mx-auto w-full max-w-3xl px-4 pb-20 pt-4 sm:px-6">
        <Markdown>{project.body}</Markdown>
      </article>
    </>
  );
}
