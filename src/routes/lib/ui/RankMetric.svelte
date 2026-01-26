<script>
	import Icon from '@iconify/svelte';
	export let label = 'National Rank';
	export let value; // The rank number
	export let total = ''; // Optional: out of X
	export let icon = 'mdi:trophy-outline';
	export let iconcolor = '#002a41';
	export let active = false;
	export let disabled = false;
</script>

<div class="rank-metric">
	<div class="rank-container">
		{#if icon}
			<Icon {icon} color={iconcolor} width="3em" />
		{/if}
		<div class="flex items-baseline">
			<span class="hash">#</span>
			<span class="value">{value}</span>
			{#if total}
				<span class="total">/ {total}</span>
			{/if}
		</div>
	</div>

	<div class="details">
		<div class="label">{label}</div>
	</div>
</div>

<style>
	.rank-metric {
		padding: 0.75em;
		border: 1px solid #ddd;
		border-radius: 0.6em;
		display: flex;
		flex-direction: column; /* Stacked for more impact */
		align-items: flex-start;
		background: white;
		width: 100%;
		transition: transform 0.1s ease;
		margin: 0.15em 0;
	}

	.rank-container {
		display: flex;
		width: 100%;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		line-height: 1;
		margin-bottom: 0.2em;
		color: #002a41;
	}

	.value {
		font-size: 3.2em; /* Emphasis on the number */
		font-weight: 800;
		letter-spacing: -0.02em;
	}

	.hash,
	.total {
		font-size: 1.5em;
		margin-left: 0.4em;
		opacity: 0.5;
		font-weight: 400;
	}

	.details {
		width: 100%;
	}

	.label {
		text-align: center;
		font-size: 0.8em;
	}
</style>
