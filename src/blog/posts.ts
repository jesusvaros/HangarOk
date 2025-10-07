// Usa `npm run generate:blog -- <URL>` para crear nuevos artículos automáticamente.
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

// Import individual post files
import post1 from './posts/como-evaluar-un-contrato-de-alquiler.js';
import post2 from './posts/indice-referencia-alquiler-2025.js';
import post3 from './posts/clausulas-abusivas-en-contratos-de-alquiler-como-afectan-tus-derechos-como-inqui.js';

const rawPosts: StaticBlogPost[] = [
  post1,
  post2,
  post3,
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
