import * as esbuild from 'esbuild';
import { resolveFilePath } from '../utils.mjs';
import sveltePlugin from 'esbuild-svelte';
import { sveltePreprocess } from 'svelte-preprocess';

await esbuild.build({
  entryPoints: [resolveFilePath('extension', 'youtube-extension.ts')],
  outfile: resolveFilePath('dist', 'youtube-extension.js'),
  plugins: [sveltePlugin({ preprocess: sveltePreprocess() })],
  loader: { '.svg': 'text' },
  bundle: true,
});
