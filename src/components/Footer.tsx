import { Link } from "react-router-dom";
import { site } from "@/config/site";
import { TsukimiIcon } from "./TsukimiIcon";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h2 className="font-serif text-lg font-semibold text-ink">Sobre nós</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-mist">
          A {site.name} <TsukimiIcon className="inline-block h-4 w-4 align-[-0.125em]" /> é um
          grupo de fãs dedicado à tradução de White Album 2 e
          obras da Leaf para o português do Brasil — sem fins lucrativos e sem afiliação oficial.{" "}
          <Link to="/quem-somos" className="font-medium text-accent hover:underline">
            Conheça o grupo
          </Link>
          .
        </p>
        <p className="mt-4 max-w-2xl text-xs leading-5 text-mist/80">
          Todo o conteúdo oficial exibido aqui — personagens, nomes, artes, capas, imagens, textos e
          marcas — pertence aos seus autores e detentores de direitos originais, incluindo Leaf e
          AQUAPLUS. Nossas traduções são feitas por fãs e não reivindicam propriedade sobre a obra
          original. Não disponibilizamos jogos, apenas patches de tradução.
        </p>
        <p className="mt-4 text-xs text-mist/80">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
