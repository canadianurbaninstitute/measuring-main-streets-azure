<script>
	import '../../styles.css';
	import { getLang } from '../../lib/i18n';
	const fr = getLang() === 'fr';
</script>

<div class="hero">
	<h1>{fr ? 'Équipe de projet de l’IUC' : 'CUI Project Team'}</h1>
</div>

<div class="card-grid">
	<div>
		<h2><a href="https://canurb.org/team/gregory-spencer/">Gregory Spencer</a></h2>
		<h3>{fr ? 'Direction, Recherche' : 'Director, Research'}</h3>
	</div>

	<div>
		<h2><a href="https://canurb.org/team/jennifer-barrett/">Jennifer Barrett</a></h2>
		<h3>
			{fr
				? 'Directrice générale, Programmes, planification et politiques'
				: 'Managing Director, Programs, Planning and Policy'}
		</h3>
	</div>

	<div>
		<h2><a href="https://www.linkedin.com/in/ananmay-sharan">Ananmay Sharan</a></h2>
		<h3>{fr ? 'Développement Web' : 'Web Developer'}</h3>
	</div>

	<div>
		<h2><a href="https://canurb.org/team/alex-tabascio/">Alex Tabascio</a></h2>
		<h3>{fr ? 'Analyste de données' : 'Data Analyst'}</h3>
	</div>

	<div>
		<h2><a href="https://canurb.org/team/emily-wassmansdorf/">Emily Wassmansdorf</a></h2>
		<h3>{fr ? 'Gestionnaire des communications' : 'Communications Manager'}</h3>
	</div>

	<div>
		<h2><a href="https://canurb.org/team/leandro-santos/">Leandro G. Santos</a></h2>
		<h3>{fr ? 'Urbaniste principal' : 'Senior Planner'}</h3>
	</div>

	<div>
		<h2><a href="https://canurb.org/team/toma-beit-arie/">Toma Beit-Arie</a></h2>
		<h3>{fr ? 'Urbaniste en recherche' : 'Research Planner'}</h3>
	</div>

	<div>
		<h2><a href="https://www.linkedin.com/in/david-scrivener-toronto/">David Scrivener </a></h2>
		<h3>{fr ? 'Recherche de terrain' : 'Field Researcher'}</h3>
	</div>

	<div>
		<h2><a href="https://www.linkedin.com/in/ever-hughes-93ga64/">Ever Hughes </a></h2>
		<h3>{fr ? 'Stagiaire en données' : 'Data Intern'}</h3>
	</div>

	<div>
		<h2><a href="https://www.linkedin.com/in/amanda-ng-2323591a6/">Amanda Ng </a></h2>
		<h3>{fr ? 'Stagiaire en données' : 'Data Intern'}</h3>
	</div>
</div>

<div class="hero">
	<h1>{fr ? 'Partenaires et consultants' : 'Partners & Consultants'}</h1>
</div>

<div class="card-grid">
	<div>
		<h2><a href="https://www.linkedin.com/in/steve-coutts">Steve Coutts</a></h2>
		<h3>{fr ? 'Nord Ouvert' : 'Open North'}</h3>
	</div>

	<div>
		<h2><a href="https://www.linkedin.com/in/sanjida-rabbi/">Sanjida Rabbi</a></h2>
		<h3>{fr ? 'Nord Ouvert' : 'Open North'}</h3>
	</div>

	<div>
		<h2><a href="https://www.linkedin.com/in/neufeldb/">Bronwyn Neufeld </a></h2>
		<h3>{fr ? 'Recherche de terrain' : 'Field Researcher'}</h3>
	</div>

	<div>
		<h2><a href="https://www.linkedin.com/in/elainestam/">Elaine Stam</a></h2>
		<h3>Universe Design Studio</h3>
	</div>
</div>

<style>
	.card-grid {
		display: grid;
		grid-gap: 2em;
		margin: 2em;
		align-items: center;
		justify-content: center;
		grid-template-columns: repeat(1, 1fr);
		overflow: hidden;
	}

	a {
		text-decoration: none;
	}

	@media only screen and (min-width: 768px) {
		.card-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
