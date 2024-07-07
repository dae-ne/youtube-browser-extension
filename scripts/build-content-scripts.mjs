import * as esbuild from 'esbuild';
import { resolveFilePath } from './utils';

await esbuild.build({
  entryPoints: [resolveFilePath('extension/youtube-extension.ts')],
  outfile: resolveFilePath('dist/youtube-extension.js'),
  bundle: true,
});
