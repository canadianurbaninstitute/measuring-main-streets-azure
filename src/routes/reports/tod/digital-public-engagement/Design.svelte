<script>
	import design1 from '../../assets/dps-design.png';
	import design2 from '../../assets/dps-design2.png';
	import design3 from '../../assets/dps-design3.png';

	let scroll;
</script>

<svelte:window bind:scrollY={scroll} />

<div class="collage">
	<img
		class="img1"
		src={design1}
		alt="Love Cooksville tool screenshots"
		style:transform={`rotate(-3deg) translate3d(0, ${scroll * 0.06}px, 0)`}
	/>
	<img
		class="img2"
		src={design2}
		alt="Love Cooksville tool screenshots"
		style:transform={`rotate(2deg) translate3d(0, ${scroll * 0.06}px, 0)`}
	/>
	<img
		class="img3"
		src={design3}
		alt="Love Cooksville tool screenshots"
		style:transform={`rotate(3deg) translate3d(0, ${scroll * -0.06}px, 0)`}
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
		height: auto;
	}
	.img1 {
		width: 75%;
		top: -18rem;
		left: 20%;
		z-index: 3;
	}
	.img2 {
		width: 75%;
		top: 8rem;
		left: 30%;
		z-index: 2;
	}
	.img3 {
		width: 75%;
		top: 40rem;
		left: 40%;
		z-index: 1;
	}
</style>
