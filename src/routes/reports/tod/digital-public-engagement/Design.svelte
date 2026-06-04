<script>
	import { onMount } from 'svelte';
	import design1 from '../../assets/dps-design.png';
	import design2 from '../../assets/dps-design2.png';
	import design3 from '../../assets/dps-design3.png';

	let scrollY = $state(0);
	let el = $state(null);
	let offsetTop = $state(0);
	let sectionHeight = $state(0);
	let vh = $state(600);

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

	const p1 = $derived((progress - 0.5) * vh * 0.3);
	const p2 = $derived((progress - 0.5) * vh * 0.42);
	const p3 = $derived((progress - 0.5) * vh * -0.4);

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
		src={design1}
		alt="Love Cooksville tool screenshots"
		style:transform={`rotate(-3deg) translate3d(0, ${p1}px, 0)`}
	/>
	<img
		class="img2"
		src={design2}
		alt="Love Cooksville tool screenshots"
		style:transform={`rotate(2deg) translate3d(0, ${p2}px, 0)`}
	/>
	<img
		class="img3"
		src={design3}
		alt="Love Cooksville tool screenshots"
		style:transform={`rotate(3deg) translate3d(0, ${p3}px, 0)`}
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
	.img1 {
		width: 75%;
		top: -10vh;
		left: 10%;
		z-index: 3;
	}
	.img2 {
		width: 75%;
		top: 10vh;
		left: 20%;
		z-index: 2;
	}
	.img3 {
		width: 75%;
		top: 60vh;
		left: 40%;
		z-index: 1;
	}

	@media (max-width: 768px) {
		.img1 {
			width: 75%;
			top: 2vh;
			left: -5%;
			z-index: 3;
		}
		.img2 {
			width: 75%;
			top: 14vh;
			right: 20%;
			z-index: 2;
		}
		.img3 {
			width: 75%;
			top: 28vh;
			left: 0%;
			z-index: 1;
		}
	}
</style>
