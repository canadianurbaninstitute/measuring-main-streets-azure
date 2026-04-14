<script>
	import ReportHeader from '../../components/ReportHeader.svelte';
	import ReportFindings from '../../components/ReportFindings.svelte';
	import '../../../styles.css';

	import HeaderImage from './assets/HeaderImage.png';
</script>

<main>
	<ReportHeader
		id="report-header"
		logo={'catch'}
		reporttype="Partner Report"
		subEyebrow="How Communities Can Ensure Transit-Oriented Development Works for Everyone"
		title="TRANSIT WITHOUT DISPLACEMENT"
		subtitle="Inclusive, equitable transit-oriented development is possible with the right approach. As Canada invests billions in transit infrastructure, 
    knowing how to unlock this potential is key."
		backgroundImage={HeaderImage}
	/>

	<ReportFindings
		id="report-findings"
		title="KEY TAKEAWAYS"
		finding1="Transit doesn’t automatically cause displacement."
		description1="Rather, it creates conditions that, without intervention, frequently lead to the erosion of affordability near transit lines."
		finding2="Equitable Transit-Oriented Affordable Housing"
		description2="is an evidence-based framework that makes affordability and inclusion core to the development process."
		finding3="Canada’s housing crisis"
		description3="is a mosaic of local shortages that demands coordinated, place-based solutions."
	/>
</main>
