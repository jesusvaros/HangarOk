#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.resolve(__dirname, '../src/blog/posts');
const POSTS_INDEX_FILE = path.resolve(__dirname, '../src/blog/posts.ts');

async function generatePostsIndex() {
  console.log('🔄 Generando índice automático de posts...');
  
  try {
    // Read all .ts files in the posts directory
    const files = await fs.readdir(POSTS_DIR);
    const postFiles = files
      .filter(file => file.endsWith('.ts') && file !== 'index.ts')
      .sort(); // Sort alphabetically for consistent ordering
    
    console.log(`📁 Encontrados ${postFiles.length} archivos de posts`);
    
    // Generate imports
    const imports = postFiles.map((file, index) => {
      const importName = `post${index + 1}`;
      const fileName = file.replace('.ts', '.js'); // Import as .js for ES modules
      return `import ${importName} from './posts/${fileName}';`;
    }).join('\n');
    
    // Generate array items
    const arrayItems = postFiles.map((_, index) => `  post${index + 1},`).join('\n');
    
    // Generate the complete posts.ts file
    const postsContent = `// Usa \`npm run generate:blog -- <URL>\` para crear nuevos artículos automáticamente.
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
${imports}

const rawPosts: StaticBlogPost[] = [
${arrayItems}
];

export const blogPosts = [...rawPosts].sort((a, b) => (a.publishedAt > b.publishedAt ? -1 : 1));

export function findBlogPostBySlug(slug: string) {
  return blogPosts.find(post => post.slug === slug);
}

export function computeReadingMinutes(content: string, fallback?: number | null) {
  if (fallback && Number.isFinite(fallback)) {
    return fallback;
  }
  const words = content.split(/\\s+/).filter(Boolean);
  if (words.length === 0) return null;
  return Math.max(1, Math.round(words.length / 220));
}
`;
    
    // Write the generated file
    await fs.writeFile(POSTS_INDEX_FILE, postsContent, 'utf8');
    
    console.log(`✅ Índice de posts generado exitosamente`);
    console.log(`📊 Total de posts: ${postFiles.length}`);
    
  } catch (error) {
    console.error('❌ Error generando índice de posts:', error.message);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generatePostsIndex().catch(error => {
    console.error('❌ Error fatal:', error.message);
    process.exit(1);
  });
}

export { generatePostsIndex };
