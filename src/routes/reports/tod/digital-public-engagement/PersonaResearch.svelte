<script>
	import { onMount } from 'svelte';
	import persona1 from '../../assets/dps-persona1.png';
	import persona2 from '../../assets/dps-persona2.png';
	import persona3 from '../../assets/dps-persona3.png';

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

	const p1 = $derived((progress - 0.5) * vh * 0.4);
	const p2 = $derived((progress - 0.5) * vh * -0.35);
	const p3 = $derived((progress - 0.5) * vh * -0.5);

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
		src={persona1}
		alt="Drawing of an example persona"
		style:transform={`rotate(-3deg) translate3d(0, ${p1}px, 0)`}
	/>
	<img
		class="img2"
		src={persona2}
		alt="Drawing of an example persona"
		style:transform={`rotate(-3deg) translate3d(0, ${p2}px, 0)`}
	/>
	<img
		class="img3"
		src={persona3}
		alt="Drawing of an example persona"
		style:transform={`rotate(-3deg) translate3d(0, ${p3}px, 0)`}
	/>
</div>

<style>
	.collage {
		position: relative;
		width: 100%;
		height: 80vh;
		overflow: hidden;
	}
	.collage img {
		position: absolute;
		height: auto;
	}
	.img1 {
		width: 55%;
		top: 15vh;
		left: 0;
		z-index: 1;
	}
	.img2 {
		width: 50%;
		top: 20vh;
		right: 0;
		z-index: 2;
	}
	.img3 {
		width: 40%;
		top: 40vh;
		right: 40%;
		z-index: 3;
	}

	@media (max-width: 768px) {
		.img1 {
			width: 50%;
			top: 2vh;
			left: 0;
		}
		.img2 {
			width: 40%;
			top: 22vh;
			right: 0;
		}
		.img3 {
			width: 35%;
			top: 40vh;
			right: 35%;
		}
	}
</style>
