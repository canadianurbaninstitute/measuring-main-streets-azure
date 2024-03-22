<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import '../../styles.css'


	export let portalId;
	export let formId;
	let submitText = 'Submit';
	let region = 'na1';
	const targetElementID = `form-${formId}`;

	onMount(() => {
		handleCreateForm();
		console.log(`component:HubspotFormSvelte ${formId} mounted`);
	});

	const handleCreateForm = () => {
		//@ts-ignore
		if (window.hbspt) {
			//@ts-ignore
			hbspt.forms.create({
				region,
				portalId,
				formId,
				submitText,
				target: '#' + targetElementID,
				css: '' //undocumented but required for iframe styling
			});
		}
	};

	onDestroy(() => {
		console.log(`component:HubspotFormSvelte ${formId} destroyed`);
	});
</script>

<svelte:head>
	<script src="//js.hsforms.net/forms/embed/v2.js">
	</script>
</svelte:head>

<div id={targetElementID} class="base-hubspot-form" />


