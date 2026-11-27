<script lang="ts">
	import {
		building_pct,
		EmploymentDensity,
		greenspace_pct,
		parking_pct,
		PopulationDensity,
		water_pct
	} from '../../lib/data/transitdata/config.json';
	import DonutMetric from '../../lib/ui/charts/DonutMetric.svelte';
	import GaugeMetric from '../../lib/ui/charts/GaugeMetric.svelte';
	import CustomButton from '../../lib/ui/CustomButton.svelte';
	import TransitMetric from '../../lib/ui/TransitMetric.svelte';
	import './tabs.css';
	import { trTransit } from '../../lib/data/transitdata/labels.fr';
	import { formatNumber, getLang } from '../../lib/i18n';
	let {
		selectedStation,
		stationBuiltForm,
		stationDpiData,
		stationDpiRawData,
		buildingPermitYearData,
		greenspaceVisible = $bindable(),
		waterVisible = $bindable(),
		buildingVisible = $bindable(),
		parkingVisible = $bindable(),
		selectedVariable = $bindable(),
		toggleLayer,
		onSelectVariable
	} = $props();

	const fr = getLang() === 'fr';
	const pct = fr ? '\u00a0%' : '%';
	const num = (n: number) => (fr ? formatNumber(n, undefined, 'fr') : n.toLocaleString());

	const potentialMap: Record<string, number> = {
		'Very High': 10,
		High: 7.5,
		Moderate: 5,
		Low: 2.5,
		'Very Low': 0.25
	};

	const dpiData = $derived(
		stationDpiData?.find((d: any) => String(d.id) === String(selectedStation.id))
	);

	const dpiMetrics = [
		{
			label: fr ? 'Disponibilité des terrains' : 'Land Availability',
			key: 'LALevel',
			icon: 'mdi:land-plots'
		},
		{ label: fr ? 'Pression de croissance' : 'Growth Pressure', key: 'GPLevel', icon: 'mdi:trending-up' },
		{
			label: fr ? 'Risque de déplacement de population' : 'Displacement Risk',
			key: 'DRLevel',
			icon: 'mdi:alert-circle'
		}
	];

	const unitsCreated = $derived(
		stationDpiRawData?.find((d: any) => d.id === selectedStation.id)?.UnitsCreated || 0
	);

	const buildingPermitYear = $derived(
		buildingPermitYearData.find((d: any) => d.id === selectedStation.id)?.year || 0
	);
</script>

<div class="tab-content">
	<div class="metric-container">
		{#each [PopulationDensity, EmploymentDensity] as metric}
			{#if selectedStation[metric.key] !== undefined}
				<TransitMetric
					label={trTransit(metric.label, fr) +
						(metric.unit ? ' (' + trTransit(metric.unit, fr) + ')' : '')}
					active={selectedVariable === metric.key}
					onclick={() => onSelectVariable(selectedVariable !== metric.key ? metric.key : null)}
					value={num(Math.round(selectedStation[metric.key]))}
					icon={metric.icon}
				/>
			{/if}
		{/each}
		{#if unitsCreated > 0}
			<TransitMetric
				disabled
				label={fr
					? `Permis de construction actifs (${buildingPermitYear})`
					: `Active building permits (${buildingPermitYear})`}
				value={num(unitsCreated)}
				icon={'mdi:home'}
			/>{/if}
	</div>
	<div class="metric-container">
		{#each dpiMetrics as metric}
			<TransitMetric
				disabled
				label={metric.label}
				value={dpiData ? trTransit(dpiData[metric.key], fr) : fr ? 's.o.' : 'N/A'}
				icon={metric.icon}
			/>
		{/each}
	</div>
	<div class="metric-container">
		<GaugeMetric
			title={fr
				? 'Potentiel global de développement résidentiel'
				: 'Overall Housing Development Potential'}
			value={potentialMap[dpiData.potential]}
			maxValue={10}
			size={200}
			segmentColors={['#f13737', '#f1c500', '#58e965']}
			label={trTransit(dpiData.potential, fr)}
			showValue={false}
		/>
	</div>
	<div class="metric-container">
		<DonutMetric
			active={waterVisible}
			on:click={() =>
				(waterVisible = toggleLayer(['waterway-built-form', 'water-built-form'], waterVisible))}
			label={trTransit(water_pct.label, fr)}
			value={Math.round(stationBuiltForm[water_pct.key])}
			icon={water_pct.icon}
			suffix={fr ? pct : water_pct.unit}
			fillColor={'#002940'}
			toggle={true}
		/>
		<DonutMetric
			active={greenspaceVisible}
			on:click={() => (greenspaceVisible = toggleLayer('greenspace-built-form', greenspaceVisible))}
			label={trTransit(greenspace_pct.label, fr)}
			value={Math.round(stationBuiltForm[greenspace_pct.key])}
			icon={greenspace_pct.icon}
			suffix={fr ? pct : greenspace_pct.unit}
			fillColor={'#43b171'}
			toggle={true}
		/>
		<DonutMetric
			active={buildingVisible}
			on:click={() => (buildingVisible = toggleLayer('all-buildings', buildingVisible))}
			label={trTransit(building_pct.label, fr)}
			value={Math.round(stationBuiltForm[building_pct.key])}
			icon={building_pct.icon}
			suffix={fr ? pct : building_pct.unit}
			fillColor={'#555555'}
			toggle={true}
		/>
		<DonutMetric
			active={parkingVisible}
			on:click={() => (parkingVisible = toggleLayer('parking-built-form', parkingVisible))}
			label={trTransit(parking_pct.label, fr)}
			value={Math.round(stationBuiltForm[parking_pct.key])}
			icon={parking_pct.icon}
			suffix={fr ? pct : parking_pct.unit}
			fillColor={'#999999'}
			toggle={true}
		/>
	</div>

	<CustomButton
		href="/reports/tod/development-potential"
		label={fr
			? 'Lire le rapport sur le potentiel de développement résidentiel'
			: 'Read the Housing Development Potential Report'}
		color="green"
		className="mt-2 w-full"
	/>
	<CustomButton
		href="/tools/development-potential"
		label={fr
			? 'Essayer l’outil du potentiel de développement résidentiel'
			: 'Try the Housing Development Potential Tool'}
		color="green"
		variant="secondary"
		className="mt-2 w-full"
	/>
	<CustomButton
		href="/tools/urban-form-comparison"
		label={fr ? 'Essayer l’outil du cadre bâti' : 'Try the Built Form Tool'}
		variant="secondary"
		className="mt-2 w-full"
	/>
</div>
