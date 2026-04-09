<!-- UI component that displays a set of social media icons.-->
<script>
	import Icon from '@iconify/svelte';
</script>

<div id="social-links">
	<a href="https://ca.linkedin.com/company/canadian-urban-institute" aria-label="LinkedIn"
		><Icon icon="fa6-brands:linkedin" width="2em" height="2em" style="color:#00adf2" /></a
	>
	<a href="https://www.instagram.com/canadianurbaninstitute/" aria-label="Instagram"
		><Icon icon="fa6-brands:instagram" width="2em" height="2em" style="color:#00adf2" /></a
	>
</div>

<style>
	a {
		text-decoration: none;
	}

	#social-links {
		display: flex;
		flex-direction: row;
		gap: 1em;
		margin: 1em 0 1em 0;
	}
</style>
