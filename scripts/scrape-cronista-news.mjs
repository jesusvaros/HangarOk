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

const CRONISTA_VIVIENDA_URL = 'https://www.cronista.com/tema/vivienda-es/';
const PROCESSED_URLS_FILE = path.resolve(__dirname, '../data/processed-urls.json');
const DATA_DIR = path.resolve(__dirname, '../data');

// Ensure data directory exists
await fs.mkdir(DATA_DIR, { recursive: true });

async function loadProcessedUrls() {
  try {
    const content = await fs.readFile(PROCESSED_URLS_FILE, 'utf8');
    return new Set(JSON.parse(content));
  } catch (error) {
    return new Set();
  }
}

async function saveProcessedUrls(urls) {
  await fs.writeFile(PROCESSED_URLS_FILE, JSON.stringify([...urls], null, 2));
}

function extractArticleUrls(html) {
  const urls = [];
  
  // Extract URLs from the HTML content using multiple patterns
  const linkPatterns = [
    /https:\/\/www\.cronista\.com\/espana\/economia-finanzas\/[^"'\s)]+/g,
    /https:\/\/www\.cronista\.com\/espana\/actualidad-es\/[^"'\s)]+/g,
    /https:\/\/www\.cronista\.com\/espana\/[^"'\s)]+/g
  ];
  
  let allMatches = [];
  for (const pattern of linkPatterns) {
    const matches = html.match(pattern) || [];
    allMatches = allMatches.concat(matches);
  }
  
  // Filter to only include relevant housing-related articles
  const housingKeywords = [
    'alquiler', 'vivienda', 'inmueble', 'piso', 'casa', 'propiedad',
    'inquilino', 'propietario', 'renta', 'hipoteca', 'inmobiliario',
    'ley-de-alquileres', 'mercado-inmobiliario', 'habitacional'
  ];
  
  for (const url of allMatches) {
    // Clean the URL (remove any trailing characters)
    const cleanUrl = url.replace(/[)}\]"']+$/, '');
    
    // Check if URL contains housing-related keywords
    const containsHousingKeyword = housingKeywords.some(keyword => 
      cleanUrl.toLowerCase().includes(keyword)
    );
    
    if (containsHousingKeyword && !urls.includes(cleanUrl)) {
      urls.push(cleanUrl);
    }
  }
  
  console.log(`🔍 URLs encontradas: ${urls.slice(0, 5).join(', ')}${urls.length > 5 ? '...' : ''}`);
  return urls;
}

function isRecentArticle(url) {
  // Check if the article seems recent based on URL patterns
  // El Cronista URLs don't always have dates, so we'll be permissive
  return true;
}

function shouldProcessArticle(url, processedUrls) {
  return !processedUrls.has(url) && isRecentArticle(url);
}

async function generateBlogPost(articleUrl) {
  console.log(`Generando post para: ${articleUrl}`);
  
  try {
    // Use the existing generate-blog-post script
    const { spawn } = await import('child_process');
    
    return new Promise((resolve, reject) => {
      const process = spawn('node', [
        'scripts/generate-blog-post.mjs',
        articleUrl,
        '--tone=informativo',
        '--keywords=vivienda, alquiler, inmobiliario',
        `--date=${new Date().toISOString().slice(0, 10)}`
      ], {
        cwd: path.resolve(__dirname, '..'),
        stdio: 'inherit'
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ Post generado exitosamente para: ${articleUrl}`);
          resolve(true);
        } else {
          console.error(`❌ Error generando post para: ${articleUrl}`);
          resolve(false);
        }
      });
      
      process.on('error', (error) => {
        console.error(`❌ Error ejecutando script: ${error.message}`);
        resolve(false);
      });
    });
  } catch (error) {
    console.error(`❌ Error generando post para ${articleUrl}:`, error.message);
    return false;
  }
}

async function scrapeAndGenerate() {
  console.log('🔍 Scrapeando noticias de vivienda de El Cronista...');
  
  try {
    // Use known URLs from the content we saw earlier
    const knownUrls = [
      'https://www.cronista.com/espana/economia-finanzas/julio-plaza-experto-inmobiliario-podia-aspirar-a-comprar-un-inmueble-de-mas-o-menos-300-000-euros/',
      'https://www.cronista.com/espana/economia-finanzas/adios-ley-de-alquileres-los-inquilinos-podran-permanecer-en-la-vivienda-incluso-cuando-el-propietario-no-quiera-renovarles/',
      'https://www.cronista.com/espana/economia-finanzas/ley-de-alquileres-los-propietarios-deberan-indemnizar-a-los-inquilinos-si-incumplen-esta-normativa/',
      'https://www.cronista.com/espana/actualidad-es/confirmado-por-la-ley-de-propiedad-horizontal-los-vecinos-que-hagan-ruidos-molestos-pueden-tener-que-enfrentarse-a-las-consecuencias/',
      'https://www.cronista.com/espana/economia-finanzas/sergio-gutierrez-experto-inmobiliario-los-jovenes-duermen-en-la-calle-para-conseguir-un-piso-de-alquiler/',
      'https://www.cronista.com/espana/economia-finanzas/ley-alquileres-los-inquilinos-podran-permanecer-en-la-vivienda-aunque-el-propietario-no-quiera-renovar-el-contrato/',
      'https://www.cronista.com/espana/economia-finanzas/adios-a-la-casa-propia-esta-es-la-forma-en-la-que-muchos-jovenes-pueden-acceder-a-una-vivienda-pero-no-todos-pueden-hacerlo/',
      'https://www.cronista.com/espana/economia-finanzas/adios-a-la-ley-de-alquileres-el-propietario-puede-alquilar-su-vivienda-sin-hacerle-firmar-contrato-al-inquilino/'
    ];
    
    // Fetch the main page to get fresh content
    const response = await fetch(CRONISTA_VIVIENDA_URL, {
      headers: {
        'User-Agent': 'CaseroOkBot/1.0 (+https://caserook.com)',
        'Accept-Language': 'es-ES,es;q=0.9',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching page: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    const scrapedUrls = extractArticleUrls(html);
    
    // Combine known URLs with scraped ones
    const articleUrls = [...new Set([...knownUrls, ...scrapedUrls])];
    
    console.log(`📰 Encontrados ${articleUrls.length} artículos potenciales`);
    
    // Load processed URLs
    const processedUrls = await loadProcessedUrls();
    console.log(`📋 URLs ya procesadas: ${processedUrls.size}`);
    
    // Filter new articles
    const newArticles = articleUrls.filter(url => shouldProcessArticle(url, processedUrls));
    console.log(`🆕 Artículos nuevos para procesar: ${newArticles.length}`);
    
    if (newArticles.length === 0) {
      console.log('✅ No hay artículos nuevos para procesar');
      return;
    }
    
    // Process each new article
    let successCount = 0;
    for (const articleUrl of newArticles) {
      try {
        const success = await generateBlogPost(articleUrl);
        if (success) {
          processedUrls.add(articleUrl);
          successCount++;
        }
        
        // Add a small delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`❌ Error procesando ${articleUrl}:`, error.message);
      }
    }
    
    // Save updated processed URLs
    await saveProcessedUrls(processedUrls);
    
    // Auto-generate posts index and download images if any posts were created
    if (successCount > 0) {
      console.log('\n🔄 Actualizando índice de posts y descargando imágenes...');
      
      try {
        // Import and run the auto-generation scripts
        const { generatePostsIndex } = await import('./auto-generate-posts-index.mjs');
        const { ensureImagesExist } = await import('./auto-download-images.mjs');
        
        await generatePostsIndex();
        await ensureImagesExist();
        
        console.log('✅ Índice y imágenes actualizados automáticamente');
      } catch (error) {
        console.error('❌ Error en auto-actualización:', error.message);
      }
    }
    
    console.log(`\n📊 Resumen:`);
    console.log(`   • Artículos encontrados: ${articleUrls.length}`);
    console.log(`   • Artículos nuevos: ${newArticles.length}`);
    console.log(`   • Posts generados exitosamente: ${successCount}`);
    console.log(`   • Total URLs procesadas: ${processedUrls.size}`);
    
  } catch (error) {
    console.error('❌ Error en el scraping:', error.message);
    process.exit(1);
  }
}

// Run the scraper
scrapeAndGenerate().catch(error => {
  console.error('❌ Error fatal:', error.message);
  process.exit(1);
});
