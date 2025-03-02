import * as esbuild from 'esbuild';
import { resolveFilePath } from '../utils.mjs';
import sveltePlugin from 'esbuild-svelte';
import { sveltePreprocess } from 'svelte-preprocess';

await esbuild.build({
  entryPoints: [resolveFilePath('src', 'yte.ts')],
  outfile: resolveFilePath('dist', 'yte.js'),
  plugins: [sveltePlugin({ preprocess: sveltePreprocess() })],
  bundle: true,
});
