#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.resolve(__dirname, '../src/blog/posts');
const IMAGES_DIR = path.resolve(__dirname, '../public/images/blog');

// Large pool of unique images for different topics - NEVER repeat the same image
const IMAGE_POOLS = {
  // Housing/rental related - 15 unique images
  'alquiler': [
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1560184897-8e9e7b6a3a05?auto=format&fit=crop&w=1350&q=80'
  ],
  'vivienda': [
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1350&q=80'
  ],
  'casa': [
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1350&q=80'
  ],
  'piso': [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=1350&q=80'
  ],
  
  // Legal/contract related - 10 unique images
  'ley': [
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1350&q=80'
  ],
  'contrato': [
    'https://images.unsplash.com/photo-1554224154-26032fced8bd?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&fit=crop&w=1350&q=80'
  ],
  
  // Economic/financial - 8 unique images
  'precio': [
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1350&q=80'
  ],
  'mercado': [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1350&q=80'
  ],
  
  // Social issues - 8 unique images
  'jovenes': [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1350&q=80'
  ],
  'crisis': [
    'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=1350&q=80'
  ],
  
  // Community/neighbors - 6 unique images
  'ruido': [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?auto=format&fit=crop&w=1350&q=80'
  ],
  'vecinos': [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?auto=format&fit=crop&w=1350&q=80'
  ],
  
  // Default fallback pool - 10 unique images
  'default': [
    'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1464207687429-7505649dae38?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1516156008625-3a99312b8b6f?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1350&q=80'
  ]
};

// Track used images to avoid duplicates - PERSISTENT
const USED_IMAGES_FILE = path.resolve(__dirname, '../data/used-images.json');

async function loadUsedImages() {
  try {
    const content = await fs.readFile(USED_IMAGES_FILE, 'utf8');
    return new Set(JSON.parse(content));
  } catch (error) {
    return new Set();
  }
}

async function saveUsedImages(usedImages) {
  const dataDir = path.dirname(USED_IMAGES_FILE);
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(USED_IMAGES_FILE, JSON.stringify([...usedImages], null, 2));
}

let usedImages = new Set();

function getUniqueImageUrlForSlug(slug) {
  const slugLower = slug.toLowerCase();
  
  // Find matching keyword pools
  let matchingPools = [];
  for (const [keyword, pool] of Object.entries(IMAGE_POOLS)) {
    if (keyword !== 'default' && slugLower.includes(keyword)) {
      matchingPools.push(pool);
    }
  }
  
  // If no specific match, use default pool
  if (matchingPools.length === 0) {
    matchingPools = [IMAGE_POOLS.default];
  }
  
  // Flatten all matching pools
  const availableImages = matchingPools.flat();
  
  // Filter out already used images
  const unusedImages = availableImages.filter(url => !usedImages.has(url));
  
  // If all images from matching pools are used, fall back to any unused image from default
  let selectedImage;
  if (unusedImages.length > 0) {
    // Pick a random unused image from matching pools
    selectedImage = unusedImages[Math.floor(Math.random() * unusedImages.length)];
  } else {
    // Fall back to default pool unused images
    const unusedDefaults = IMAGE_POOLS.default.filter(url => !usedImages.has(url));
    if (unusedDefaults.length > 0) {
      selectedImage = unusedDefaults[Math.floor(Math.random() * unusedDefaults.length)];
    } else {
      // If everything is used, reset and start over (shouldn't happen with 60+ unique images)
      console.log('⚠️  Todas las imágenes han sido usadas, reiniciando pool...');
      usedImages.clear();
      selectedImage = availableImages[Math.floor(Math.random() * availableImages.length)];
    }
  }
  
  // Mark this image as used
  usedImages.add(selectedImage);
  
  return selectedImage;
}

async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    await fs.writeFile(filepath, Buffer.from(buffer));
    return true;
  } catch (error) {
    console.error(`❌ Error descargando imagen: ${error.message}`);
    return false;
  }
}

async function ensureImagesExist() {
  console.log('🖼️  Verificando imágenes para posts...');
  
  try {
    // Load previously used images to avoid duplicates
    usedImages = await loadUsedImages();
    console.log(`📊 Imágenes ya usadas: ${usedImages.size}`);
    
    // Ensure images directory exists
    await fs.mkdir(IMAGES_DIR, { recursive: true });
    
    // Read all post files
    const files = await fs.readdir(POSTS_DIR);
    const postFiles = files.filter(file => file.endsWith('.ts'));
    
    let downloadedCount = 0;
    let skippedCount = 0;
    
    for (const file of postFiles) {
      const slug = file.replace('.ts', '');
      const imagePath = path.join(IMAGES_DIR, `${slug}.jpg`);
      
      // Check if image already exists
      try {
        await fs.access(imagePath);
        console.log(`✅ Imagen ya existe: ${slug}.jpg`);
        skippedCount++;
        continue;
      } catch {
        // Image doesn't exist, download it
      }
      
      console.log(`⬇️  Descargando imagen para: ${slug}`);
      const imageUrl = getUniqueImageUrlForSlug(slug);
      const success = await downloadImage(imageUrl, imagePath);
      
      if (success) {
        console.log(`✅ Imagen descargada: ${slug}.jpg`);
        downloadedCount++;
      } else {
        console.log(`❌ Error descargando imagen para: ${slug}`);
      }
      
      // Small delay to be respectful to the image service
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Save updated used images
    await saveUsedImages(usedImages);
    
    console.log(`📊 Resumen de imágenes:`);
    console.log(`   • Descargadas: ${downloadedCount}`);
    console.log(`   • Ya existían: ${skippedCount}`);
    console.log(`   • Total posts: ${postFiles.length}`);
    console.log(`   • Imágenes únicas usadas: ${usedImages.size}`);
    
  } catch (error) {
    console.error('❌ Error verificando imágenes:', error.message);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  ensureImagesExist().catch(error => {
    console.error('❌ Error fatal:', error.message);
    process.exit(1);
  });
}

export { ensureImagesExist };
