<script>
	import '../../styles.css';
	import Footer from '../../lib/ui/Footer.svelte';
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
				The Measuring Main Streets platform is a part of the Research Knowledge Initiative program
				from Housing, Infrastructure and Communities Canada. It is developed by the Canadian Urban
				Institute with support from our partners at Environics Analytics and Open North.
			</p>
			<p>The platform is constructed around four interrelated components:</p>
			<ul>
				<li>
					an interactive national map of that provides descriptive data for every main street in the
					country.
				</li>
				<li>
					a set of 30 full case studies across 10 regions (Toronto; Montreal; Edmonton) as well as
					30 partial case studies (data only).
				</li>
				<li>
					a set of analytical research briefs and reports that provide sensemaking and point towards
					potential policy interventions.
				</li>
				<li>
					a set of smart tools and recommendations to inform main street resiliency and future civic
					infrastructure investment.
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
				The term “main street” represents the commercial and community focal point of a
				neighbourhood. They offer nearby residents access to shops, retailers, food and drink, and
				local services. Our definition of main streets split them into two types, 'high density' and
				'low density' main streets, which were defined based on density thresholds around main
				street businesses and civic infrastructure. Learn more about the methodology we use on the <a
					href="/about">Data and Methodolgy</a
				> page.
			</p>
		</div>
	</Accordion>
	<Accordion>
		<div class="accordion-header" accordion slot="header">
			<h4>Why are main streets important?</h4>
			<Icon icon="iconoir:nav-arrow-down" />
		</div>
		<div class="accordion-body" slot="body">
			<p>
				Main streets are the backbone of Canadian society, with 85% of Canadians living within one
				kilometer of a main street. These streets are home to 280,000 businesses, providing 1.9
				million jobs and generating $300 billion in annual revenue. They also house over 98,000
				community and civic infrastructure assets.
			</p>
			<p>
				Main streets are the cornerstone of ‘complete communities’, where Canadians can live, work,
				and play all within their local neighbourhood. They are our economic powerhouses and social
				connective tissue.
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
				We sourced data from a variety of sources, both open and proprietary. Learn more about the
				specific datasets used on the <a href="/about/data-methodology">Data and Methodolgy</a> page.
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
				The Measuring Main Streets platform is a part of the Research Knowledge Initiative program
				from Housing, Infrastructure and Communities Canada. It is developed by the Canadian Urban
				Institute with support from our partners at Environics Analytics and Open North.
			</p>
		</div>
	</Accordion>
	<Accordion>
		<div class="accordion-header" accordion slot="header">
			<h4>Why can't I find my main street on the Main Street Map?</h4>
			<Icon icon="iconoir:nav-arrow-down" />
		</div>
		<div class="accordion-body" slot="body">
			<p>
				CUI used a rigourous, data backed methodology for our identification of main streets, which
				included continuous iteration and incorporation of feedback from a variety of stakeholders.
				However, incomplete data or analytical errors could lead to your main street being excluded
				from the category of ‘main street’. If you have any further questions or would like to
				identify a missed main street, <a href="/about/contact">contact us.</a> Please note that you
				can still see all of the data associated with your main street using the mapping tool even if
				it is not visually categorized as a main street by the platform.
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
				The Canadian Urban Institute has used Measuring Main Streets data to produce case studies,
				reports, and other deliverables for various partners. If you or your organization may be
				interested in collaborating, please <a href="/about/contact"
					>contact us with your specific enquiry.</a
				>
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
				We conducted 60 case studies in total across the Toronto, Montreal and Edmonton regions, 20
				in each region. 10 of the 20 are full case studies which combine data about the main streets
				with qualitative observation from site visits, whilst the further 10 are data-only. The 20
				main streets were intended to provide a representative sample of types of streets within
				each regional context. This included four downtown (workplace-oriented), four small town,
				and 12 neighourhood (residential-oriented) main streets being chosen, with additional
				emphasis placed on equity-deserving communities.
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
				My Main Street is a $15-million investment from the Government of Canada through the Federal
				Economic Development Agency for Southern Ontario (FedDev Ontario) to spur local economic
				recovery. My Main Street is delivered by the Canadian Urban Institute (CUI) to help support
				the revitalization of neighbourhoods across southern Ontario.
			</p>
			<p>
				The program is not directly connected, however the technical infrastructure generated by the
				Measuring Main Streets project has helped to power the My Main Street program and others at
				the CUI.
			</p>
		</div>
	</Accordion>
</div>

<Footer />

<style>
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
