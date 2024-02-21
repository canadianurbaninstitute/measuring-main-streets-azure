<script>
	import Icon from '@iconify/svelte';

	export let section;
	let isChecked = true;

	function toggleLayerOpacity() {
		const markers = document.querySelectorAll(`.marker-${section}`);
		const visibility = isChecked ? 'block' : 'none';
		markers.forEach(marker => {
			marker.style.display = visibility;
		});
	}
</script>

<button class={isChecked ? 'layerOn' : 'layerOff'}>
	<Icon icon="material-symbols:photo" />
	<label>
		<input type="checkbox" bind:checked={isChecked} on:change={toggleLayerOpacity} />
		Photos
	</label>
</button>

<style>
	label {
		padding: 0.4em;
		display: flex;
		align-items: center;
		font-size: 0.88em;
		width: 100%;
	}

	label:hover {
		cursor: pointer;
	}

	input {
		display: none;
	}

	button {
		border: 1px solid rgba(27, 31, 35, 0.3);
		background-color: rgb(250, 251, 252);
		border-radius: 0.5em;
		box-shadow: rgba(27, 31, 35, 0.04) 0px 1px 0px 0px,
			rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;
		opacity: 1;
		display: flex;
		align-items: center;
		margin-top: 0.5em;
		width: 100%;
	}

	.layerOn {
		opacity: 1;
	}

	.layerOff {
		opacity: 0.6;
		border: 1px dashed rgba(27, 31, 35, 0.3);
	}

	button:hover {
		cursor: pointer;
		box-shadow: 0px 1px 0px 0px rgba(27, 31, 35, 0.04),
			inset 0px 1px 0px 0px hsla(0, 0%, 100%, 0.25);
		background-color: #f3f4f6;
		transition: 0.3s;
	}

	button:active {
		box-shadow: 0px 1px 0px 0px rgba(27, 31, 35, 0.04),
			inset 0px 1px 0px 0px hsla(0, 0%, 100%, 0.25), 0px 1px 0px 0px rgba(225, 228, 232, 0.2);
		background-color: #edeff2;
		transition: 0.3s;
	}
</style>
