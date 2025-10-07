// Usa `npm run generate:blog -- <URL>` para crear nuevos artículos automáticamente.
// Este archivo se genera automáticamente. No editar manualmente.
export type StaticBlogPost = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  publishedAt: string; // ISO date string
  heroImageUrl?: string;
  readingMinutes?: number;
  seoTitle?: string;
  seoDescription?: string;
  sourceUrl?: string;
};

// Import individual post files (auto-generated)
import post1 from './posts/clausulas-abusivas-en-contratos-de-alquiler-como-afectan-tus-derechos-como-inqui.js';
import post2 from './posts/como-evaluar-un-contrato-de-alquiler.js';
import post3 from './posts/comprar-o-alquilar-vivienda-en-espana-analisis-practico-para-inquilinos.js';
import post4 from './posts/indice-referencia-alquiler-2025.js';
import post5 from './posts/la-crisis-del-alquiler-en-espana-jovenes-enfrentan-una-oferta-de-vivienda-cada-v.js';
import post6 from './posts/la-crisis-del-alquiler-en-espana-por-que-los-jovenes-estan-durmiendo-en-la-calle.js';
import post7 from './posts/la-donacion-de-viviendas-una-alternativa-creciente-para-que-los-jovenes-accedan-.js';
import post8 from './posts/novedades-en-la-ley-de-arrendamientos-urbanos-que-implica-alquilar-sin-contrato-.js';
import post9 from './posts/nueva-ley-de-alquileres-en-espana-seguridad-para-inquilinos-ante-la-no-renovacio.js';
import post10 from './posts/nueva-ley-de-vivienda-en-espana-que-significa-para-los-inquilinos-y-propietarios.js';
import post11 from './posts/nuevas-obligaciones-para-propietarios-en-alquileres-tras-la-venta-de-viviendas-e.js';
import post12 from './posts/ruido-en-comunidades-de-vecinos-derechos-y-obligaciones-segun-la-ley-de-propieda.js';

const rawPosts: StaticBlogPost[] = [
  post1,
  post2,
  post3,
  post4,
  post5,
  post6,
  post7,
  post8,
  post9,
  post10,
  post11,
  post12,
];

export const blogPosts = [...rawPosts].sort((a, b) => (a.publishedAt > b.publishedAt ? -1 : 1));

export function findBlogPostBySlug(slug: string) {
  return blogPosts.find(post => post.slug === slug);
}

export function computeReadingMinutes(content: string, fallback?: number | null) {
  if (fallback && Number.isFinite(fallback)) {
    return fallback;
  }
  const words = content.split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;
  return Math.max(1, Math.round(words.length / 220));
}
