<script>
	import './demo.css';
	import Charts from './sections/Charts.svelte';
	import Foundations from './sections/Foundations.svelte';
	import Legends from './sections/Legends.svelte';
	import UiPrimitives from './sections/UiPrimitives.svelte';

	const nav = [
		{ group: 'Guide', links: [{ id: 'foundations', label: 'Foundations' }] },
		{
			group: 'Components',
			links: [
				{ id: 'ui-primitives', label: 'UI primitives' },
				{ id: 'legends', label: 'Legends' },
				{ id: 'charts', label: 'Charts' }
			]
		}
	];
</script>

<div class="layout">
	<aside class="sidebar">
		<h1>MMS UI Kit</h1>
		<div class="subtitle">@canadianurbaninstitute/mms-ui-kit</div>
		<nav>
			{#each nav as { group, links }}
				<div class="group-label">{group}</div>
				{#each links as { id, label }}
					<a href={`#${id}`}>{label}</a>
				{/each}
			{/each}
		</nav>
	</aside>

	<main class="content">
		<header>
			<h1 style="margin-bottom:0.2em">Component library</h1>
			<p style="margin:0;color:var(--foreground-alt)">
				Live, browsable reference for every component in the kit. Run
				<code>npm run docs</code> from <code>packages/ui-kit</code> to view this locally, or
				<code>npm run docs:build</code> to produce a static site you can host anywhere.
			</p>
		</header>

		<Foundations />
		<UiPrimitives />
		<Legends />
		<Charts />
	</main>
</div>
