<script lang="ts">
	import { Accordion } from 'bits-ui';
	import CaretDown from 'phosphor-svelte/lib/CaretDown';
	import { cubicOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import type { Station } from '../../lib/data/transitdata/stations';

	interface AIDescription {
		id: string;
		description: string;
	}

	interface Props {
		selectedStation: Station;
		aiDescriptions: AIDescription[];
		activeTab: string;
		isOpen?: boolean;
	}

	let { selectedStation, aiDescriptions, activeTab, isOpen = $bindable(false) }: Props = $props();

	const description = $derived(
		aiDescriptions?.find((desc) => desc?.id === selectedStation?.id)?.description ?? ''
	);

	$effect(() => {
		if (activeTab !== 'demographics') {
			isOpen = false;
		}
	});
</script>

{#if selectedStation && description}
	<div
		id="ai"
		class="ai-description-container rounded-md mx-4 my-2 bg-gray-50 border border-gray-200"
	>
		<Accordion.Root
			value={isOpen ? 'desc' : undefined}
			type="single"
			onValueChange={(val) => (isOpen = val === 'desc')}
		>
			<Accordion.Item value="desc" class="group">
				<Accordion.Trigger
					class="rounded-lg flex px-4 w-full flex-1 select-none items-center justify-between text-[15px] font-medium transition-all [&[data-state=open]>span>svg]:rotate-180"
				>
					<p style="margin-bottom: 4px;">
						<em class="text-xs text-zinc-700">✨ AI-generated summary</em>
					</p>
					<span
						class="hover:bg-dark-10 inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent"
					>
						<CaretDown class="size-[18px] transition-transform duration-200" />
					</span>
				</Accordion.Trigger>
				<Accordion.Content forceMount={true}>
					{#if isOpen}
						<div
							transition:slide={{ duration: 300, easing: cubicOut }}
							class="overflow-hidden text-sm tracking-[-0.01em]"
						>
							<div class="m-4">
								<p class="ai-description-text">{description}</p>
							</div>
						</div>
					{/if}
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</div>
{/if}

<style>
	.ai-description-text {
		font-size: 1em;
	}
</style>
