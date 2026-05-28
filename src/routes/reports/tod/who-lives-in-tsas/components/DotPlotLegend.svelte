<script lang="ts">
	interface Props {
		data?: {
			TSANAME?: string;
			CMANAME?: string;
			[key: string]: any;
		} | null;
	}

	let { data = null }: Props = $props();
</script>

<div>
	<div>
		<span class="legend-entry">
			<svg height="20" width="20">
				<circle r="7" cx="10" cy="10" fill="#db3069" />
			</svg>
			— {data?.TSANAME ?? 'Transit Station Area'}
		</span>
	</div>

	<div>
		<span class="legend-entry">
			<svg height="20" width="20">
				<circle r="7" cx="10" cy="10" fill="#00adf2" />
			</svg>
			— {data?.CMANAME ?? 'Region'} (outside TSAs)
		</span>
	</div>
</div>

<style>
	.legend-entry {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	circle {
		stroke: #002940;
		stroke-width: 1px;
	}
</style>
