<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Props {
		checked?: boolean;
		label?: string;
		icon?: string;
		color?: string;
	}

	let { checked = $bindable(false), label = '', icon = '', color = '' }: Props = $props();
</script>

<label class="cursor-pointer group">
	<input type="checkbox" bind:checked class="sr-only" />
	<div
		class="flex items-center px-1.5 py-1.5 md:px-3 md:py-2 rounded-md border transition-all duration-200 text-xs {checked
			? 'bg-gray-100 border-gray-400 shadow-sm'
			: 'bg-white border-gray-200 hover:bg-gray-50'}"
	>
		{#if color}
			<div
				class="w-2.5 h-2.5 rounded-full mr-2 border border-black/10 transition-opacity duration-200"
				style="background-color: {color}; opacity: {checked ? 1 : 0.3};"
			></div>
		{:else if icon}
			<Icon {icon} class="mr-2 opacity-60" />
		{/if}
		<span
			class="truncate {checked
				? 'font-semibold text-gray-900'
				: 'text-gray-600 group-hover:text-gray-900'}"
		>
			{label}
		</span>
	</div>
</label>
