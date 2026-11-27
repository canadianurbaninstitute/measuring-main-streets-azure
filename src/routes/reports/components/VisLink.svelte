<script lang="ts">
	import CustomButton from '../../lib/ui/CustomButton.svelte';
	import { getLang } from '../../lib/i18n';

	const fr = getLang() === 'fr';

	interface Props {
		href?: string;
		label?: string;
		target?: string;
	}

	let { href = '', label = fr ? 'En savoir plus' : 'Learn more', target = '_blank' }: Props = $props();
</script>

<CustomButton {href} {label} {target} className="vis-link" />
