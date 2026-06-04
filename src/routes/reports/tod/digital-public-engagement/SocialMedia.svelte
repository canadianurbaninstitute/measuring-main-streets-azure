<script>
	import { onMount } from 'svelte';
	import Bluesky from '../../assets/logo-bsky.png';
	import Facebook from '../../assets/logo-facebook.png';
	import Instagram from '../../assets/logo-instagram.png';
	import Reddit from '../../assets/logo-reddit.png';

	let scrollY = $state(0);
	let el = $state(null);
	let offsetTop = $state(0);
	let sectionHeight = $state(0);
	let vh = $state(600);

	// Measure the whole scroller section so progress spans the full reading range,
	// not just one viewport height. Neutral (0.5) falls at the midpoint of reading.
	function measure() {
		if (!el) return;
		vh = window.innerHeight;
		const section = el.closest('.scroller-layout') ?? el;
		offsetTop = section.getBoundingClientRect().top + window.scrollY;
		sectionHeight = section.offsetHeight;
	}

	const progress = $derived(
		Math.max(0, Math.min(1, (scrollY - offsetTop + vh) / (sectionHeight + vh)))
	);

	const p1 = $derived((progress - 0.5) * vh * 0.50);
	const p2 = $derived((progress - 0.5) * vh * 0.50);
	const p3 = $derived((progress - 0.5) * vh * -0.20);
	const p4 = $derived((progress - 0.5) * vh * -0.35);

	onMount(() => {
		measure();
		window.addEventListener('resize', measure, { passive: true });
		return () => window.removeEventListener('resize', measure);
	});
</script>

<svelte:window bind:scrollY />

<div class="collage" bind:this={el}>
	<img
		class="img1"
		src={Reddit}
		alt="Reddit logo"
		style:transform={`rotate(-3deg) translate3d(0, ${p1}px, 0)`}
	/>
	<img
		class="img2"
		src={Bluesky}
		alt="Bluesky logo"
		style:transform={`rotate(5deg) translate3d(0, ${p2}px, 0)`}
	/>
	<img
		class="img3"
		src={Instagram}
		alt="Instagram logo"
		style:transform={`rotate(-8deg) translate3d(0, ${p3}px, 0)`}
	/>
	<img
		class="img4"
		src={Facebook}
		alt="Facebook logo"
		style:transform={`rotate(-3deg) translate3d(0, ${p4}px, 0)`}
	/>
</div>

<style>
	.collage {
		overflow: hidden;
		position: relative;
		width: 100%;
		height: 80vh;
	}
	.collage img {
		position: absolute;
		height: auto;
	}

	/* Shifted down ~10vh to centre the cluster in the sticky panel */
	.img1 { width: 80%; top: 10vh; left: 20%; z-index: 1; }
	.img2 { width: 30%; top: 24vh; right: 0;   z-index: 2; }
	.img3 { width: 30%; top: 40vh; right: 22%; z-index: 5; }
	.img4 { width: 35%; top: 52vh; left: 15%;  z-index: 4; }

	@media (max-width: 768px) {
		.img1 { width: 50%; top: 2vh;  left: 0; }
		.img2 { width: 40%; top: 10vh; right: 0; }
		.img3 { width: 35%; top: 22vh; right: 35%; z-index: 3; }
		.img4 { width: 40%; top: 32vh; left: 5%; }
	}
</style>
