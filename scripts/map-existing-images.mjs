#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.resolve(__dirname, '../public/images/blog');
const DATA_DIR = path.resolve(__dirname, '../data');
const USED_IMAGES_FILE = path.resolve(DATA_DIR, 'used-images.json');

async function mapExistingImages() {
  console.log('🔍 Mapeando imágenes existentes...');
  
  try {
    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Read all existing images
    const files = await fs.readdir(IMAGES_DIR);
    const imageFiles = files.filter(file => file.endsWith('.jpg'));
    
    console.log(`📁 Encontradas ${imageFiles.length} imágenes existentes`);
    
    // Create a mapping of image hashes to prevent duplicates
    const imageHashes = new Set();
    const usedUrls = new Set();
    
    for (const imageFile of imageFiles) {
      const imagePath = path.join(IMAGES_DIR, imageFile);
      const imageBuffer = await fs.readFile(imagePath);
      const imageHash = createHash('md5').update(imageBuffer).digest('hex');
      
      imageHashes.add(imageHash);
      console.log(`📷 ${imageFile} -> hash: ${imageHash.substring(0, 8)}...`);
    }
    
    // For now, we'll mark some placeholder URLs as used to prevent reuse
    // This is a simplified approach - in a real scenario, we'd need to track the actual URLs
    const placeholderUrls = [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1560184897-8e9e7b6a3a05?auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1464207687429-7505649dae38?auto=format&fit=crop&w=1350&q=80'
    ];
    
    // Mark the first N URLs as used (where N = number of existing images)
    for (let i = 0; i < Math.min(imageFiles.length, placeholderUrls.length); i++) {
      usedUrls.add(placeholderUrls[i]);
    }
    
    // Save the used URLs
    await fs.writeFile(USED_IMAGES_FILE, JSON.stringify([...usedUrls], null, 2));
    
    console.log(`✅ Mapeadas ${usedUrls.size} URLs como usadas`);
    console.log(`📊 Total imágenes existentes: ${imageFiles.length}`);
    console.log(`🔒 URLs marcadas como usadas: ${usedUrls.size}`);
    
  } catch (error) {
    console.error('❌ Error mapeando imágenes:', error.message);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  mapExistingImages().catch(error => {
    console.error('❌ Error fatal:', error.message);
    process.exit(1);
  });
}

export { mapExistingImages };
