import { Link } from "react-router-dom";
import { ProjectList } from "@/components/ProjectList";
import { Seo } from "@/components/Seo";
import { site } from "@/config/site";
import { formatDate, listPosts, listProjects } from "@/lib/content";

function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.description,
    ...(site.social.discord ? { sameAs: [site.social.discord] } : {}),
  };
  return <script type="application/ld+json">{JSON.stringify(data)}</script>;
}

function SectionLabel({ kana, children }: { kana: string; children: string }) {
  return (
    <div>
      <p className="text-xs tracking-[0.35em] text-mist/70" aria-hidden="true">
        {kana}
      </p>
      <h2 className="mt-1 font-serif text-3xl font-semibold tracking-tight">{children}</h2>
    </div>
  );
}

export default function Home() {
  const projects = listProjects();
  const posts = listPosts().slice(0, 3);

  return (
    <>
      <Seo path="/" />
      <OrganizationJsonLd />

      <section className="relative mx-auto w-full max-w-4xl overflow-hidden px-4 pb-14 pt-16 sm:px-6 sm:pt-24">
        <span
          className="kanji-vertical pointer-events-none absolute -top-4 right-10 hidden text-8xl font-medium text-ink opacity-[0.05] sm:block"
          aria-hidden="true"
        >
          お月見
        </span>
        <div
          className="moon moon-float absolute right-16 top-24 hidden h-28 w-28 sm:block"
          aria-hidden="true"
        />

        <p className="text-sm tracking-[0.3em] text-mist/80" aria-hidden="true">
          おつきみ
        </p>
        <h1 className="mt-2 font-serif text-5xl font-bold tracking-tight sm:text-6xl">
          {site.name}
        </h1>
        <p className="mt-4 max-w-md font-serif text-lg italic text-accent">{site.tagline}</p>
        <p className="mt-5 max-w-xl leading-8 text-mist">
          Um grupo de fãs dedicado a trazer White Album 2 e as obras da Leaf para o português do
          Brasil — com patches gratuitos, feitos de fã para fã.
        </p>
        <hr className="mt-12 border-line" />
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 pb-6 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <SectionLabel kana="プロジェクト">Projetos</SectionLabel>
          <Link
            to="/projetos"
            className="mb-1 text-sm font-medium text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
          >
            Ver todos
          </Link>
        </div>

        <ProjectList projects={projects} />
      </section>

      {posts.length > 0 ? (
        <section className="mx-auto w-full max-w-4xl px-4 pb-20 sm:px-6">
          <div className="flex items-end justify-between gap-4 border-t border-line pt-10">
            <SectionLabel kana="ブログ">Blog</SectionLabel>
            <Link
              to="/blog"
              className="mb-1 text-sm font-medium text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
            >
              Ver todas
            </Link>
          </div>

          <div className="mt-2 divide-y divide-line">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group relative -mx-3 rounded-md px-3 py-6 transition-colors hover:bg-surface-2/50"
              >
                <h3 className="font-serif text-xl font-semibold leading-snug">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="transition-colors after:absolute after:inset-0 group-hover:text-accent"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-mist">{post.description}</p>
                <p className="mt-2 text-xs text-mist/80">
                  {formatDate(post.date)} · {post.readingMinutes} min de leitura
                  {post.tags.length > 0 ? ` · ${post.tags.join(", ")}` : ""}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
