<script>
	import '../../styles.css';
	import SocialLinks from '../../lib/ui/SocialLinks.svelte';
	import { getLang } from '../../lib/i18n';
	const fr = getLang() === 'fr';
</script>

<div class="hero">
	<h1>{fr ? 'Nous joindre' : 'Contact Us'}</h1>
</div>

<div class="hero">
	<div class="subtitle">
		<h2>{fr ? 'Des questions?' : 'Inquiries?'}</h2>
	</div>
	{#if fr}
		<p>
			Écrivez-nous à <a href="mailto:cui@canurb.org?subject=Demande%20-%20Mesures%20des%20rues%20principales"
				>cui@canurb.org</a
			>.
		</p>
	{:else}
		<p>
			Contact us at <a href="mailto:cui@canurb.org?subject=Measuring Main Streets Enquiry"
				>cui@canurb.org</a
			>.
		</p>
	{/if}
</div>

<div class="hero">
	<div class="subtitle">
		<h2>{fr ? 'Infolettre' : 'Newsletter'}</h2>
	</div>
	<div>
		{#if fr}
			<p>
				<a href="https://canurb.org/subscribe/">Abonnez-vous</a> à l’infolettre de l’Institut urbain
				du Canada et suivez-nous sur les médias sociaux.
			</p>
		{:else}
			<p>
				<a href="https://canurb.org/subscribe/">Subscribe</a> to the Canadian Urban Institute newsletter,
				and connect with us on social media.
			</p>
		{/if}
	</div>
	<SocialLinks />
</div>

<br /><br />
