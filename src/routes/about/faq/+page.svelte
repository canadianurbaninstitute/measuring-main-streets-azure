<script>
	import '../../styles.css';
	import Footer from '../../lib/Footer.svelte';
	import Accordion from '../../lib/ui/Accordion.svelte';
	import Icon from '@iconify/svelte';
</script>

<div class="hero">
	<h1>Frequently Asked Questions</h1>
    <div class="subtitle">
		<h2>Find answers to frequently asked questions below.</h2>
	</div>
</div>

<div class="hero faq">
	<Accordion>
		<div class="accordion-header" accordion slot="header">
			<h4>What is Measuring Main Streets?</h4>
            <Icon icon="iconoir:nav-arrow-down" />
		</div>
		<div class="accordion-body" slot="body">
            <p>
                The Measuring Main Streets platform is a part of the Research Knowledge Initiative program from Infrastructure Canada. It is developed by the Canadian Urban Institute with support from our partners at Environics Analytics and
                Open North.
            </p>
            <p>The platform is constructed around four interrelated components:</p>
            <ul>
                <li>
                an interactive national map of that provides descriptive data for every main street in the country.
                </li>
                <li>
                a set of 30 full case studies across 10 regions (Toronto; Montreal; Edmonton) as well as 30 partial case studies (data only).
                </li>
                <li>
                a set of analytical research briefs and reports that provide sensemaking and point towards potential policy interventions.
                </li>
                <li>
                a set of smart tools and recommendations to inform main street resiliency and future civic infrastructure investment.
                </li>
            </ul>
		</div>
	</Accordion>
    <Accordion>
		<div class="accordion-header" accordion slot="header">
			<h4>What is a 'main street' and how is it defined?</h4>
            <Icon icon="iconoir:nav-arrow-down" />
		</div>
		<div class="accordion-body" slot="body">
            <p>
                The term “main street” represents the commercial and community focal point of a neighbourhood. They offer nearby residents access to shops, retailers, food and drink, and local services.
            </p>
		</div>
	</Accordion>
    <Accordion>
		<div class="accordion-header" accordion slot="header">
			<h4>How did you source your data?</h4>
            <Icon icon="iconoir:nav-arrow-down" />
		</div>
		<div class="accordion-body" slot="body">
            <p>
                Learn more about the process on the <a href="/about">Methodology and Data</a> page.
            </p>
		</div>
	</Accordion>
    <Accordion>
		<div class="accordion-header" accordion slot="header">
			<h4>Who created this project?</h4>
            <Icon icon="iconoir:nav-arrow-down" />
		</div>
		<div class="accordion-body" slot="body">
            <p>
                The Measuring Main Streets platform is a part of the Research Knowledge Initiative program from Infrastructure Canada. It is developed by the Canadian Urban Institute with support from our partners at Environics Analytics and Open North.
            </p>
		</div>
	</Accordion>
    <Accordion>
		<div class="accordion-header" accordion slot="header">
			<h4>What can I use the Main Street Map tool for?</h4>
            <Icon icon="iconoir:nav-arrow-down" />
		</div>
		<div class="accordion-body" slot="body">
            <p>
                Lorem ipsum dolor sit amet.
            </p>
		</div>
	</Accordion>
    <Accordion>
		<div class="accordion-header" accordion slot="header">
			<h4>I can't find my main street on the Main Street Map?</h4>
            <Icon icon="iconoir:nav-arrow-down" />
		</div>
		<div class="accordion-body" slot="body">
            <p>
                Lorem ipsum dolor sit amet.
            </p>
		</div>
	</Accordion>
    <Accordion>
		<div class="accordion-header" accordion slot="header">
			<h4>What is a case study?</h4>
            <Icon icon="iconoir:nav-arrow-down" />
		</div>
		<div class="accordion-body" slot="body">
            <p>
                Lorem ipsum dolor sit amet.
            </p>
		</div>
	</Accordion>
    <Accordion>
		<div class="accordion-header" accordion slot="header">
			<h4>How do I create a case study for my street?</h4>
            <Icon icon="iconoir:nav-arrow-down" />
		</div>
		<div class="accordion-body" slot="body">
            <p>
                Lorem ipsum dolor sit amet.
            </p>
		</div>
	</Accordion>
    <Accordion>
		<div class="accordion-header" accordion slot="header">
			<h4>How did you choose the case study regions and streets?</h4>
            <Icon icon="iconoir:nav-arrow-down" />
		</div>
		<div class="accordion-body" slot="body">
            <p>
                Lorem ipsum dolor sit amet.
            </p>
		</div>
	</Accordion>
    <Accordion>
		<div class="accordion-header" accordion slot="header">
			<h4>What is a report?</h4>
            <Icon icon="iconoir:nav-arrow-down" />
		</div>
		<div class="accordion-body" slot="body">
            <p>
                Lorem ipsum dolor sit amet.
            </p>
		</div>
	</Accordion>
    <Accordion>
		<div class="accordion-header" accordion slot="header">
			<h4>When will the Tools be available?</h4>
            <Icon icon="iconoir:nav-arrow-down" />
		</div>
		<div class="accordion-body" slot="body">
            <p>
                Lorem ipsum dolor sit amet.
            </p>
		</div>
	</Accordion>
    <Accordion>
		<div class="accordion-header" id="last-item" accordion slot="header">
			<h4>Is this program connected to My Main Street?</h4>
            <Icon icon="iconoir:nav-arrow-down" />
		</div>
		<div class="accordion-body" slot="body">
            <p>
                Lorem ipsum dolor sit amet.
            </p>
		</div>
	</Accordion>
</div>

<Footer />

<style>
	p {
		color: var(--brandDarkBlue);
	}

    .hero.faq {
        align-items: stretch;
        margin: 2em;
        width: 70%;

    }

    .accordion-header {
        display: flex;
        align-items: center;
        background-color: white;
        padding: 1em;
        border: 1px solid var(--brandGrey);
        border-bottom: none;
        width: 100%;
    }

    #last-item {
        border-bottom: 1px solid var(--brandGrey);

    }

    .accordion-body {
        padding: 1em;
        border: 1px solid var(--brandGrey);
        border-top: none;
        min-width: 100%;

    }

</style>


