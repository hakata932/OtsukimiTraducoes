import { site } from "@/config/site";

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
}

// React 19 move <title>/<meta>/<link> renderizados em componentes para o <head>.
export function Seo({ title, description, path = "/", image, type = "website" }: SeoProps) {
  const fullTitle = title ? `${title} · ${site.name}` : `${site.name} — Traduções de White Album em PT-BR`;
  const desc = description ?? site.description;
  const url = `${site.url}${path}`;
  const img = image ? `${site.url}${image}` : `${site.url}/images/wa2/capa_whitealbum22.jpg`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:locale" content="pt_BR" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
    </>
  );
}
