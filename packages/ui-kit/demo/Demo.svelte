<script>
	let { title, description = '', code = '', stack = false, children } = $props();
</script>

<div class="demo-card">
	<div class="demo-card-header">
		<h3>{title}</h3>
		{#if description}<p>{description}</p>{/if}
	</div>
	<div class="demo-card-preview" class:stack>
		{@render children?.()}
	</div>
	{#if code}
		<pre><code>{code}</code></pre>
	{/if}
</div>
