<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Accordion } from 'bits-ui';
	import { cubicOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import TutorialButton from './TutorialButton.svelte';

	let { isOpen = $bindable(), initiateTutorial } = $props();
	let accordionValue: string | null = $state(isOpen ? 'intro' : null);

	$effect(() => {
		accordionValue = isOpen ? 'intro' : null;
	});
</script>

<div class="p-4">
	<Accordion.Root
		value={accordionValue}
		type="single"
		onValueChange={(val) => {
			accordionValue = val;
			isOpen = val === 'intro';
		}}
	>
		<Accordion.Item value="intro">
			<Accordion.Content
				forceMount={true}
				class="transit-map-title overflow-hidden text-sm tracking-[-0.01em]"
			>
				{#if isOpen}
					<div
						transition:slide={{ duration: 300, easing: cubicOut }}
						class="overflow-hidden text-sm tracking-[-0.01em]"
					>
						<Accordion.Header>
							<div id="title" class="flex align-baseline">
								<h1>Transit Map</h1>
								<TutorialButton {initiateTutorial} />
							</div>
						</Accordion.Header>
						<p>
							This is a map of all existing, under construction and planned higher-order transit
							lines in Canada. Search for a station or navigate the map using the controls and then
							click on a transit station to see information associated with it in the panel on the
							left.
						</p>
						<p>
							Data sources: Environics Analytics (2025) and Statistics Canada Census (2021). For
							more detailed information, see <a href="/about/data-methodology/v2/#tod-meth"
								>Data & Methodology.</a
							>
						</p>
						<p>
							Want to compare stations across a transit line? <a href="/tools/transit-charts"
								>Try the Transit Charts tool</a
							>
						</p>
					</div>
				{/if}
			</Accordion.Content>
			<Accordion.Trigger
				id="collapse"
				class="rounded-lg flex w-full flex-1 select-none items-center py-2 justify-between text-[15px] font-medium transition-all
      [&[data-state=open]_.closed]:hidden
      [&[data-state=closed]_.open]:hidden
      [&[data-state=open]>span>svg]:rotate-180"
			>
				<p style="margin-bottom: 0;">Page Description</p>

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
