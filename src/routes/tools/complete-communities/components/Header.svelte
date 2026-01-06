<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Accordion } from 'bits-ui';
	import { cubicOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	let { isOpen } = $props();
	let accordionValue: string | null = $state('intro');
</script>

<div class="p-4">
	<Accordion.Root
		bind:value={accordionValue}
		type="single"
		onValueChange={(val) => (isOpen = val === 'intro')}
	>
		<Accordion.Item value="intro">
			<Accordion.Content forceMount={true} class="overflow-hidden text-sm tracking-[-0.01em]">
				{#if isOpen}
					<div
						transition:slide={{ duration: 300, easing: cubicOut }}
						class="overflow-hidden text-sm tracking-[-0.01em]"
					>
						<Accordion.Header>
							<div id="title">
								<h1>Complete Communities</h1>
							</div>
						</Accordion.Header>
						<p>
							This tool examines the presence and access of key community amenities to assess
							current completeness and future needs.
						</p>
						<p class="text-sm mt-4">
							<em>This tool is in beta.</em>
						</p>
					</div>
				{/if}
			</Accordion.Content>
			<Accordion.Trigger
				class="rounded-lg flex w-full flex-1 select-none items-center py-2 justify-between text-[15px] font-medium transition-all
      [&[data-state=open]_.closed]:hidden
      [&[data-state=closed]_.open]:hidden
      [&[data-state=open]>span>svg]:rotate-180"
			>
				<p>Page Description</p>

				<span
					class="hover:bg-dark-10 inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent"
				>
					<Icon icon="mdi:caret-down" class="size-[18px] transition-transform duration-200" />
				</span>
			</Accordion.Trigger>
		</Accordion.Item>
	</Accordion.Root>
</div>

<style>
	#title {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1em;
	}
</style>
