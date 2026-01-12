<script>
	import Icon from '@iconify/svelte';
	import config from '../../lib/data/transitdata/config.json';
	import Accordion from '../../lib/ui/Accordion.svelte';
	import LegendAbsolute from '../../lib/ui/legends/LegendAbsolute.svelte';
	import LegendItem from '../../lib/ui/legends/LegendItem.svelte';
	let { activeTab, map, selectedVariable, min, max } = $props();
	let toggledValues = $state({});
</script>

{#if map && (selectedVariable || activeTab === 'housing' || activeTab === 'employment' || activeTab === 'complete-communities')}
	<LegendAbsolute>
		{#if selectedVariable && min !== max}
			<h6 class="font-semibold mb-1">{config[selectedVariable]?.label}</h6>
			<div class="flex flex-col gap-2 mb-2">
				<div
					class="w-full h-4 rounded"
					style="background: linear-gradient(to right, #F5C8D7, #E87CA0, #DB3069, #721433);"
				></div>
				<div>
					<div class="flex justify-between w-full text-xs">
						{#each [{ label: min ?? 0 }, { label: max ?? 0 }] as item}
							<span
								>{config[selectedVariable]?.unit === '$'
									? Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(
											item.label
										)
									: item.label}</span
							>
						{/each}
					</div>
					{#if config[selectedVariable]?.unit && config[selectedVariable]?.unit !== '$'}
						<span class="italic text-xs" my>({config[selectedVariable]?.unit})</span>
					{/if}
				</div>
			</div>
		{/if}
		{#if activeTab === 'housing'}
			<Accordion>
				<div class="inline-header" slot="header">
					<div class="text-sm inline-header">
						Housing Type<Icon icon="iconoir:nav-arrow-down" />
					</div>
				</div>
				<div class="accordion-body" slot="body">
					<div class="text-xs italic">Click on a layer to turn it on or off</div>
					<LegendItem
						{map}
						bind:toggledValues
						id="all-nar"
						variant="circle"
						label="Residential"
						bgcolor="#db3069"
						bordercolor="#fff"
						button={true}
						useFilter={true}
						filterProperty="bu_use"
						filterValue="Residential"
					/>
					<LegendItem
						{map}
						bind:toggledValues
						id="all-nar"
						variant="circle"
						label="Mixed Use"
						bgcolor="#00adf2"
						bordercolor="#fff"
						button={true}
						useFilter={true}
						filterProperty="bu_use"
						filterValue="Partial Residential"
					/>
					<div class="text-xs italic">Size = Number of Units</div>
				</div>
			</Accordion>
		{/if}
		{#if activeTab === 'employment'}
			<Accordion>
				<div class="inline-header" slot="header">
					<div class="text-sm inline-header">
						Employer Type<Icon icon="iconoir:nav-arrow-down" />
					</div>
				</div>
				<div class="accordion-body" slot="body">
					<div class="text-xs mb-3 italic">by Complete Community Tier</div>
					<div class="text-xs italic">Click on a layer to turn it on or off</div>
					<LegendItem
						{map}
						bind:toggledValues
						variant="circle"
						label="Tier 1"
						bgcolor="#db3069"
						bordercolor="#fff"
						button={true}
						useFilter={true}
						filterProperty="Tier"
						filterValue={1}
						id="employment-size"
					/>
					<LegendItem
						{map}
						bind:toggledValues
						variant="circle"
						label="Tier 2"
						bgcolor="#2a5cac"
						bordercolor="#fff"
						button={true}
						useFilter={true}
						filterProperty="Tier"
						filterValue={2}
						id="employment-size"
					/>
					<div class="text-sm italic mt-3">Number of Employees</div>
					<div class="mx-1">
						<img src="/employmentsizelegend.svg" alt="Employment size legend" />
					</div>
				</div>
			</Accordion>
		{/if}
		{#if activeTab === 'complete-communities'}
			<Accordion open={true}>
				<div class="inline-header" slot="header">
					<div class="text-sm inline-header">
						Complete Community Amenities<Icon icon="iconoir:nav-arrow-down" />
					</div>
				</div>
				<div class="accordion-body" slot="body">
					<div class="inline-header text-sm">
						<div class="text-xs">
							<i>Click on a layer to turn it on or off<br /></i>
							Tier 1
						</div>
					</div>
					<div class="accordion-body">
						<LegendItem
							{map}
							bind:toggledValues
							variant="circle"
							label="Childcare"
							bgcolor="#f13737"
							bordercolor="#fff"
							button={true}
							useFilter={true}
							filterProperty="Group Name"
							filterValue="Childcare"
							id="complete-community-amenities"
						/>
						<LegendItem
							{map}
							bind:toggledValues
							variant="circle"
							label="Community Centre"
							bgcolor="#43b171"
							bordercolor="#fff"
							button={true}
							useFilter={true}
							filterProperty="Group Name"
							filterValue="Community Centres"
							id="complete-community-amenities"
						/>
						<LegendItem
							{map}
							bind:toggledValues
							variant="circle"
							label="Convenience Store"
							bgcolor="#db3069"
							bordercolor="#fff"
							button={true}
							useFilter={true}
							filterProperty="Group Name"
							filterValue="Convenience Store"
							id="complete-community-amenities"
						/>
						<LegendItem
							{map}
							bind:toggledValues
							variant="circle"
							label="Library"
							bgcolor="#8a4285"
							bordercolor="#fff"
							button={true}
							useFilter={true}
							filterProperty="Group Name"
							filterValue="Libraries"
							id="complete-community-amenities"
						/>
						<LegendItem
							{map}
							bind:toggledValues
							variant="circle"
							label="Personal and Commercial Banking"
							bgcolor="#f45d01"
							bordercolor="#fff"
							button={true}
							useFilter={true}
							filterProperty="Group Name"
							filterValue="Personal and Commercial Banking"
							id="complete-community-amenities"
						/>
						<LegendItem
							{map}
							bind:toggledValues
							variant="circle"
							label="Pharmacy"
							bgcolor="#f1c500"
							bordercolor="#fff"
							button={true}
							useFilter={true}
							filterProperty="Group Name"
							filterValue="Pharmacy"
							id="complete-community-amenities"
						/>
						<LegendItem
							{map}
							bind:toggledValues
							variant="circle"
							label="Physicians Office"
							bgcolor="#e37d9d"
							bordercolor="#fff"
							button={true}
							useFilter={true}
							filterProperty="Group Name"
							filterValue="Physicians Office"
							id="complete-community-amenities"
						/>
						<LegendItem
							{map}
							bind:toggledValues
							variant="circle"
							label="Post Office"
							bgcolor="#921111"
							bordercolor="#fff"
							button={true}
							useFilter={true}
							filterProperty="Group Name"
							filterValue="Post Office"
							id="complete-community-amenities"
						/>
						<LegendItem
							{map}
							bind:toggledValues
							id="complete-community-amenities"
							variant="circle"
							label="Primary or Secondary School"
							bgcolor="#58e965"
							bordercolor="#fff"
							button={true}
							useFilter={true}
							filterProperty="Group Name"
							filterValue="Primary and Secondary Schools"
						/>
						<LegendItem
							{map}
							bind:toggledValues
							id="complete-community-amenities"
							variant="circle"
							label="Supermarket"
							bgcolor="#23c9ff"
							bordercolor="#fff"
							button={true}
							useFilter={true}
							filterProperty="Group Name"
							filterValue="Supermarket"
						/>
					</div>
					<div class="inline-header text-xs">Tier 2</div>
					<div class="accordion-body">
						<LegendItem
							{map}
							bind:toggledValues
							id={'complete-community-amenities'}
							variant={'circle'}
							label={'Tier 2'}
							bgcolor={'#2a5cac'}
							bordercolor={'#fff'}
							button={true}
							useFilter={true}
							filterProperty="Tier"
							filterValue={2}
						/>
					</div>
				</div>
			</Accordion>
		{/if}
	</LegendAbsolute>
{/if}
