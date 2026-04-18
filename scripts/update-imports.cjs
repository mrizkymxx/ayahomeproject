const fs = require('fs/promises');
const path = require('path');

async function processDirectory(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      await processDirectory(fullPath);
    } else if (file.isFile() && fullPath.endsWith('.tsx')) {
      const content = await fs.readFile(fullPath, 'utf-8');
      
      let updated = content.replace(/from\s+['"]([^'"]+)\.jpg['"]/g, "from '$1.webp'");
      // Update string literals like "/src/assets/generated/small-room.jpg"
      updated = updated.replace(/(\/src\/assets\/[^"']+)\.jpg/g, "$1.webp");

      if (content !== updated) {
        await fs.writeFile(fullPath, updated, 'utf-8');
        console.log(`Updated imports in ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, '../src')).catch(console.error);
