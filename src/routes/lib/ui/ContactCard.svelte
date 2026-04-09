<script>
	let { link = '', title = '', description = '', disabled = false } = $props();
</script>

{#if disabled}
	<div class="contact-card">
		<h3>{title}</h3>
		<p>{description}</p>
	</div>
{:else}
	<a href={link} target="_blank">
		<div class="contact-card">
			<h3>{title}</h3>
			<p>{description}</p>
		</div>
	</a>
{/if}

<style>
	.contact-card {
		border: 1px solid var(--brandDarkBlue);
		padding: 1rem;
		margin: 0.25rem;
		border-radius: 10px;
	}
</style>
