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

function truncateToWords(text: string, maxWords: number) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(' ')}...`;
}

function buildExcerpt(post: StaticBlogPost) {
  if (post.summary) return truncateToWords(post.summary, 35);
  const words = post.content.split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;
  return `${words.slice(0, 35).join(' ')}...`;
}

export default function BlogListPage() {
  const fallbackImageUrl = '/og-casero.svg';
  const heroPost = blogPosts[0] ?? null;
  const secondaryPosts = blogPosts.slice(1);
  const heroReadingMinutes = heroPost ? computeReadingMinutes(heroPost) : null;
  const heroExcerpt = heroPost ? buildExcerpt(heroPost) : null;

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
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">Artículo destacado</h2>
            <Link
              to={`/blog/${heroPost.slug}`}
              className="group block overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="grid gap-0 md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <img
                    src={heroPost.heroImageUrl ?? fallbackImageUrl}
                    alt={heroPost.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0" />
                  <span className="pointer-events-none absolute left-5 top-5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow">
                    Destacado
                  </span>
                </div>

                <div className="flex flex-col justify-center px-6 py-8 md:px-10">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                    {heroPost.publishedAt ? <span>{formatDate(heroPost.publishedAt)}</span> : null}
                    {heroPost.publishedAt && heroReadingMinutes ? <span>•</span> : null}
                    {heroReadingMinutes ? <span>{heroReadingMinutes} min</span> : null}
                  </div>
                  <h2 className="mt-3 text-3xl font-semibold text-gray-900 transition-colors group-hover:text-emerald-700 md:text-4xl">
                    {heroPost.title}
                  </h2>
                  {heroExcerpt ? (
                    <p className="mt-4 text-base text-gray-600 md:text-lg">{heroExcerpt}</p>
                  ) : null}
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    Leer más
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {secondaryPosts.length > 0 && (
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">Artículos recientes</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {secondaryPosts.map(post => {
                const readingMinutes = computeReadingMinutes(post);
                const publishedLabel = formatDate(post.publishedAt);
                const excerpt = buildExcerpt(post);
                const imageUrl = post.heroImageUrl ?? fallbackImageUrl;
                return (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-emerald-50">
                      <img
                        src={imageUrl}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex flex-1 flex-col px-5 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                        {publishedLabel ? <span>{publishedLabel}</span> : null}
                        {publishedLabel && readingMinutes ? <span>•</span> : null}
                        {readingMinutes ? <span>{readingMinutes} min</span> : null}
                      </div>
                      <h2 className="mt-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-emerald-700">
                        {post.title}
                      </h2>
                      {excerpt ? <p className="mt-2 text-sm text-gray-600">{excerpt}</p> : null}
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                        Leer más
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
