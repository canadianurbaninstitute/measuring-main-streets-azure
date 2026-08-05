<script>
	const brandColors = [
		['--brandDarkBlue', '#002940'],
		['--brandAltBlue', '#2a5cac'],
		['--brandBlue', '#007aa6'],
		['--brandLightBlue', '#00adf2'],
		['--brandDarkGreen', '#43b171'],
		['--brandGreen', '#58e965'],
		['--brandPink', '#db3069'],
		['--brandRed', '#f13737'],
		['--brandYellow', '#f1c500'],
		['--brandOrange', '#f45d01'],
		['--brandPurple', '#8a4285']
	];

	const scaleNames = ['green', 'blue', 'pink', 'yellow', 'zinc', 'slate'];
	const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
</script>

<section class="section" id="foundations">
	<h2>Foundations</h2>
	<p class="section-intro">
		Design tokens shipped in <code>tokens.css</code>. Import it once in your app and every component
		below reads its colours from these CSS custom properties — override them to re-theme the kit.
	</p>

	<div class="swatch-grid">
		{#each brandColors as [name, value]}
			<div class="swatch">
				<div class="swatch-color" style:background={value}></div>
				<div class="swatch-label">
					{name.replace('--brand', '')}
					<code>{name}</code>
				</div>
			</div>
		{/each}
	</div>

	<div class="demo-card">
		<div class="demo-card-header">
			<h3>Colour scales</h3>
			<p>
				Override Tailwind v4's own <code>--color-{'{name}'}-{'{shade}'}</code> variables, so
				<code>bg-slate-800</code>, <code>text-green-500</code>, etc. render these shades instead of
				stock Tailwind wherever the kit is used alongside Tailwind
			</p>
		</div>
		<div class="demo-card-preview stack">
			{#each scaleNames as scale}
				<div class="scale-row">
					<code class="scale-label">{scale}</code>
					<div class="scale-swatches">
						{#each shades as shade}
							<div
								class="scale-swatch"
								style:background={`var(--color-${scale}-${shade})`}
								title={`--color-${scale}-${shade}`}
							>
								{shade}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="demo-card">
		<div class="demo-card-header">
			<h3>Typography</h3>
			<p>Inter for UI text, Gelasio for serif headings (h2 / h5)</p>
		</div>
		<div class="demo-card-preview stack">
			<div class="type-sample">
				<span class="type-tag">h1</span>
				<h1 style="margin:0">Heading one</h1>
			</div>
			<div class="type-sample">
				<span class="type-tag">h2</span>
				<h2 style="margin:0">Heading two</h2>
			</div>
			<div class="type-sample">
				<span class="type-tag">h3</span>
				<h3 style="margin:0">Heading three</h3>
			</div>
			<div class="type-sample">
				<span class="type-tag">h4</span>
				<h4 style="margin:0">HEADING FOUR</h4>
			</div>
			<div class="type-sample">
				<span class="type-tag">h5</span>
				<h5 style="margin:0">Heading five</h5>
			</div>
			<div class="type-sample">
				<span class="type-tag">p</span>
				<p style="margin:0">Body paragraph text, set in Inter at a fluid size.</p>
			</div>
		</div>
	</div>
</section>
