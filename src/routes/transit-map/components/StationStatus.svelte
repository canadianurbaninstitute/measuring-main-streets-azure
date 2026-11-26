<script lang="ts">
	import { trTransit } from '../../lib/data/transitdata/labels.fr';
	import type { ProcessedStation } from '../../lib/data/transitdata/stations';
	import { getLang } from '../../lib/i18n';

	interface Props {
		selectedStation: ProcessedStation;
	}

	let { selectedStation }: Props = $props();
	const fr = getLang() === 'fr';

	const splitTrim = (value: unknown) =>
		typeof value === 'string' ? value.split(',').map((s) => s.trim()) : [];
</script>

<div id="station-container">
	<div>
		<div id="transit-logos">
			{#each splitTrim(selectedStation.line_id) as lineId}
				<img src={`/transit-logos/${lineId}.svg`} alt={fr ? 'logo de la ligne' : 'transit-logo'} class="transit-logo" />
			{/each}
		</div>
		<h3>{selectedStation.stop_label}</h3>
	</div>
	<h4>{trTransit(selectedStation.line_display_name, fr)}</h4>

	<div id="tag-container">
		<div class="tag-list">
			<h6>{fr ? 'Statut :' : 'Status:'}</h6>
			{#each selectedStation.status?.split(', ') || [] as status}
				<div
					class="tag"
					class:bg-green-200={status === 'Existing'}
					class:bg-pink-200={status === 'Planned'}
					class:bg-yellow-200={status === 'Construction'}
				>
					{trTransit(status, fr)}
				</div>
			{/each}
		</div>
		<div class="tag-list">
			<h6>{fr ? 'Technologie :' : 'Technology:'}</h6>
			{#each selectedStation.technology?.split(', ') || [] as technology}
				<div
					class="tag"
					class:bg-blue-200={technology === 'Subway'}
					class:bg-blue-300={technology === 'LRT'}
					class:bg-blue-400={technology === 'Commuter'}
				>
					{trTransit(technology, fr)}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	#station-container {
		padding: 1em 1em 0 1em;
	}
	h4 {
		margin: 0;
		padding: 0.2em 0 0.2em 0;
		overflow-wrap: break-word;
	}
	.tag {
		display: flex;
		justify-content: center;
		padding: 0.25em 1em;
		border: 1px solid #ddd;
		border-radius: 10em;
	}

	.tag-list {
		display: flex;
		align-items: center;
		flex-direction: row;
		gap: 0.5em;
		width: 100%;
		padding: 0.5em 0 0 0;
	}

	#transit-logos {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em;
		margin: 0.5em 0;
	}

	.transit-logo {
		height: 30px;
		width: auto;
		border-radius: 4px;
	}
</style>
