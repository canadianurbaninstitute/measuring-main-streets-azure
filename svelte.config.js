import azure from 'svelte-adapter-azure-swa';
//import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	//preprocess: vitePreprocess(),
	kit: {
		prerender: {
			handleHttpError: 'warn'
		},
		adapter: azure(),
		paths: {
			// base: process.env.NODE_ENV === "production" ? "/measuring-main-streets" : "",
			// base: "/measuring-main-streets"
		},
	}
};

export default config;
