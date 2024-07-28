import * as esbuild from 'esbuild';
import { resolveFilePath } from '../utils.mjs';

await esbuild.build({
  entryPoints: [resolveFilePath('extension', 'youtube-extension.ts')],
  outfile: resolveFilePath('dist', 'youtube-extension.js'),
  bundle: true,
});
