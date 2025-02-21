import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import { createDir, resolveFilePath, searchFilesByExtension } from '../utils.mjs';

const FEATURES_DIR_PATH = 'extension/features/';

const filePaths = searchFilesByExtension(resolveFilePath('extension', 'features'), '.scss')
  .map(f => `${FEATURES_DIR_PATH}${f.replace(/\\/g, '/')}`);

createDir(resolveFilePath('dist'));

await esbuild.build({
  entryPoints: filePaths,
  outfile: resolveFilePath('dist', 'youtube-extension-main.css'),
  plugins: [sassPlugin()],
  bundle: true,
  minify: true,
});
