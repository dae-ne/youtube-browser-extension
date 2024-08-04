import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import {
  createDir,
  createFile,
  removeFile,
  resolveFilePath,
  searchFilesByExtension
} from '../utils.mjs';

const ENTRYPOINT_FILE_NAME = 'entrypoint.scss';

const filePaths = searchFilesByExtension(resolveFilePath('extension', 'features'), '.scss');
const entrypointContent = filePaths.map((file) => {
  const forwardSlashFilePath = file.replace(/\\/g, '/');
  return `@import "../extension/features/${forwardSlashFilePath}";`
}).join('\n');

createDir(resolveFilePath('dist'));
createFile(resolveFilePath('dist', ENTRYPOINT_FILE_NAME), entrypointContent);

await esbuild.build({
  entryPoints: [resolveFilePath('dist', ENTRYPOINT_FILE_NAME)],
  outfile: resolveFilePath('dist', 'youtube-extension.css'),
  plugins: [sassPlugin()],
  bundle: true,
  minify: true,
});

removeFile(resolveFilePath('dist', ENTRYPOINT_FILE_NAME));
