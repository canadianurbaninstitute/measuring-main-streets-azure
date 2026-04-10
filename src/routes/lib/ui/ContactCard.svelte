<script>
	let { link = '', title = '', description = '', disabled = false } = $props();
</script>

{#if disabled}
	<div class="contact-card">
		<h3 class="title">{title}</h3>
		<span class="description uppercase font-medium text-xs text-gray-400">{description}</span>
	</div>
{:else}
	<a href={link} target="_blank">
		<div class="contact-card">
			<h3 class="title">{title}</h3>
			<span class="description uppercase font-medium text-xs text-gray-400">{description}</span>
		</div>
	</a>
{/if}

<style>
	.contact-card {
		border: 1px solid var(--brandDarkBlue);
		padding: 1.5rem;
		margin: 0.75rem;
		border-radius: 10px;
		max-width: 20rem;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}
	.contact-card:hover {
		transform: translateY(-8px);
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
	}
	.contact-card:hover .title {
		color: var(--brandLightBlue);
	}
	.title {
		transition: color 0.3s ease;
	}
	.contact-card:hover .description {
		font-weight: 600;
	}
	.description {
		transition: font-weight 0.3s ease;
	}
</style>
