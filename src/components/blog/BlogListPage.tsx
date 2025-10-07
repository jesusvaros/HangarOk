import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageSEO from '../../seo/PageSEO';
import { blogPosts, computeReadingMinutes as estimateReadingMinutes, type StaticBlogPost } from '../../blog/posts';

function formatDate(dateString: string | null) {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('formatDate error', error);
    return null;
  }
}

function computeReadingMinutes(post: StaticBlogPost) {
  return estimateReadingMinutes(post.content, post.readingMinutes);
}

function buildExcerpt(post: StaticBlogPost) {
  if (post.summary) return post.summary;
  const words = post.content.split(/\s+/).filter(Boolean).slice(0, 60);
  if (words.length === 0) return null;
  return `${words.join(' ')}...`;
}

export default function BlogListPage() {
  const heroPost = useMemo(() => blogPosts[0] ?? null, []);
  const secondaryPosts = useMemo(() => blogPosts.slice(1), []);
  const heroReadingMinutes = heroPost ? computeReadingMinutes(heroPost) : null;

  return (
    <>
      <PageSEO
        title="Blog de CaseroOk"
        description="Guías y novedades sobre alquiler seguro, viviendas y experiencias de inquilinos en España."
        canonicalPath="/blog"
      />
      <main className="mx-auto mt-28 max-w-6xl px-6 pb-24">
        <header className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-700">Blog</p>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">Historias y guías para inquilinos informados</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
            Cada semana analizamos noticias del sector vivienda y las transformamos en artículos prácticos y originales.
          </p>
        </header>

        {blogPosts.length === 0 && (
          <section className="rounded-xl border border-gray-200 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-900">Anunciaremos el primer artículo muy pronto</h2>
            <p className="mt-2 text-gray-600">Estamos preparando contenidos originales sobre alquiler, convivencia y derechos de inquilinos.</p>
          </section>
        )}

        {heroPost && (
          <article className="mb-12 grid gap-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-lg md:grid-cols-2">
            {heroPost.heroImageUrl ? (
              <Link to={`/blog/${heroPost.slug}`} className="group overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={heroPost.heroImageUrl}
                  alt={heroPost.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
            ) : (
              <Link to={`/blog/${heroPost.slug}`} className="flex h-full items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <span className="text-lg font-semibold">CaseroOk Blog</span>
              </Link>
            )}

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-wide text-emerald-700">
                <span>Artículo destacado</span>
                {heroReadingMinutes ? <span>• {heroReadingMinutes} min</span> : null}
              </div>
              <Link to={`/blog/${heroPost.slug}`} className="mt-3 block text-3xl font-semibold text-gray-900 hover:text-emerald-700">
                {heroPost.title}
              </Link>
              {heroPost.publishedAt ? (
                <p className="mt-2 text-sm text-gray-500">Publicado el {formatDate(heroPost.publishedAt)}</p>
              ) : null}
              {buildExcerpt(heroPost) ? (
                <p className="mt-4 text-lg text-gray-700">{buildExcerpt(heroPost)}</p>
              ) : null}
              <Link
                to={`/blog/${heroPost.slug}`}
                className="mt-6 w-fit rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Leer artículo completo
              </Link>
            </div>
          </article>
        )}

        {secondaryPosts.length > 0 && (
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">Artículos recientes</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {secondaryPosts.map(post => {
                const readingMinutes = computeReadingMinutes(post);
                const publishedLabel = formatDate(post.publishedAt);
                const excerpt = buildExcerpt(post);
                return (
                  <article key={post.slug} className="group flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <div>
                      <Link to={`/blog/${post.slug}`} className="block text-2xl font-semibold text-gray-900 group-hover:text-emerald-700">
                        {post.title}
                      </Link>
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                        {publishedLabel ? <span>{publishedLabel}</span> : null}
                        {publishedLabel && readingMinutes ? <span>•</span> : null}
                        {readingMinutes ? <span>{readingMinutes} min de lectura</span> : null}
                      </div>
                      {excerpt ? <p className="mt-3 text-gray-700">{excerpt}</p> : null}
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700"
                    >
                      Leer más
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
