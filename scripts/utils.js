import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Get the project root directory.
 *
 * @returns {string} The project root directory.
 */
export function getRootDir() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, '../');
}

/**
 * Resolve a file path relative to the project root directory.
 *
 * @param {string} filePath - The file path to resolve.
 * @returns {string} The resolved file path.
 */
export function resolveFilePath(filePath) {
  return path.resolve(getRootDir(), filePath);
}
