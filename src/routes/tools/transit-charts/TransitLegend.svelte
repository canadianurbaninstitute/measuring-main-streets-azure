<script lang="ts">
	let { lineColor = $bindable() } = $props();

	const statuses = [
		{
			name: 'Operational',
			description: 'Station is fully operational'
		},
		{
			name: 'Planned',
			description: 'Station is planned for future development'
		},
		{
			name: 'Construction',
			description: 'Station is currently under construction'
		}
	];
</script>

<div class="border border-gray-200 rounded-lg p-4" style="--lineColor: {lineColor}">
	<h3 class="uppercase pb-2">Station Status Legend</h3>
	<div class="space-y-4">
		<!-- Operational -->
		<div class="flex items-center gap-3">
			<div class="operational w-10 h-6 border-2"></div>
			<div>
				<p class="text-sm font-medium text-gray-900">{statuses[0].name}</p>
				<p class="text-xs text-gray-600">{statuses[0].description}</p>
			</div>
		</div>

		<!-- Planned -->
		<div class="flex items-center gap-3">
			<div class="planned w-10 h-6 border-2 bg-white"></div>
			<div>
				<p class="text-sm font-medium text-gray-900">{statuses[1].name}</p>
				<p class="text-xs text-gray-600">{statuses[1].description}</p>
			</div>
		</div>

		<!-- Construction -->
		<div class="flex items-center gap-3">
			<svg class="w-10 h-6" viewBox="0 0 40 24" preserveAspectRatio="none">
				<defs>
					<pattern
						id="construction-pattern"
						x="0"
						y="0"
						width="8"
						height="8"
						patternUnits="userSpaceOnUse"
					>
						<path
							d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4"
							stroke={lineColor}
							stroke-width="1.5"
							opacity="1"
						/>
					</pattern>
				</defs>
				<rect x="0" y="0" width="40" height="24" fill="url(#construction-pattern)" stroke={lineColor} stroke-width="2" />
			</svg>
			<div>
				<p class="text-sm font-medium text-gray-900">{statuses[2].name}</p>
				<p class="text-xs text-gray-600">{statuses[2].description}</p>
			</div>
		</div>
	</div>
</div>

<style>
	.operational {
		background-color: var(--lineColor);
		border-color: var(--lineColor);
	}

	.planned {
		border-color: var(--lineColor);
	}
</style>