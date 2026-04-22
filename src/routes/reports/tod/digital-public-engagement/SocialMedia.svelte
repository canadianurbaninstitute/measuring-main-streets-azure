<script>
	import Reddit from '../../assets/logo-reddit.png';
	import Instagram from '../../assets/logo-instagram.png';
	import Bluesky from '../../assets/logo-bsky.png';
	import Facebook from '../../assets/logo-facebook.png';

	let scroll = 0;
</script>

<svelte:window bind:scrollY={scroll} />

<div class="collage">
	<img
		class="img1"
		src={Reddit}
		alt="Reddit logo"
		style:transform={`rotate(-3deg) translate3d(0, ${scroll * 0.09}px, 0)`}
	/>
	<img
		class="img2"
		src={Bluesky}
		alt="Instagram logo"
		style:transform={`rotate(5deg) translate3d(0, ${scroll * 0.05}px, 0)`}
	/>
	<img
		class="img3"
		src={Instagram}
		alt="Bluesky logo"
		style:transform={`rotate(-8deg) translate3d(0, ${scroll * -0.03}px, 0)`}
	/>
	<img
		class="img4"
		src={Facebook}
		alt="Facebook logo"
		style:transform={`rotate(-3deg) translate3d(0, ${scroll * -0.07}px, 0)`}
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
		width: 80%;
		top: -15rem;
		left: 20%;
		z-index: 1;
	}
	.img2 {
		width: 30%;
		top: 8rem;
		right: 0;
		z-index: 2;
	}
	.img3 {
		width: 30%;
		top: 38rem;
		right: 22%;
		z-index: 5;
	}
	.img4 {
		width: 35%;
		top: 46rem;
		left: 15%;
		z-index: 4;
	}
</style>
