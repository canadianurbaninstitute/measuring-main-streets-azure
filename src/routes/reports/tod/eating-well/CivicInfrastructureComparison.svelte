<script>
	import Icon from '@iconify/svelte';
</script>

<div class="infra-card">
	<div class="infra-section public">
		<div class="infra-label">
			<Icon icon="mdi:gavel" class="icon" />
			<span>Public Grocers</span>
		</div>
		<div class="infra-meta">
			<span class="tag">Top-down</span>
			<p>National-scale infrastructure</p>
			<p>Government-run, publicly owned</p>
		</div>
	</div>

	<div class="flow-arrow down">
		<Icon icon="mdi:arrow-down" />
	</div>

	<div class="infra-center">
		<h4>Affordable alternatives</h4>
		<p>to corporate grocers in transit neighbourhoods across Canada’s urban areas</p>
	</div>

	<div class="flow-arrow up">
		<Icon icon="mdi:arrow-up" />
	</div>

	<div class="infra-section coop">
		<div class="infra-label">
			<Icon icon="mdi:account-group" class="icon" />
			<span>Food Co-ops</span>
		</div>
		<div class="infra-meta">
			<span class="tag">Bottom-up</span>
			<p>Neighbourhood serving</p>
			<p>Community-run, democratically governed</p>
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

	.tag {
		font-size: 0.7rem;
		font-weight: 800;
		text-transform: uppercase;
		padding: 0.2rem 0.6rem;
		border-radius: 100px;
		margin-bottom: 0.5rem;
	}

	.public .tag {
		background: var(--color-blue-600);
		color: #ffffff;
	}

	.coop .tag {
		background: var(--color-green-500);
		color: #ffffff;
	}

	.infra-meta p {
		margin: 0;
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--color-slate-600);
	}

	.flow-arrow {
		font-size: 2rem;
		color: var(--color-blue-800);
		height: 2rem;
		display: flex;
		align-items: center;
	}

	.infra-center {
		width: 100%;
		padding: 2rem;
		background: var(--color-yellow-50);
		border: 2px dashed var(--color-yellow-200);
		border-radius: 1rem;
		text-align: center;
	}

	.infra-center h4 {
		font-size: 1.3rem;
		font-weight: 800;
		color: var(--color-yellow-900);
		margin: 0 0 0.5rem;
	}

	.infra-center p {
		margin: 0;
		font-size: 0.95rem;
		color: var(--color-yellow-800);
		line-height: 1.4;
		max-width: 40ch;
		margin: 0 auto;
	}

	@media (max-width: 640px) {
		.infra-card {
			padding: 1.5rem;
		}

		.infra-center {
			padding: 1.5rem;
		}
	}
</style>
