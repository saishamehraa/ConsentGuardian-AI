// server/engines/parserEngine.js
import fs from 'fs/promises';
import path from 'path';

export async function extractCodeFiles(dirPath, baseDir = dirPath) {
  let results = [];
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      // Skip irrelevant folders to save time and AI context
      if (['node_modules', '.git', 'dist', 'build', 'public'].includes(entry.name)) {
        continue;
      }
      results = results.concat(await extractCodeFiles(fullPath, baseDir));
    } else {
      // Only parse JavaScript/TypeScript files
      if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) {
        const content = await fs.readFile(fullPath, 'utf-8');
        // Filter out empty files or massive minified files
        if (content.trim().length > 0 && content.length < 50000) {
          results.push({
            file: fullPath.replace(baseDir + path.sep, ''), // Get relative path
            content: content
          });
        }
      }
    }
  }
  return results;
}