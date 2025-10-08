import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageSEO from '../seo/PageSEO';
import { getPublicReviews, type PublicReview } from '../services/supabase/publicReviews';
import { slugify } from '../utils/slugify';

type CitySummary = {
  slug: string;
  name: string;
  state: string | null;
  count: number;
};

function humanizeSlug(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function CityReviewsIndexPage() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<PublicReview[]>([]);

  useEffect(() => {
    let cancelled = false;
    getPublicReviews()
      .then(rows => {
        if (cancelled) return;
        setReviews(rows);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setReviews([]);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const citySummaries = useMemo(() => {
    const grouped = new Map<string, CitySummary>();
    reviews.forEach(review => {
      const slug =
        review.city_slug ??
        (typeof review.city === 'string' && review.city.length > 0
          ? slugify(review.city)
          : null);
      if (!slug) return;

      const name = review.city ?? humanizeSlug(slug);
      const state = review.state ?? null;
      const existing = grouped.get(slug);
      if (existing) {
        existing.count += 1;
        if (!existing.state && state) existing.state = state;
      } else {
        grouped.set(slug, { slug, name, state, count: 1 });
      }
    });

    return Array.from(grouped.values()).sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    });
  }, [reviews]);

  const totalCities = citySummaries.length;
  const totalReviews = reviews.length;

  return (
    <>
      <PageSEO
        title="Opiniones de alquiler por ciudad | CaseroOk"
        description="Explora opiniones verificadas de inquilinos clasificadas por ciudad. Elige tu municipio y revisa experiencias reales antes de alquilar."
        canonicalPath="/opiniones"
      />
      <main className="mx-auto max-w-6xl px-6 pt-28 pb-24">
        <header className="mb-12 text-center md:text-left">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Opiniones verificadas
          </p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Opiniones de alquiler por ciudad
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600 md:mt-3">
            Reunimos testimonios reales de inquilinos para ayudarte a encontrar un alquiler seguro.
            Consulta las ciudades disponibles y abre el mapa centrado en tu zona.
          </p>
        </header>

        {loading ? (
          <section className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="text-gray-600">Cargando ciudades con opiniones…</p>
          </section>
        ) : null}

        {!loading && totalCities === 0 ? (
          <section className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Aún no hay opiniones públicas por ciudad
            </h2>
            <p className="mt-3 text-gray-600">
              Estamos moderando nuevas reseñas. Mientras tanto, visita el mapa para ver todas las
              experiencias publicadas hasta hoy.
            </p>
            <Link
              to="/map"
              className="mt-6 inline-flex items-center rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Abrir mapa de opiniones
            </Link>
          </section>
        ) : null}

        {!loading && totalCities > 0 ? (
          <section>
            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span>
                {totalCities} {totalCities === 1 ? 'ciudad con opiniones' : 'ciudades con opiniones'}
              </span>
              <span>•</span>
              <span>
                {totalReviews} {totalReviews === 1 ? 'reseña publicada' : 'reseñas publicadas'}
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {citySummaries.map(city => (
                <Link
                  key={city.slug}
                  to={`/opiniones/${city.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="font-semibold uppercase tracking-wide text-emerald-700">
                      {city.count} {city.count === 1 ? 'opinión' : 'opiniones'}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-gray-900 transition-colors group-hover:text-emerald-700">
                    {city.name}
                    {city.state ? <span className="text-gray-500">, {city.state}</span> : null}
                  </h2>
                  <p className="mt-3 text-sm text-gray-600">
                    Abre el mapa centrado en {city.name} y consulta las experiencias reales compartidas por
                    otros inquilinos.
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    Ver opiniones
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}
