<script>
	import '../../../styles.css';
	import { getLang } from '../../../lib/i18n';

	const fr = getLang() === 'fr';
</script>

<div class="flex flex-col" style="height: 100vh">
	<iframe
		class="grow border-0 w-full"
		title={fr
			? 'Retombées fiscales de l’aménagement axé sur le transport collectif | School of Cities'
			: 'Fiscal Impacts of Transit-Oriented Development | School of Cities'}
		src="https://schoolofcities.github.io/tod-canada/research/fiscal-impacts"
	>
	</iframe>
</div>
