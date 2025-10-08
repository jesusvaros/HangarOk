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

const DATA_DIR = path.resolve(__dirname, '../data');
const PROCESSED_URLS_FILE = path.resolve(DATA_DIR, 'processed-urls.json');

// 🌐 CONFIGURACIÓN DE FUENTES DE NOTICIAS
const NEWS_SOURCES = [
  {
    name: 'El Cronista - Vivienda',
    url: 'https://www.cronista.com/tema/vivienda-es/',
    type: 'cronista',
    keywords: ['alquiler', 'vivienda', 'inmueble', 'piso', 'casa', 'propiedad', 'inquilino', 'propietario', 'renta', 'hipoteca', 'inmobiliario', 'ley-de-alquileres', 'mercado-inmobiliario', 'habitacional']
  },
  {
    name: 'La Sexta - Vivienda',
    url: 'https://www.lasexta.com/buscador-site/index.html?q=vivienda',
    type: 'lasexta',
    keywords: ['vivienda', 'alquiler', 'piso', 'casa', 'inmobiliario']
  },
  {
    name: 'Diario de Sevilla - Alquiler',
    url: 'https://www.diariodesevilla.es/tag/alquiler-de-vivienda/',
    type: 'diariodesevilla',
    keywords: ['alquiler', 'vivienda', 'inmueble', 'piso', 'casa', 'inmobiliario', 'arrendamiento']
  },
  {
    name: '20minutos - Inquilinos',
    url: 'https://www.20minutos.es/tags/temas/inquilinos.html',
    type: '20minutos',
    keywords: ['inquilinos', 'alquiler', 'vivienda', 'piso', 'casa', 'inmobiliario', 'arrendamiento']
  }
  // 📝 Aquí puedes añadir más fuentes fácilmente:
  // {
  //   name: 'El País - Vivienda',
  //   url: 'https://elpais.com/tag/vivienda/',
  //   type: 'elpais',
  //   keywords: ['vivienda', 'alquiler']
  // }
];

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

// 🔍 EXTRACTORES POR TIPO DE FUENTE
async function extractUrlsFromCronista(sourceUrl) {
  const response = await fetch(sourceUrl, {
    headers: {
      'User-Agent': 'CaseroOkBot/1.0 (+https://caserook.com)',
      'Accept-Language': 'es-ES,es;q=0.9',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Error fetching ${sourceUrl}: ${response.status}`);
  }
  
  const html = await response.text();
  const linkPatterns = [
    /https:\/\/www\.cronista\.com\/espana\/economia-finanzas\/[^"'\s)]+/g,
    /https:\/\/www\.cronista\.com\/espana\/actualidad-es\/[^"'\s)]+/g,
  ];
  
  let urls = [];
  for (const pattern of linkPatterns) {
    const matches = html.match(pattern) || [];
    urls = urls.concat(matches.map(url => url.replace(/[)}\]"']+$/, '')));
  }
  
  return [...new Set(urls)]; // Remove duplicates
}

async function extractUrlsFromLaSexta(sourceUrl) {
  const response = await fetch(sourceUrl, {
    headers: {
      'User-Agent': 'CaseroOkBot/1.0 (+https://caserook.com)',
      'Accept-Language': 'es-ES,es;q=0.9',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Error fetching ${sourceUrl}: ${response.status}`);
  }
  
  const html = await response.text();
  // La Sexta URLs pattern
  const linkPattern = /https:\/\/www\.lasexta\.com\/[^"'\s)]+/g;
  const matches = html.match(linkPattern) || [];
  
  return [...new Set(matches.map(url => url.replace(/[)}\]"']+$/, '')))];
}

async function extractUrlsFromDiarioDeSevilla(sourceUrl) {
  const response = await fetch(sourceUrl, {
    headers: {
      'User-Agent': 'CaseroOkBot/1.0 (+https://caserook.com)',
      'Accept-Language': 'es-ES,es;q=0.9',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Error fetching ${sourceUrl}: ${response.status}`);
  }
  
  const html = await response.text();
  // Diario de Sevilla URLs pattern
  const linkPattern = /https:\/\/www\.diariodesevilla\.es\/[^"'\s)]+/g;
  const matches = html.match(linkPattern) || [];
  
  return [...new Set(matches.map(url => url.replace(/[)}\]"']+$/, '')))];
}

async function extractUrlsFrom20Minutos(sourceUrl) {
  const response = await fetch(sourceUrl, {
    headers: {
      'User-Agent': 'CaseroOkBot/1.0 (+https://caserook.com)',
      'Accept-Language': 'es-ES,es;q=0.9',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Error fetching ${sourceUrl}: ${response.status}`);
  }
  
  const html = await response.text();
  // 20minutos URLs pattern
  const linkPattern = /https:\/\/www\.20minutos\.es\/[^"'\s)]+/g;
  const matches = html.match(linkPattern) || [];
  
  return [...new Set(matches.map(url => url.replace(/[)}\]"']+$/, '')))];
}

// 🎯 FILTRADOR DE URLs RELEVANTES
function filterRelevantUrls(urls, keywords) {
  // Palabras que EXCLUYEN automáticamente el artículo (no relacionado con mercado inmobiliario)
  const excludeKeywords = [
    'apuñalada', 'asesinato', 'crimen', 'violencia', 'agresión', 'ataque',
    'robo', 'delito', 'policía', 'arrestado', 'detenido', 'juicio',
    'accidente', 'incendio', 'explosión', 'emergencia', 'rescate',
    'político', 'elecciones', 'partido', 'gobierno', 'ministro',
    'deporte', 'fútbol', 'baloncesto', 'tenis', 'olimpiadas',
    'celebridad', 'famoso', 'actor', 'cantante', 'artista',
    'salud', 'hospital', 'médico', 'enfermedad', 'covid',
    'tecnología', 'smartphone', 'software', 'aplicación', 'internet',
    'imserso', 'viajes', 'turismo', 'vacaciones', 'pensionistas',
    'jubilados', 'tercera-edad', 'mayores', 'pensión', 'seguridad-social',
    'restaurante', 'comida', 'gastronomía', 'cocina', 'chef',
    'moda', 'ropa', 'fashion', 'belleza', 'cosmética'
  ];

  // Palabras que REQUIEREN para ser relevante (mercado inmobiliario)
  const requiredKeywords = [
    'alquiler', 'vivienda', 'inmueble', 'piso', 'casa', 'propiedad',
    'inquilino', 'propietario', 'renta', 'hipoteca', 'inmobiliario',
    'mercado-inmobiliario', 'habitacional', 'ley-de-alquileres',
    'precio', 'compra', 'venta', 'inversión', 'construcción',
    'urbanismo', 'residencial', 'habitación', 'apartamento'
  ];

  return urls.filter(url => {
    const urlLower = url.toLowerCase();
    
    // EXCLUIR si contiene palabras prohibidas
    const hasExcludedContent = excludeKeywords.some(keyword => urlLower.includes(keyword));
    if (hasExcludedContent) {
      console.log(`❌ Excluido por contenido irrelevante: ${url.substring(0, 80)}...`);
      return false;
    }
    
    // INCLUIR solo si contiene palabras requeridas
    const hasRequiredContent = requiredKeywords.some(keyword => urlLower.includes(keyword));
    if (!hasRequiredContent) {
      console.log(`❌ Excluido por falta de relevancia inmobiliaria: ${url.substring(0, 80)}...`);
      return false;
    }
    
    console.log(`✅ Incluido como relevante: ${url.substring(0, 80)}...`);
    return true;
  });
}

// 📰 GENERADOR DE POSTS
async function generateBlogPost(articleUrl) {
  console.log(`📝 Generando post para: ${articleUrl}`);
  
  try {
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
          console.log(`✅ Post generado exitosamente`);
          resolve(true);
        } else {
          console.error(`❌ Error generando post`);
          resolve(false);
        }
      });
      
      process.on('error', (error) => {
        console.error(`❌ Error ejecutando script: ${error.message}`);
        resolve(false);
      });
    });
  } catch (error) {
    console.error(`❌ Error generando post:`, error.message);
    return false;
  }
}

// 🤖 FUNCIÓN PRINCIPAL
async function runDailyAutomation() {
  console.log('🚀 Iniciando automatización diaria del blog...');
  console.log(`📅 Fecha: ${new Date().toLocaleDateString('es-ES')}`);
  
  const processedUrls = await loadProcessedUrls();
  let totalNewArticles = 0;
  let totalSuccessfulPosts = 0;
  
  // Procesar cada fuente de noticias
  for (const source of NEWS_SOURCES) {
    console.log(`\n🔍 Procesando: ${source.name}`);
    
    try {
      let urls = [];
      
      // Extraer URLs según el tipo de fuente
      switch (source.type) {
        case 'cronista':
          urls = await extractUrlsFromCronista(source.url);
          break;
        case 'lasexta':
          urls = await extractUrlsFromLaSexta(source.url);
          break;
        case 'diariodesevilla':
          urls = await extractUrlsFromDiarioDeSevilla(source.url);
          break;
        case '20minutos':
          urls = await extractUrlsFrom20Minutos(source.url);
          break;
        default:
          console.log(`⚠️  Tipo de fuente no soportado: ${source.type}`);
          continue;
      }
      
      // Filtrar URLs relevantes
      const relevantUrls = filterRelevantUrls(urls, source.keywords);
      console.log(`📰 URLs encontradas: ${urls.length}, relevantes: ${relevantUrls.length}`);
      
      // Filtrar URLs nuevas (no procesadas)
      const newUrls = relevantUrls.filter(url => !processedUrls.has(url));
      console.log(`🆕 URLs nuevas: ${newUrls.length}`);
      
      totalNewArticles += newUrls.length;
      
      // Generar posts para URLs nuevas
      for (const url of newUrls) {
        const success = await generateBlogPost(url);
        if (success) {
          processedUrls.add(url);
          totalSuccessfulPosts++;
        }
        
        // Delay entre requests
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } catch (error) {
      console.error(`❌ Error procesando ${source.name}:`, error.message);
    }
  }
  
  // Guardar URLs procesadas
  await saveProcessedUrls(processedUrls);
  
  // Resumen final
  console.log(`\n📊 RESUMEN DIARIO:`);
  console.log(`   🌐 Fuentes procesadas: ${NEWS_SOURCES.length}`);
  console.log(`   📰 Artículos nuevos encontrados: ${totalNewArticles}`);
  console.log(`   ✅ Posts generados exitosamente: ${totalSuccessfulPosts}`);
  console.log(`   📋 Total URLs en historial: ${processedUrls.size}`);
  
  if (totalSuccessfulPosts > 0) {
    console.log(`\n🎉 ¡${totalSuccessfulPosts} nuevos posts añadidos al blog!`);
  } else {
    console.log(`\n💤 No hay contenido nuevo hoy.`);
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runDailyAutomation().catch(error => {
    console.error('❌ Error fatal en automatización:', error.message);
    process.exit(1);
  });
}

export { runDailyAutomation };
