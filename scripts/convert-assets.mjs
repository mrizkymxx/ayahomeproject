import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.resolve(__dirname, '../src/assets');

async function getAllFiles(dir, fileList = []) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      await getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

async function convertJpgToWebp() {
  console.log(`Scanning assets directory: ${ASSETS_DIR}`);
  const files = await getAllFiles(ASSETS_DIR);
  const jpgFiles = files.filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'));

  console.log(`Found ${jpgFiles.length} JPG files to convert.`);

  let savedBytes = 0;

  for (const file of jpgFiles) {
    const ext = path.extname(file);
    const newFilePath = file.slice(0, -ext.length) + '.webp';
    
    try {
      const originalStat = await fs.stat(file);
      await sharp(file)
        .webp({ quality: 80, effort: 6 })
        .toFile(newFilePath);
      
      const newStat = await fs.stat(newFilePath);
      const savings = originalStat.size - newStat.size;
      savedBytes += savings;
      
      console.log(`✅ Converted: ${path.basename(file)} -> ${path.basename(newFilePath)} (Saved: ${(savings / 1024).toFixed(2)} KB)`);
      
      // Delete original
      await fs.unlink(file);
    } catch (err) {
      console.error(`❌ Failed to convert ${path.basename(file)}:`, err.message);
    }
  }

  console.log(`\n🎉 WebP Conversion Complete!`);
  console.log(`Total data saved: ${(savedBytes / 1024 / 1024).toFixed(2)} MB`);
}

convertJpgToWebp().catch(console.error);
