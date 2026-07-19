import { Link } from "react-router-dom";
import type { Project } from "@/lib/content";

// Lista editorial de projetos, usada na home e na página /projetos.
// A linha inteira é clicável (link esticado a partir do título).
export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="mt-2 divide-y divide-line">
      {projects.map((project) => (
        <article
          key={project.slug}
          className="group relative -mx-3 flex gap-6 rounded-md px-3 py-8 transition-colors hover:bg-surface-2/50"
        >
          {project.cover ? (
            <img
              src={project.cover}
              alt={`Capa de ${project.title}`}
              loading="lazy"
              className="hidden w-36 shrink-0 self-start rounded-md border border-line sm:block sm:w-44"
            />
          ) : null}
          <div className="min-w-0">
            <h3 className="font-serif text-2xl font-semibold leading-snug">
              <Link
                to={`/projetos/${project.slug}`}
                className="transition-colors after:absolute after:inset-0 group-hover:text-accent"
              >
                {project.title}
              </Link>
            </h3>
            {project.status ? (
              <p className="mt-1 text-sm italic text-accent">{project.status}</p>
            ) : null}
            <p className="mt-3 max-w-xl leading-7 text-mist">{project.description}</p>
            <span className="mt-4 inline-block text-sm font-medium text-accent underline decoration-accent/40 underline-offset-4">
              Progresso, patch e instalação
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
