<script>
	import '../../../styles.css';
	import { getLang } from '../../../lib/i18n';

	const fr = getLang() === 'fr';
</script>

<div class="flex flex-col" style="height: 100vh">
	<iframe
		class="grow border-0 w-full"
		title={fr
			? 'Déplacement de population (displacement) | School of Cities'
			: 'Displacement | School of Cities'}
		src="https://schoolofcities.github.io/tod-canada/research/displacement"
	></iframe>
</div>
