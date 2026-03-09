<script>
	import ReportHeader from '../../components/ReportHeaderTest.svelte';
	import ScrollSection from '../../components/TestScrollSection.svelte';
	import TextBlock from '../../components/TextBlock.svelte';
	import ReportFooter from '../../components/ReportFooter.svelte';

	// Sample data
	const barData = [
		{ label: '2019', value: 42 },
		{ label: '2020', value: 58 },
		{ label: '2021', value: 73 },
		{ label: '2022', value: 69 },
		{ label: '2023', value: 91 },
		{ label: '2024', value: 107 }
	];

	const lineData = [
		{ x: 'Jan', y: 12 },
		{ x: 'Feb', y: 18 },
		{ x: 'Mar', y: 15 },
		{ x: 'Apr', y: 27 },
		{ x: 'May', y: 33 },
		{ x: 'Jun', y: 29 },
		{ x: 'Jul', y: 41 },
		{ x: 'Aug', y: 38 },
		{ x: 'Sep', y: 52 },
		{ x: 'Oct', y: 48 },
		{ x: 'Nov', y: 61 },
		{ x: 'Dec', y: 74 }
	];
</script>

<svelte:head>
	<title>Scrollytelling Report Template</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link
		href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=IBM+Plex+Mono:wght@400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main>
	<!-- ① Header -->
	<ReportHeader
		title="The State of Something Important"
		subtitle="A deep dive into trends, patterns, and what they mean for the decade ahead — told through data and narrative."
		byline="Your Name"
		date="March 2026"
	/>

	<!-- ② Section 1: bar chart on left, text on right -->
	<ScrollSection sectionNumber={1} label="Annual Output">
		<svelte:fragment slot="chart" let:progress></svelte:fragment>

		<svelte:fragment slot="text">
			<TextBlock eyebrow="Context" heading="Where we started">
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco.
				</p>
				<p>
					<strong>The numbers tell a clear story.</strong> After the disruption of 2020, the recovery
					was swift and the subsequent growth has been remarkable, outpacing earlier projections by nearly
					20%.
				</p>
			</TextBlock>

			<TextBlock eyebrow="Turning point" heading="The 2021 inflection">
				<p>
					Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
					nulla pariatur. Excepteur sint occaecat cupidatat non proident.
				</p>
				<p>
					Several structural factors converged to create this inflection point. What followed was a
					sustained period of expansion that has since redefined the baseline.
				</p>
			</TextBlock>

			<TextBlock eyebrow="Now" heading="The 2024 peak">
				<p>
					Sunt in culpa qui officia deserunt mollit anim id est laborum. At vero eos et accusamus et
					iusto odio dignissimos ducimus qui blanditiis.
				</p>
			</TextBlock>
		</svelte:fragment>
	</ScrollSection>

	<!-- Divider -->
	<div class="section-divider" />

	<!-- ③ Section 2: line chart, reversed layout -->
	<ScrollSection sectionNumber={2} label="Monthly trend" reverse>
		<svelte:fragment slot="chart" let:progress></svelte:fragment>

		<svelte:fragment slot="text">
			<TextBlock eyebrow="Seasonality" heading="Patterns within the year">
				<p>
					Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet
					ut et voluptates repudiandae sint et molestiae non recusandae.
				</p>
				<p>
					The monthly breakdown reveals a consistent Q4 surge that accounts for roughly <strong
						>35% of annual totals</strong
					>. This is not a new phenomenon, but its magnitude in 2024 was unprecedented.
				</p>
			</TextBlock>

			<TextBlock eyebrow="Analysis" heading="Reading the curve">
				<p>
					Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores
					alias consequatur aut perferendis doloribus asperiores repellat.
				</p>
				<p>
					The plateaus in April and October suggest external throttles — likely regulatory cycles —
					before each subsequent push higher.
				</p>
			</TextBlock>
		</svelte:fragment>
	</ScrollSection>

	<!-- ④ Footer -->
	<ReportFooter
		organization="Your Organization"
		year={2026}
		notes="All figures are illustrative and for template demonstration purposes only."
		sources={[
			{ label: 'Primary Dataset, Example Institute (2024)' },
			{ label: 'Monthly Tracker, Open Data Project', url: 'https://example.com' }
		]}
	/>
</main>

<style>
	/* ── Design tokens ─────────────────────────────────── */
	:global(:root) {
		--color-ink: #121212;
		--color-paper: #f5f2ed;
		--color-rule: #ddd9d2;
		--color-accent: #c0392b;
		--color-accent2: #2471a3;

		--font-display: 'Playfair Display', Georgia, serif;
		--font-body: 'Source Serif 4', Georgia, serif;
		--font-mono: 'IBM Plex Mono', 'Courier New', monospace;
	}

	:global(*, *::before, *::after) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(html) {
		scroll-behavior: smooth;
	}

	:global(body) {
		background: var(--color-paper);
		color: var(--color-ink);
		-webkit-font-smoothing: antialiased;
	}

	main {
		width: 100%;
		overflow-x: hidden;
	}

	.section-divider {
		height: 1px;
		background: var(--color-rule);
		margin: 0 clamp(1.5rem, 6vw, 6rem);
	}
</style>
