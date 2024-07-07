import * as esbuild from 'esbuild';
import { resolveFilePath } from './utils';

await esbuild.build({
  entryPoints: [resolveFilePath('extension/youtube-extension.css')],
  outfile: resolveFilePath('dist/youtube-extension.css'),
  bundle: true,
  minify: true,
});
