import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { formatDate, listPosts } from "@/lib/content";

export default function Blog() {
  const posts = listPosts();

  return (
    <>
      <Seo
        title="Blog"
        description="Novidades, bastidores e anúncios das traduções do grupo Otsukimi — White Album 2 e obras da Leaf em PT-BR."
        path="/blog"
      />

      <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
        <p className="text-xs tracking-[0.35em] text-mist/70" aria-hidden="true">
          ブログ
        </p>
        <h1 className="mt-1 font-serif text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-3 leading-7 text-mist">
          Novidades, bastidores e anúncios das nossas traduções.
        </p>

        <div className="mt-6 divide-y divide-line border-t border-line">
          {posts.length === 0 ? (
            <p className="py-10 text-mist">Ainda não há publicações por aqui. Volte em breve! 🎑</p>
          ) : null}

          {posts.map((post) => (
            <article
              key={post.slug}
              className="group relative -mx-3 flex items-start gap-6 rounded-md px-3 py-8 transition-colors hover:bg-surface-2/50"
            >
              <div className="min-w-0 flex-1">
                <h2 className="font-serif text-2xl font-semibold leading-snug">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="transition-colors after:absolute after:inset-0 group-hover:text-accent"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 leading-7 text-mist">{post.description}</p>
                <p className="mt-3 text-xs text-mist/80">
                  {post.author ? `${post.author} · ` : ""}
                  {formatDate(post.date)} · {post.readingMinutes} min de leitura
                  {post.tags.length > 0 ? ` · ${post.tags.join(", ")}` : ""}
                </p>
              </div>
              {post.thumbnail ? (
                <img
                  src={post.thumbnail}
                  alt=""
                  loading="lazy"
                  className="hidden h-24 w-36 shrink-0 rounded-md border border-line object-cover sm:block"
                />
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
