<script>
	import '../../../styles.css';
	import { getLang } from '../../../lib/i18n';

	const fr = getLang() === 'fr';
</script>

<div class="flex flex-col" style="height: 100vh">
	<iframe
		class="grow border-0 w-full"
		title={fr
			? 'Décarboner les transports grâce à l’aménagement du territoire et aux changements de politiques | School of Cities'
			: 'Decarbonizing Transport through Land Use and Policy Change | School of Cities'}
		src="https://schoolofcities.github.io/tod-canada/research/decarbonization"
	></iframe>
</div>
