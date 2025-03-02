import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import { createDir, resolveFilePath, searchFilesByExtension } from '../utils.mjs';

const FEATURES_DIR_PATH = 'src/features/';

const filePaths = searchFilesByExtension(resolveFilePath('src', 'features'), '.scss')
  .map(f => `${FEATURES_DIR_PATH}${f.replace(/\\/g, '/')}`);

createDir(resolveFilePath('dist'));

await esbuild.build({
  entryPoints: filePaths,
  outfile: resolveFilePath('dist', 'yte-core.css'),
  plugins: [sassPlugin()],
  bundle: true,
  minify: true,
});
