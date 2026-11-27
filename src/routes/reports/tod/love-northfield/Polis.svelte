<script>
	import '../../../styles.css';
	import { getLang } from '../../../lib/i18n';

	const fr = getLang() === 'fr';
</script>

<div class="flex flex-col" style="height: 100vh; width: 100%">
	<iframe
		class="grow border-0 w-full"
		title={fr ? 'Rapport Polis pour Northfield' : 'Polis report for Northfield'}
		src="https://zippy-polis.netlify.app/report/r6zu4ebdspzban9ap2h8j"
	></iframe>
</div>
