// server/engines/gitEngine.js
import { simpleGit } from 'simple-git';
import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export async function cloneRepository(repoUrl) {
  // Create a unique temporary directory for this scan
  const tmpDir = path.join(process.cwd(), 'tmp', randomUUID());
  await fs.mkdir(tmpDir, { recursive: true });
  
  const git = simpleGit();
  console.log(`📦 Cloning repository: ${repoUrl}...`);
  
  try {
    await git.clone(repoUrl, tmpDir);
    console.log(`✅ Clone complete: ${tmpDir}`);
    return tmpDir;
  } catch (error) {
    console.error(`❌ Failed to clone repository:`, error);
    await cleanupRepository(tmpDir); // Clean up if it fails
    throw new Error("Failed to clone repository. Make sure it is public.");
  }
}

export async function cleanupRepository(dirPath) {
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
    console.log(`🧹 Cleaned up temporary directory: ${dirPath}`);
  } catch (error) {
    console.error(`Failed to clean up directory ${dirPath}:`, error);
  }
}