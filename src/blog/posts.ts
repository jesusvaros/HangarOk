// This file is intentionally lightweight so the blog pages can compile even when
// no static posts have been generated yet. For automated content generation,
// the scripts in `scripts/` will recreate this file with real data.

import placeholderPost from './posts/placeholder';

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

export const blogPosts: StaticBlogPost[] = [placeholderPost];

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
