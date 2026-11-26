<script lang="ts">
	import { getLang } from '../../lib/i18n';
	import { STATUS_FR, TECHNOLOGY_FR } from '../../lib/data/transitdata/labels.fr';

	let { statusFilters = $bindable(), technologyFilters = $bindable() } = $props();
	const fr = getLang() === 'fr';
</script>

<div id="filter-container" class="flex-wrap">
	<div class="filter-group">
		<h6>{fr ? 'Statut :' : 'Status:'}</h6>
		<label
			><input type="checkbox" bind:group={statusFilters} value="Existing" />
			{fr ? STATUS_FR.Existing : 'Existing'}</label
		>
		<label
			><input type="checkbox" bind:group={statusFilters} value="Construction" />
			{fr ? STATUS_FR.Construction : 'Construction'}</label
		>
		<label><input type="checkbox" bind:group={statusFilters} value="Planned" />
			{fr ? STATUS_FR.Planned : 'Planned'}</label>
	</div>

	<div class="filter-group">
		<h6>{fr ? 'Technologie :' : 'Technology:'}</h6>
		<label><input type="checkbox" bind:group={technologyFilters} value="Subway" />
			{fr ? TECHNOLOGY_FR.Subway : 'Subway'}</label>
		<label><input type="checkbox" bind:group={technologyFilters} value="LRT" />
			{fr ? TECHNOLOGY_FR.LRT : 'LRT'}</label>
		<label><input type="checkbox" bind:group={technologyFilters} value="Commuter" />
			{fr ? TECHNOLOGY_FR.Commuter : 'Commuter'}</label
		>
	</div>
</div>

<style>
	#filter-container {
		display: flex;
		flex-direction: column;
		gap: 1em;
		padding: 1em;
	}

	.filter-group {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1em;
	}

	@media only screen and (min-width: 768px) {
		#filter-container {
			flex-grow: 1;
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 1em;
		}
	}

	@media only screen and (max-width: 768px) {
		#filter-container {
			display: none;
		}
	}
</style>
