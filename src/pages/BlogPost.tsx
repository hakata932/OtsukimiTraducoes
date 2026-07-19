import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, UserRound } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import { Seo } from "@/components/Seo";
import { formatDate, getPost } from "@/lib/content";
import NotFound from "./NotFound";

export default function BlogPost() {
  const { slug } = useParams();
  const post = slug ? getPost(slug) : undefined;

  if (!post) return <NotFound />;

  return (
    <>
      <Seo
        title={post.title}
        description={post.description}
        path={`/blog/${post.slug}`}
        image={post.thumbnail}
        type="article"
      />

      <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-sm font-medium text-mist transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao blog
        </Link>

        <h1 className="mt-4 font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>

        <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-mist">
          {post.author ? (
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="h-4 w-4" /> {post.author}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" /> {formatDate(post.date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {post.readingMinutes} min de leitura
          </span>
        </p>

        {post.thumbnail ? (
          <img src={post.thumbnail} alt="" className="mt-8 w-full rounded-md border border-line" />
        ) : null}

        <div className="mt-8">
          <Markdown>{post.body}</Markdown>
        </div>
      </article>
    </>
  );
}
