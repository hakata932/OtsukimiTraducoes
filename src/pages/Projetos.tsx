import { ProjectList } from "@/components/ProjectList";
import { Seo } from "@/components/Seo";
import { listProjects } from "@/lib/content";

export default function Projetos() {
  const projects = listProjects();

  return (
    <>
      <Seo
        title="Projetos"
        description="Todos os projetos de tradução do grupo Otsukimi para o português do Brasil — progresso, patch e instalação."
        path="/projetos"
      />

      <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6">
        <p className="text-xs tracking-[0.35em] text-mist/70" aria-hidden="true">
          プロジェクト
        </p>
        <h1 className="mt-1 font-serif text-4xl font-bold tracking-tight">Projetos</h1>
        <p className="mt-3 leading-7 text-mist">
          Nossas traduções para o português do Brasil, feitas de fã para fã.
        </p>

        <div className="mt-6 border-t border-line">
          <ProjectList projects={projects} />
        </div>
      </div>
    </>
  );
}
