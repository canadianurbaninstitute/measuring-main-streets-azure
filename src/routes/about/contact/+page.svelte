<script>
	import '../../styles.css';
	import Footer from '../../lib/Footer.svelte';
    import HubspotForm from '../../lib/ui/HubspotForm.svelte'
	import SocialLinks from '../../lib/ui/SocialLinks.svelte';
</script>

<div class="hero">
	<h1>Contact Us</h1>
</div>

<div class="hero">
    <div class="subtitle">
		<h2>Inquiries?</h2>
	</div>
    <p>Contact us at <a href="mailto:cui@canurb.org?subject=Measuring Main Streets Enquiry">cui@canurb.org</a>.</p>
</div>

<div class="hero">
    <div class="subtitle">
		<h2>Newsletter</h2>
	</div>
    <div>
		<p>Subscribe to the Canadian Urban Institute newsletter, and connect with us on social media!</p>
		<HubspotForm      
		portalId="8260137"      
		formId="6697fce8-23ec-49ad-bb8c-b6174d3bebaa"      
	 	/>
	</div>
	<SocialLinks/>
</div>

<Footer/>






