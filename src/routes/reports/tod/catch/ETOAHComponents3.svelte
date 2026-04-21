<script>
	import Icon from '@iconify/svelte';
</script>

<div class="infra-card">
	<div class="infra-section public">
		<div class="infra-label">
			<Icon icon="mdi:toolbox" class="icon" />
			<span>A National Inventory of Tools and Best Practices</span>
		</div>
		<div class="infra-meta">
			<p>
				<a href="https://catch-rehac.ca/resources/" target="_blank">Resource Centre</a> compiling best
				practices
			</p>
			<p><a href="https://etoahtoolkit.catch-rehac.ca" target="_blank">Interactive toolkit</a></p>
		</div>
	</div>

	<div class="infra-section local">
		<div class="infra-label">
			<Icon icon="mdi:account-group" class="icon" />
			<span>Structured Support for Local Collaboratives</span>
		</div>
		<div class="infra-meta">
			<p></p>
			<p>Building capacity and alignment between stakeholders</p>
		</div>
	</div>

	<div class="infra-section coop">
		<div class="infra-label">
			<Icon icon="mdi:home" class="icon" />
			<span>Blended Capital Funds for Community Housing</span>
		</div>
		<div class="infra-meta">
			<p>Blending below-market-rate public investment with private capital</p>
		</div>
	</div>
</div>

<style>
	.infra-card {
		padding: 2.5rem;
		background: #ffffff;
		border-radius: 1.5rem;
		/* box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04); */
		width: 100%;
		max-width: 600px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.infra-section {
		width: 100%;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		border-radius: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		transition: transform 0.2s ease;
	}

	.infra-section.public {
		background: var(--color-blue-50);
		border: 2px solid var(--color-blue-400);
		opacity: 0.3;
	}
	.infra-section.local {
		background: var(--color-orange-50);
		border: 2px solid var(--color-orange-500);
		opacity: 0.3;
	}
	.infra-section.coop {
		background: var(--color-green-50);
		border: 2px solid var(--color-green-500);
	}

	.infra-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-size: 1.1rem;
		margin-bottom: 1rem;
	}

	.public .infra-label {
		color: var(--color-blue-900);
	}
	.local .infra-label {
		color: var(--color-orange-900);
	}
	.coop .infra-label {
		color: var(--color-green-900);
	}

	:global(.infra-label .icon) {
		font-size: 1.5rem;
	}

	.infra-meta {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}
	.infra-meta p {
		margin: 0;
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--color-slate-600);
	}

	@media (max-width: 640px) {
		.infra-card {
			padding: 1.5rem;
		}
	}
</style>
