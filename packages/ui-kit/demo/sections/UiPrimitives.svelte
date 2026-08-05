<script>
	import {
		Accordion,
		Card,
		Checkbox,
		Collapsible,
		Combobox,
		ContactCard,
		CustomButton,
		FeaturedCard,
		HeroCard,
		HeroStat,
		KeyFindings,
		LanguageSelector,
		Metric,
		ReportCard,
		Select,
		SocialLinks,
		Title,
		TransitMetric
	} from '../../src/lib/index.ts';
	import Demo from '../Demo.svelte';
	import { placeholderImage } from '../placeholder.js';

	let checked = $state(true);
	let selected = $state('toronto');
	let comboSelected = $state('');
	let lang = $state('eng');
	let accordionOpen = $state(false);
	let metricActive = $state(true);

	const cityOptions = [
		{ value: 'toronto', label: 'Toronto' },
		{ value: 'montreal', label: 'Montreal' },
		{ value: 'edmonton', label: 'Edmonton' }
	];
</script>

<section class="section" id="ui-primitives">
	<h2>UI primitives</h2>
	<p class="section-intro">
		Buttons, cards, form controls, and layout pieces used across the site's pages.
	</p>

	<Demo title="CustomButton" description="variant, color, size, icon">
		<CustomButton label="Primary" variant="primary" color="blue" />
		<CustomButton label="Secondary" variant="secondary" color="darkblue" />
		<CustomButton label="Ghost" variant="ghost" color="pink" iconAfterName="mdi:arrow-right" />
		<CustomButton label="Disabled" disabled />
	</Demo>

	<Demo title="Card / HeroCard / ReportCard / FeaturedCard / ContactCard">
		<Card link="#" cardImage={placeholderImage('Main Street')} streetName="Main Street" />
		<HeroCard
			link="#"
			cardImage={placeholderImage('Case Study')}
			title="Case study"
			subtitle="A resilient main street"
		/>
		<ReportCard
			link="#"
			cardImage={placeholderImage('Report')}
			title="Report"
			subtitle="Measuring resiliency"
		/>
		<FeaturedCard
			link="#"
			image={placeholderImage('Featured')}
			title="Featured"
			description="A short summary of the featured content."
			tags={['Mapping', 'Report']}
		/>
		<ContactCard link="#" title="Jane Doe" description="Research Lead" />
	</Demo>

	<Demo title="HeroStat / Metric / TransitMetric / KeyFindings">
		<HeroStat number="72%" subtitle="of main streets are locally owned" />
		<Metric label="Independent businesses" value="72%" icon="mdi:store" />
		<TransitMetric
			label="Transit ridership"
			value="1.2M"
			icon="mdi:train"
			active={metricActive}
			onclick={() => (metricActive = !metricActive)}
		/>
		<KeyFindings
			number="01"
			finding="Independent retail"
			message1="72% of businesses on the corridor are independently owned."
			message2="This is above the citywide average."
			message3="Independent retail correlates with pedestrian activity."
		/>
	</Demo>

	<Demo title="Title" stack>
		<Title name="100 Avenue" location="Edmonton" outline="Case Study" />
	</Demo>

	<Demo title="Accordion" description="named 'header' / 'body' slots" stack>
		<Accordion bind:open={accordionOpen}>
			<strong slot="header">What is a main street?</strong>
			<p slot="body">
				A main street is a commercial corridor that anchors a neighbourhood's economic and social
				life.
			</p>
		</Accordion>
	</Demo>

	<Demo title="Collapsible" stack>
		<Collapsible
			title="Methodology"
			paragraphs={[
				'We measure resiliency using a composite index.',
				'The index combines business diversity, foot traffic, and vacancy rate.',
				'Data is refreshed annually from municipal open data portals.'
			]}
		/>
	</Demo>

	<Demo title="Checkbox">
		<Checkbox bind:checked label="Show satellite layer" icon="mdi:satellite-variant" />
	</Demo>

	<Demo title="Select" description="bits-ui powered single-select">
		<Select data={cityOptions} icon="mdi:city" placeholder="Choose a city" bind:selected />
	</Demo>

	<Demo title="Combobox" description="bits-ui powered searchable combobox">
		<Combobox
			data={cityOptions}
			icon="mdi:magnify"
			placeholder="Search cities"
			handleSelect={(v) => (comboSelected = v)}
			selected={comboSelected}
		/>
	</Demo>

	<Demo title="LanguageSelector">
		<LanguageSelector eng="/en" fr="/fr" bind:selected={lang} />
	</Demo>

	<Demo title="SocialLinks" description="fixed CUI social icon row, no props">
		<SocialLinks />
	</Demo>
</section>
