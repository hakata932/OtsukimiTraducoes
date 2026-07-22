import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { site } from "@/config/site";
import { listProjects } from "@/lib/content";
import { SocialIcons } from "./SocialIcons";
import { ThemeToggle } from "./ThemeToggle";
import { TsukimiIcon } from "./TsukimiIcon";

const NAV_AFTER = [
  { to: "/blog", label: "Blog" },
  { to: "/quem-somos", label: "Quem somos?" },
  { to: "/faq", label: "FAQ" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const projects = listProjects();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm transition-colors ${
      isActive
        ? "text-accent underline decoration-accent/60 underline-offset-8"
        : "text-mist hover:text-ink"
    }`;

  const dropdownItemClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-md px-3 py-2 text-sm transition-colors ${
      isActive ? "text-accent" : "text-mist hover:bg-surface-2 hover:text-ink"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <TsukimiIcon className="h-6 w-6 transition-transform group-hover:scale-110" />
          <span className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-tight">{site.name}</span>
            <span className="hidden text-[11px] leading-tight text-mist sm:block">
              {site.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegação principal">
          <NavLink to="/" end className={linkClass}>
            Início
          </NavLink>

          {/* Hover abre o dropdown; clique em "Projetos" vai para a lista completa */}
          <div className="group/menu relative">
            <NavLink
              to="/projetos"
              className={({ isActive }) =>
                `inline-flex items-center gap-1 ${linkClass({ isActive })}`
              }
            >
              Projetos
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover/menu:rotate-180" />
            </NavLink>
            <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 opacity-0 transition-all duration-150 group-focus-within/menu:visible group-focus-within/menu:opacity-100 group-hover/menu:visible group-hover/menu:opacity-100">
              <div className="min-w-52 rounded-lg border border-line bg-bg p-1.5 shadow-xl">
                {projects.map((project) => (
                  <NavLink
                    key={project.slug}
                    to={`/projetos/${project.slug}`}
                    className={dropdownItemClass}
                  >
                    {project.title}
                    {project.status ? (
                      <span className="block text-[11px] italic text-mist/80">
                        {project.status}
                      </span>
                    ) : null}
                  </NavLink>
                ))}
                <div className="my-1 border-t border-line" />
                <NavLink to="/projetos" end className={dropdownItemClass}>
                  Ver todos os projetos
                </NavLink>
              </div>
            </div>
          </div>

          {NAV_AFTER.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <SocialIcons className="hidden sm:flex" />
          <ThemeToggle />
          <button
            type="button"
            className="rounded-lg p-2 text-mist transition-colors hover:bg-surface-2 hover:text-ink md:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          className="border-t border-line bg-bg px-4 pb-4 pt-2 md:hidden"
          aria-label="Navegação principal (celular)"
        >
          <div className="flex flex-col">
            <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>
              Início
            </NavLink>
            <NavLink to="/projetos" end className={linkClass} onClick={() => setOpen(false)}>
              Projetos
            </NavLink>
            {projects.map((project) => (
              <NavLink
                key={project.slug}
                to={`/projetos/${project.slug}`}
                className={({ isActive }) => `${linkClass({ isActive })} pl-7`}
                onClick={() => setOpen(false)}
              >
                {project.title}
              </NavLink>
            ))}
            {NAV_AFTER.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setOpen(false)}>
                {item.label}
              </NavLink>
            ))}
          </div>
          <SocialIcons className="mt-2 sm:hidden" />
        </nav>
      ) : null}
    </header>
  );
}
