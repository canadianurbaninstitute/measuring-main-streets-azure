<script lang="ts">
	import { quadtree } from 'd3-quadtree';
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import type { Readable } from 'svelte/store';

	const { data, xGet, yGet, width, height } = getContext<{
		data: Readable<any[]>;
		xGet: Readable<(d: any) => number>;
		yGet: Readable<(d: any) => number>;
		width: Readable<number>;
		height: Readable<number>;
	}>('LayerCake');

	interface Props {
		x?: string;
		y?: string;
		searchRadius?: number | undefined;
		dataset?: any[] | undefined;
		children?: Snippet<
			[{ x: number; y: number; found: any; visible: boolean; e: MouseEvent | null }]
		>;
	}

	let {
		x = 'x',
		y = 'y',
		searchRadius = undefined,
		dataset = undefined,
		children
	}: Props = $props();

	let visible = $state(false);
	let found = $state<any>({});
	let e = $state<MouseEvent | null>(null);

	const xGetter = $derived(x === 'x' ? $xGet : $yGet);
	const yGetter = $derived(y === 'y' ? $yGet : $xGet);

	const finder = $derived(
		quadtree<any>()
			.extent([
				[-1, -1],
				[$width + 1, $height + 1]
			])
			.x(xGetter)
			.y(yGetter)
			.addAll(dataset || $data)
	);

	function findItem(evt: MouseEvent) {
		e = evt;

		const xLayerKey = `layer${x.toUpperCase()}` as keyof MouseEvent;
		const yLayerKey = `layer${y.toUpperCase()}` as keyof MouseEvent;

		const mouseX = evt[xLayerKey] as number;
		const mouseY = evt[yLayerKey] as number;

		found = finder.find(mouseX, mouseY, searchRadius) || {};
		visible = Object.keys(found).length > 0;
	}
</script>

<div
	role="button"
	tabindex="0"
	class="bg"
	onmousemove={findItem}
	onmouseout={() => (visible = false)}
	onblur={() => (visible = false)}
></div>

{@render children?.({
	x: found && Object.keys(found).length > 0 ? xGetter(found) : 0,
	y: found && Object.keys(found).length > 0 ? yGetter(found) : 0,
	found,
	visible,
	e
})}

<style>
	.bg {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
</style>
