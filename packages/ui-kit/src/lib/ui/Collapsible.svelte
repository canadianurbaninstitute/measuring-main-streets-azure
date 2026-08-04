<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Collapsible } from 'bits-ui';
	import { cubicOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	let {
		title = '',
		paragraphs = [],
		defaultOpen = false
	}: {
		title?: string;
		paragraphs?: string[];
		defaultOpen?: boolean;
	} = $props();

	let open = $state(defaultOpen);
</script>

<div class="collapsible-wrapper">
	<Collapsible.Root bind:open>
		<p class="description-preview">{paragraphs[0] ?? ''}</p>

		{#if paragraphs.length > 1}
			<Collapsible.Content forceMount>
				{#if open}
					<div transition:slide={{ duration: 300, easing: cubicOut }} class="expanded-content">
						{#each paragraphs.slice(1) as paragraph}
							<p class="description-paragraph">{paragraph}</p>
						{/each}
					</div>
				{/if}
			</Collapsible.Content>

			<Collapsible.Trigger class="collapsible-trigger">
				<span>{open ? 'Show less' : 'Read more'}</span>
				<span class="trigger-icon" class:rotated={open}>
					<Icon icon="mdi:caret-down" />
				</span>
			</Collapsible.Trigger>
		{/if}
	</Collapsible.Root>
</div>

<style>
	.collapsible-wrapper {
		padding: 1rem 0;
	}

	.description-preview {
		margin: 0 0 0.5rem;
		line-height: 1.6;
	}

	.expanded-content {
		overflow: hidden;
	}

	.description-paragraph {
		margin: 0.75rem 0 0;
		line-height: 1.6;
	}

	:global(.collapsible-trigger) {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		margin-top: 0.5rem;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--brandLightBlue);
		transition: opacity 0.2s ease;
	}

	:global(.collapsible-trigger:hover) {
		opacity: 0.8;
	}

	.trigger-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.2s ease;
	}

	.trigger-icon.rotated {
		transform: rotate(180deg);
	}
</style>
