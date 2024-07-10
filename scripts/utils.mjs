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
 * @param {string[]} paths A sequence of paths or path segments.
 * @returns {string} The resolved file path.
 */
export function resolveFilePath(...paths) {
  return path.resolve(getRootDir(), ...paths);
}
