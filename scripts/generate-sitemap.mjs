#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const POSTS_DIR = path.resolve(ROOT_DIR, 'src/blog/posts');
const SITEMAP_PATH = path.resolve(ROOT_DIR, 'public/sitemap.xml');
const ENV_PATH = path.resolve(ROOT_DIR, '.env');
const require = createRequire(import.meta.url);

async function loadEnv() {
  try {
    const content = await fs.readFile(ENV_PATH, 'utf8');
    content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .forEach(line => {
        const eqIndex = line.indexOf('=');
        if (eqIndex === -1) return;
        const key = line.slice(0, eqIndex).trim();
        const rawValue = line.slice(eqIndex + 1).trim();
        if (!key || process.env[key]) return;
        const value = rawValue.replace(/^['"]|['"]$/g, '');
        process.env[key] = value;
      });
  } catch {
    // Ignore missing .env
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
}

async function loadBlogPosts() {
  try {
    const files = await fs.readdir(POSTS_DIR);
    const tsFiles = files.filter(file => file.endsWith('.ts'));
    const posts = [];

    for (const file of tsFiles) {
      const absPath = path.resolve(POSTS_DIR, file);
      const source = await fs.readFile(absPath, 'utf8');
      const transpiled = ts.transpileModule(source, {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2019,
        },
        fileName: file,
      });

      const module = { exports: {} };
      const sandbox = {
        module,
        exports: module.exports,
        require,
        __filename: absPath,
        __dirname: path.dirname(absPath),
      };

      vm.runInNewContext(transpiled.outputText, sandbox, { filename: absPath });

      const exported = sandbox.module.exports?.default ?? sandbox.module.exports?.post;
      if (exported && typeof exported.slug === 'string') {
        posts.push(exported);
      }
    }

    return posts.sort((a, b) => {
      const da = a.publishedAt ?? '';
      const db = b.publishedAt ?? '';
      return db.localeCompare(da);
    });
  } catch (error) {
    console.error('No se pudieron cargar los posts del blog:', error.message);
    return [];
  }
}

async function loadCitySummaries() {
  const supabaseUrl =
    process.env.SUPABASE_URL ??
    process.env.VITE_SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    null;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY ??
    null;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Entorno Supabase no configurado. Saltando URLs por ciudad.');
    return [];
  }

  try {
    const client = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const { data, error } = await client.from('public_reviews').select('address_details').eq('is_public', true);

    if (error || !data) {
      console.warn('No se pudieron obtener las ciudades de Supabase:', error?.message ?? 'Error desconocido');
      return [];
    }

    const grouped = new Map();
    for (const row of data) {
      const details = row.address_details ?? {};
      const rawCity =
        details.city ??
        details.components?.city ??
        details.components?.town ??
        details.components?.village ??
        null;
      if (!rawCity || typeof rawCity !== 'string' || !rawCity.trim()) continue;

      const city = rawCity.trim();
      const citySlug = slugify(city);
      if (!citySlug) continue;

      const state =
        details.state ??
        details.components?.state ??
        details.components?.region ??
        null;

      const existing = grouped.get(citySlug);

      if (existing) {
        existing.count += 1;
        if (!existing.state && state) existing.state = state;
      } else {
        grouped.set(citySlug, {
          slug: citySlug,
          name: city,
          state: state ?? null,
          count: 1,
        });
      }
    }

    return Array.from(grouped.values()).sort((a, b) => b.count - a.count);
  } catch (error) {
    console.warn('Error inesperado obteniendo ciudades de Supabase:', error.message);
    return [];
  }
}

function buildUrl(baseUrl, pathSegment) {
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const segment = pathSegment.startsWith('/') ? pathSegment : `/${pathSegment}`;
  return `${base}${segment}`;
}

function formatDate(input) {
  if (!input) return new Date().toISOString().slice(0, 10);
  try {
    const date = new Date(input);
    if (Number.isNaN(date.getTime())) throw new Error('fecha inválida');
    return date.toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function renderSitemap(entries) {
  const urlset = entries
    .map(
      entry => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${formatDate(entry.lastmod)}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>
`;
}

async function generateSitemap() {
  await loadEnv();

  const baseUrl = process.env.SITE_URL ?? 'https://hangarok.com';
  const today = new Date().toISOString().slice(0, 10);

  const staticEntries = [
    { path: '/', changefreq: 'daily', priority: '1.0', lastmod: today },
    { path: '/map', changefreq: 'weekly', priority: '0.8', lastmod: today },
    { path: '/opiniones', changefreq: 'daily', priority: '0.7', lastmod: today },
    { path: '/blog', changefreq: 'daily', priority: '0.7', lastmod: today },
    { path: '/add-review', changefreq: 'monthly', priority: '0.5', lastmod: today },
    { path: '/aviso-legal', changefreq: 'yearly', priority: '0.2', lastmod: today },
    { path: '/politica-privacidad', changefreq: 'yearly', priority: '0.2', lastmod: today },
    { path: '/cookies', changefreq: 'yearly', priority: '0.2', lastmod: today },
    { path: '/condiciones-uso', changefreq: 'yearly', priority: '0.2', lastmod: today },
    { path: '/buenas-practicas', changefreq: 'yearly', priority: '0.2', lastmod: today },
    { path: '/terminosycondiciones', changefreq: 'yearly', priority: '0.2', lastmod: today },
  ].map(item => ({
    loc: buildUrl(baseUrl, item.path),
    changefreq: item.changefreq,
    priority: item.priority,
    lastmod: item.lastmod,
  }));

  const blogPosts = await loadBlogPosts();
  const blogEntries = blogPosts.map(post => ({
    loc: buildUrl(baseUrl, `/blog/${post.slug}`),
    changefreq: 'weekly',
    priority: '0.6',
    lastmod: post.publishedAt ?? today,
  }));

  const citySummaries = await loadCitySummaries();
  const cityEntries = citySummaries.map(city => ({
    loc: buildUrl(baseUrl, `/opiniones/${city.slug}`),
    changefreq: 'weekly',
    priority: '0.6',
    lastmod: today,
  }));

  const entries = [...staticEntries, ...blogEntries, ...cityEntries];

  const xml = renderSitemap(entries);
  await fs.writeFile(SITEMAP_PATH, xml, 'utf8');

  console.log(`Sitemap actualizado en ${path.relative(ROOT_DIR, SITEMAP_PATH)}`);
  console.log(`• Rutas estáticas: ${staticEntries.length}`);
  console.log(`• Posts del blog: ${blogEntries.length}`);
  console.log(`• Ciudades: ${cityEntries.length}`);
}

generateSitemap().catch(error => {
  console.error('Error generando sitemap:', error);
  process.exit(1);
});
