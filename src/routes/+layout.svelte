<script>
	import '../app.css';
	import Footer from './lib/ui/Footer.svelte';
	import TopBar from './lib/ui/TopBar.svelte';
</script>

<svelte:head>
	<link rel="preconnect" href="https://rsms.me/" />
	<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
	<script
		id="cookieyes"
		type="text/javascript"
		src="https://cdn-cookieyes.com/client_data/81adfe725a18120f5ab6d58a/script.js"
	></script>
</svelte:head>

<TopBar />

<slot />

<Footer />
