import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

/** Dev/build config for the component showcase in ./demo — not part of the published package. */
export default defineConfig({
	root: 'demo',
	plugins: [svelte()],
	build: {
		outDir: '../demo-dist',
		emptyOutDir: true
	}
});
