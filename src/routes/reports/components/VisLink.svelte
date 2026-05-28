<script lang="ts">
	import CustomButton from '../../lib/ui/CustomButton.svelte';

	interface Props {
		href?: string;
		label?: string;
		target?: string;
	}

	let { href = '', label = 'Learn more', target = '_blank' }: Props = $props();
</script>

<CustomButton {href} {label} {target} className="vis-link" />
