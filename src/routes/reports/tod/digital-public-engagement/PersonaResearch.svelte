<script>
	import persona1 from '../../assets/dps-persona1.png';
	import persona2 from '../../assets/dps-persona2.png';
	import persona3 from '../../assets/dps-persona3.png';

	let scroll;
</script>

<svelte:window bind:scrollY={scroll} />

<div class="collage">
	<img
		class="img1"
		src={persona1}
		alt="Drawing of an example persona"
		style:transform={`rotate(-3deg) translate3d(0, ${scroll * 0.05}px, 0)`}
	/>
	<img
		class="img2"
		src={persona2}
		alt="Drawing of an example persona"
		style:transform={`rotate(-3deg) translate3d(0, ${scroll * -0.05}px, 0)`}
	/>
	<img
		class="img3"
		src={persona3}
		alt="Drawing of an example persona"
		style:transform={`rotate(-3deg) translate3d(0, ${scroll * -0.06}px, 0)`}
	/>
</div>

<style>
	.collage {
		position: relative;
		width: 100%;
		height: 80vh;
	}
	.collage img {
		position: absolute;
		width: 50%;
		height: auto;
	}
	.img1 {
		width: 55%;
		top: -5rem;
		left: 0;
		z-index: 1;
	}
	.img2 {
		width: 50%;
		top: 20rem;
		right: 0;
		z-index: 2;
	}
	.img3 {
		width: 40%;
		top: 30rem;
		right: 40%;
		z-index: 3;
	}
</style>
