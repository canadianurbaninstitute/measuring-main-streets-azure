<script>
	import { Legend, LegendAbsolute, LegendItem } from '../../src/lib/index.ts';
	import Demo from '../Demo.svelte';
</script>

<section class="section" id="legends">
	<h2>Legends</h2>
	<p class="section-intro">
		Standalone legend rows and gradient scales, decoupled from any specific map library — pass a
		<code>map</code> instance directly to <code>LegendItem</code> if you want it to toggle layers.
	</p>

	<Demo title="Legend" description="gradient scale with min/max labels">
		<Legend label="Population density" sublabel="people per km²" minlabel="0" maxlabel="10,000+" />
	</Demo>

	<Demo
		title="LegendAbsolute"
		description="positioned card, supports a gradient + items list"
		stack
	>
		<LegendAbsolute
			title="Land use"
			absolute={false}
			items={[
				{ label: 'Residential', unit: '' },
				{ label: 'Commercial', unit: '' },
				{ label: 'Mixed use', unit: '' }
			]}
		/>
	</Demo>

	<Demo title="LegendItem" description="individual swatches / toggle buttons" stack>
		<LegendItem label="Residential" variant="polygon" bgcolor="#00adf2" />
		<LegendItem label="Commercial" variant="polygon" bgcolor="#db3069" />
		<LegendItem label="Transit line" variant="line" bgcolor="#43b171" />
		<LegendItem label="Toggleable layer (button)" variant="circle" bgcolor="#f1c500" button />
	</Demo>
</section>
