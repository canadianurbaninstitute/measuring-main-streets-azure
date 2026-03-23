<script lang="ts">
	let {
		score = 0,
		maxScore = 10,
		lowLabel = 'Very Low',
		highLabel = 'Very High',
		colors = ['#f59e0b', '#94a3b8', '#38bdf8']
	}: {
		score?: number;
		maxScore?: number;
		lowLabel?: string;
		highLabel?: string;
		colors?: [string, string] | [string, string, string];
	} = $props();

	const normalizedScore = $derived(Math.max(0, Math.min(1, score / maxScore)));

	const gradient = $derived(
		colors.length === 2
			? `linear-gradient(to right, ${colors[0]}, ${colors[1]})`
			: `linear-gradient(to right, ${colors[0]}, ${colors[1]}, ${colors[2]})`
	);
</script>

<div class="score-bar-wrapper">
	<div class="bar">
		<div class="bar-fill" style="width: {normalizedScore * 100}%; background: {gradient}"></div>
		<div class="bar-dividers" aria-hidden="true">
			<span></span><span></span><span></span><span></span><span></span>
		</div>
	</div>
	<div class="bar-labels">
		<span>{lowLabel}</span>
		<span>{highLabel}</span>
	</div>
</div>

<style>
	.score-bar-wrapper {
		width: 100%;
	}

	.bar {
		width: 100%;
		height: 1rem;
		background-color: #e4e4e7;
		border: 1px solid #d4d4d8;
		border-radius: 2px;
		overflow: hidden;
		position: relative;
		margin-bottom: 0.5rem;
	}

	.bar-fill {
		height: 100%;
		transition: width 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
	}

	.bar-dividers {
		position: absolute;
		inset: 0;
		display: flex;
		pointer-events: none;
	}

	.bar-dividers span {
		flex: 1;
		border-right: 1px solid rgba(255, 255, 255, 0.4);
	}

	.bar-dividers span:last-child {
		border-right: none;
	}

	.bar-labels {
		display: flex;
		justify-content: space-between;
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 700;
		color: #71717a;
	}
</style>
