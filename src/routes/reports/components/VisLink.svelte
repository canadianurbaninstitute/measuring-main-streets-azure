<script>
	/**
	 * VisLink.svelte
	 *
	 * Renders a primary call-to-action button (link) inside a visualization panel.
	 *
	 * Props:
	 *   href   {string}  — internal or external URL (required)
	 *   label  {string}  — text to display on the button (default: 'Learn More')
	 *   target {string}  — link target (default: '_blank')
	 */
	import CustomButton from '../../lib/ui/CustomButton.svelte';
	let { href = '', label = 'Learn more', target = '_blank' } = $props();
</script>

<CustomButton {href} {label} {target} className="vis-link" />
