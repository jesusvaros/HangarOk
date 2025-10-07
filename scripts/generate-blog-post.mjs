#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

if (!globalThis.fetch) {
  console.error('Esta script requiere Node 18 o superior con fetch disponible.');
  process.exit(1);
}

// Load .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

try {
  const envContent = await fs.readFile(envPath, 'utf8');
  const envVars = envContent
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .reduce((acc, line) => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        process.env[key.trim()] = value.trim();
      }
      return acc;
    }, {});
} catch (error) {
  // .env file is optional, continue without it
}

const [rawUrl, ...rest] = process.argv.slice(2);

if (!rawUrl) {
  console.error('Uso: npm run generate:blog -- <URL> [--tone=informativo|practico|historia] [--keywords=palabras] [--date=YYYY-MM-DD]');
  process.exit(1);
}

const options = rest.reduce((acc, item) => {
  const match = item.match(/^--([^=]+)=(.*)$/);
  if (match) {
    acc[match[1]] = match[2];
  }
  return acc;
}, {});

const tone = options.tone ?? 'informativo';
const keywords = options.keywords ?? '';
const includeTips = options.includeTips ? options.includeTips !== 'false' : true;
const publishedAt = options.date ?? new Date().toISOString().slice(0, 10);

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('OPENAI_API_KEY no está definido. Añádelo a tu entorno antes de ejecutar el script.');
  process.exit(1);
}

const OPENAI_ENDPOINT = process.env.OPENAI_API_URL ?? 'https://api.openai.com/v1/chat/completions';
const MODEL = process.env.BLOG_OPENAI_MODEL ?? 'gpt-4.1-mini';

function slugify(input) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, ' ');
}

function extractArticle(html) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const rawTitle = titleMatch ? decodeEntities(titleMatch[1].trim()) : null;

  const ogDescriptionMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
  const metaDescriptionMatch = html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const rawDescription = ogDescriptionMatch?.[1] ?? metaDescriptionMatch?.[1] ?? null;

  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');

  const paragraphMatches = cleaned.match(/<p[^>]*>[\s\S]*?<\/p>/gi) ?? [];
  const paragraphText = paragraphMatches
    .map(p => decodeEntities(p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()))
    .filter(Boolean)
    .join('\n\n');

  const fallback = decodeEntities(
    cleaned
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );

  const content = paragraphText.length > 400 ? paragraphText : fallback;

  return {
    title: rawTitle ?? undefined,
    description: rawDescription ? decodeEntities(rawDescription) : undefined,
    content,
  };
}

function estimateReadingMinutes(text) {
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words === 0) return null;
  return Math.max(1, Math.round(words / 220));
}

function buildPrompts(article) {
  const tipsInstruction = includeTips
    ? "Incluye al final una sección titulada 'Consejos prácticos' con 3 recomendaciones accionables en formato lista."
    : 'No incluyas secciones con viñetas salvo que sean imprescindibles.';

  const keywordsInstruction = keywords ? `Optimiza el contenido para las palabras clave: ${keywords}.` : '';

  const toneInstruction = (() => {
    switch (tone) {
      case 'historia':
        return 'Adopta un tono cercano, resaltando testimonios y ejemplos reales de inquilinos.';
      case 'practico':
        return 'Adopta un tono práctico orientado a explicar el contexto legal y ofrecer recomendaciones accionables.';
      default:
        return 'Adopta un tono informativo claro y neutral para inquilinos en España.';
    }
  })();

  const systemPrompt = 'Eres redactor senior de CaseroOk. Reescribes noticias del sector vivienda en España en artículos originales, rigurosos y útiles para inquilinos.';
  const userPrompt = `Resumen original de la noticia:
URL: ${rawUrl}
Título detectado: ${article.title ?? 'No encontrado'}
Descripción detectada: ${article.description ?? 'No encontrada'}
Texto principal aproximado (recortado si es necesario):
"""
${article.content.slice(0, 4000)}
"""

${toneInstruction}
${tipsInstruction}
${keywordsInstruction}

Genera un artículo completamente nuevo evitando plagio. Explica por qué la noticia es relevante para el inquilino español.`;

  return { systemPrompt, userPrompt };
}

async function callOpenAI(systemPrompt, userPrompt) {
  const responseSchema = {
    type: 'object',
    properties: {
      title: { type: 'string' },
      summary: { type: 'string' },
      seo_title: { type: 'string' },
      seo_description: { type: 'string' },
      markdown: { type: 'string' },
    },
    required: ['title', 'summary', 'seo_title', 'seo_description', 'markdown'],
    additionalProperties: false,
  };

  const body = {
    model: MODEL,
    temperature: 0.6,
    response_format: { type: 'json_schema', json_schema: { name: 'blog_post', schema: responseSchema } },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  };

  const res = await fetch(OPENAI_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${text}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Respuesta de OpenAI inesperada (sin contenido).');
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`No se pudo parsear la respuesta de OpenAI: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function escapeTemplateLiteral(value) {
  return value.replace(/`/g, '\\`').replace(/\$\{/g, '$\\{');
}

async function createPostFile({ slug, title, summary, markdown, seoTitle, seoDescription, heroImageUrl, sourceUrl, readingMinutes }) {
  const postsDir = path.resolve(__dirname, '../src/blog/posts');
  const postFile = path.resolve(postsDir, `${slug}.ts`);

  // Ensure the posts directory exists
  await fs.mkdir(postsDir, { recursive: true });

  const postContent = `export const post = {
  slug: '${escapeTemplateLiteral(slug)}',
  title: '${escapeTemplateLiteral(title)}',
  summary: '${escapeTemplateLiteral(summary)}',
  publishedAt: '${publishedAt}',${heroImageUrl ? `\n  heroImageUrl: '${escapeTemplateLiteral(heroImageUrl)}',` : ''}${seoTitle ? `\n  seoTitle: '${escapeTemplateLiteral(seoTitle)}',` : ''}${seoDescription ? `\n  seoDescription: '${escapeTemplateLiteral(seoDescription)}',` : ''}${sourceUrl ? `\n  sourceUrl: '${escapeTemplateLiteral(sourceUrl)}',` : ''}${readingMinutes ? `\n  readingMinutes: ${readingMinutes},` : ''}
  content: \`${escapeTemplateLiteral(markdown.trim())}\`,
};

export default post;
`;

  await fs.writeFile(postFile, postContent, 'utf8');
  return postFile;
}

async function run() {
  console.log(`Descargando noticia desde ${rawUrl}...`);
  const res = await fetch(rawUrl, {
    headers: {
      'User-Agent': 'CaseroOkBot/1.0 (+https://caserook.com)',
      'Accept-Language': 'es-ES,es;q=0.9',
    },
  });

  if (!res.ok) {
    throw new Error(`No se pudo recuperar la URL proporcionada (${res.status} ${res.statusText}).`);
  }

  const html = await res.text();
  const article = extractArticle(html);

  if (!article.content || article.content.length < 200) {
    throw new Error('No se pudo extraer contenido suficiente de la URL.');
  }

  const { systemPrompt, userPrompt } = buildPrompts(article);
  console.log('Solicitando redacción a OpenAI...');
  const ai = await callOpenAI(systemPrompt, userPrompt);

  const title = ai.title?.trim() || article.title || 'Artículo del blog';
  const summary = ai.summary?.trim() || article.description || 'Resumen pendiente de completar.';
  const slug = slugify(title);
  const markdown = ai.markdown?.trim() || summary;
  const seoTitle = ai.seo_title?.trim() || title;
  const seoDescription = ai.seo_description?.trim() || summary;
  // Use local images instead of external URLs for better SEO
  const heroImageUrl = `/images/blog/${slug}.jpg`;
  const readingMinutes = estimateReadingMinutes(markdown);

  const postFile = await createPostFile({
    slug,
    title,
    summary,
    markdown,
    seoTitle,
    seoDescription,
    heroImageUrl,
    sourceUrl: rawUrl,
    readingMinutes,
  });

  console.log(`Artículo creado en ${postFile}. Revisa el archivo para hacer ajustes finales.`);
  
  // Auto-update posts index and download image
  try {
    console.log('🔄 Actualizando índice de posts y descargando imagen...');
    
    const { generatePostsIndex } = await import('./auto-generate-posts-index.mjs');
    const { ensureImagesExist } = await import('./auto-download-images.mjs');
    
    await generatePostsIndex();
    await ensureImagesExist();
    
    console.log('✅ Índice y imagen actualizados automáticamente');
  } catch (error) {
    console.error('❌ Error en auto-actualización:', error.message);
  }
}

run().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
