import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { site } from "@/config/site";

export default function NotFound() {
  return (
    <>
      <Seo title="Página não encontrada" description="Essa página não existe no site da Otsukimi." />
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="moon moon-float h-20 w-20" aria-hidden="true" />
        <h1 className="mt-8 font-serif text-4xl font-bold tracking-tight">404</h1>
        <p className="mt-3 max-w-md leading-7 text-mist">
          Essa página se perdeu na noite de lua cheia. Que tal voltar para o início?
        </p>
        <Link
          to="/"
          className="mt-6 text-sm font-medium text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
        >
          Voltar ao início {site.emoji}
        </Link>
      </div>
    </>
  );
}
