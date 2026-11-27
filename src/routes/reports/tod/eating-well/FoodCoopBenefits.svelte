<script lang="ts">
	import Icon from '@iconify/svelte';
	import { getLang } from '../../../lib/i18n';

	const fr = getLang() === 'fr';
</script>

<div class="benefits-card">
	<div class="benefits-header">
		<h3>
			{fr
				? 'Les coopératives alimentaires ont pour mission d’offrir des avantages supplémentaires à la collectivité'
				: 'Food co-ops are mission driven to provide additional community benefits'}
		</h3>
		{#if fr}
			<p>
				Une épicerie peut être bien plus qu’un bâtiment où l’on vend des aliments. Parce qu’elles
				sont gérées démocratiquement, les coopératives réinvestissent dans la collectivité qui les
				entoure.
			</p>
		{:else}
			<p>
				Grocery stores can be more than buildings that sell food. Because co-ops are democratically
				run, they reinvest in the surrounding community.
			</p>
		{/if}
	</div>

	<div class="benefits-grid">
		<div class="benefit-item">
			<Icon icon="mdi:account-group" class="icon" />
			<p>{fr ? 'Salles et espaces communautaires dédiés' : 'Dedicated community rooms & space'}</p>
		</div>
		<div class="benefit-item">
			<Icon icon="mdi:silverware-fork-knife" class="icon" />
			<p>{fr ? 'Repas communautaires à petit prix' : 'Inexpensive community meals'}</p>
		</div>
		<div class="benefit-item">
			<Icon icon="mdi:school" class="icon" />
			<p>{fr ? 'Programmes éducatifs et jeunesse' : 'Educational and youth programming'}</p>
		</div>
		<div class="benefit-item">
			<Icon icon="mdi:chef-hat" class="icon" />
			<p>{fr ? 'Formation aux compétences culinaires' : 'Kitchen skills training'}</p>
		</div>
		<div class="benefit-item">
			<Icon icon="mdi:handshake" class="icon" />
			<p>{fr ? 'Partenariats éducatifs avec les écoles' : 'Education partnerships with schools'}</p>
		</div>
		<div class="benefit-item">
			<Icon icon="mdi:heart-outline" class="icon" />
			<p>{fr ? 'Soutien aux organismes sans but lucratif et aux entreprises locales' : 'Support for non-profits & local businesses'}</p>
		</div>
	</div>
</div>

<style>
	.benefits-card {
		padding: 2.5rem;
		background: linear-gradient(135deg, var(--color-green-50) 0%, #ffffff 100%);
		border-left: 4px solid var(--color-green-500);
		border-radius: 0 1.5rem 1.5rem 0;
		box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.08),
			0 10px 10px -5px rgba(0, 0, 0, 0.03);
		width: 100%;
		max-width: 600px;
	}

	h3 {
		font-size: 1.4rem;
		color: var(--color-green-900);
		margin: 0 0 1rem;
		line-height: 1.3;
	}

	.benefits-header p {
		font-size: 1rem;
		color: var(--color-green-700);
		margin: 0 0 2rem;
		line-height: 1.5;
	}

	.benefits-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.25rem;
		margin-bottom: 2rem;
	}

	.benefit-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background: white;
		border: 1px solid var(--color-green-100);
		border-radius: 0.75rem;
		transition: transform 0.2s ease;
	}

	/* .benefit-item:hover {
		transform: translateY(-2px);
		background: #ffffff;
		border-color: rgba(74, 124, 89, 0.3);
	} */

	:global(.benefit-item .icon) {
		font-size: 1.5rem;
		color: var(--color-green-500);
		flex-shrink: 0;
	}

	.benefit-item p {
		margin: 0;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--color-green-900);
		line-height: 1.3;
	}

	@media (max-width: 640px) {
		.benefits-grid {
			grid-template-columns: 1fr;
		}

		.benefits-card {
			padding: 1.5rem;
		}
	}
</style>
