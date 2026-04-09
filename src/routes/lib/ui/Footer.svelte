<script>
	import canada from '../assets/logos/canada_logo.svg';
	import CATCH from '../assets/logos/CATCH_logo_white.webp';
	import cui from '../assets/logos/cui_logo_white.svg';
	import environics from '../assets/logos/environics_logo.svg';
	import mms from '../assets/logos/mms_logo_white.svg';
	import opennorth from '../assets/logos/opennorth_logo.svg';
	import soc from '../assets/logos/soc_logo.svg';
	import SocialLinks from './SocialLinks.svelte';
</script>

<footer class="modern-footer">
	<div class="footer-top">
		<div class="main-logos">
			<img src={mms} alt="Measuring Main Streets" class="mms-logo" />
			<img src={cui} alt="Canadian Urban Institute" class="cui-logo" />
		</div>
	</div>

	<div class="footer-middle">
		<p class="footer-text">
			The Measuring Main Streets platform was created by the Canadian Urban Institute and is a part
			of the Research Knowledge Initiative of Housing, Infrastructure and Communities Canada.
		</p>
	</div>

	<div class="footer-bottom">
		<div class="partner-logos">
			<img src={canada} alt="Funded by Government of Canada" />
			<img src={environics} alt="Environics Analytics" />
			<img src={soc} alt="School of Cities" />
			<img src={CATCH} alt="Canadian Alliance for Transit-Connected Housing (CATCH)" />
			<img src={opennorth} alt="Open North" />
		</div>

		<div class="social-links-container">
			<SocialLinks />
		</div>
	</div>
</footer>

<style>
	.modern-footer {
		background-color: var(--brandDarkBlue);
		padding: 4rem 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: white;
		gap: 3rem;
	}

	.main-logos {
		display: flex;
		align-items: center;
		gap: 2rem;
	}

	.mms-logo {
		height: 80px;
	}

	.cui-logo {
		height: 80px;
	}

	.footer-text {
		text-align: center;
		max-width: 800px;
		font-size: 0.95rem;
		line-height: 1.6;
		color: #ccc;
		margin: 0;
	}

	.footer-bottom {
		width: 100%;
		max-width: 1200px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
	}

	.partner-logos {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 3rem;
		flex-wrap: wrap;
	}

	.partner-logos img {
		height: 40px;
		filter: brightness(0) invert(1);
		opacity: 0.8;
	}

	.social-links-container {
		display: flex;
		gap: 1rem;
	}

	@media (max-width: 768px) {
		.main-logos {
			flex-direction: column;
			gap: 1rem;
		}
		.partner-logos {
			gap: 2rem;
		}
	}
</style>
