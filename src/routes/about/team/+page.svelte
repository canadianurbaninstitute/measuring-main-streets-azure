<script>
	import '../../styles.css';
	import Footer from '../../lib/Footer.svelte';
	import Icon from '@iconify/svelte';
</script>

<div class="hero">
	<h1>Team</h1>

</div>

<div class="card-grid">

<div>
	<h2><a href='https://canurb.org/team/gregory-spencer/'>Gregory Spencer</a></h2>
	<h3>Director, Research</h3>
</div>

<div>
	<h2><a href='https://canurb.org/team/jennifer-barrett/'>Jennifer Barrett</a></h2>
	<h3>Managing Director, Programs, Planning and Policy</h3>
</div>

<div>
	<h2><a href='https://canurb.org/team/alex-tabascio/'>Alex Tabascio</a></h2>
	<h3>Data Analyst</h3>
</div>

<div>
	<h2><a href='https://canurb.org/team/ananmay-sharan/'>Ananmay Sharan</a></h2>
	<h3>Web Developer & Data Analyst</h3>
</div>

<div>
	<h2><a href='https://canurb.org/team/emily-wassmansdorf/'>Emily Wassmansdorf</a></h2>
	<h3>Communications Manager</h3>
</div>

<div>
	<h2><a href='https://canurb.org/team/leandro-santos/'>Leandro G. Santos</a></h2>
	<h3>Senior Planner</h3>
</div>

<div>
	<h2><a href='https://canurb.org/team/toma-beit-arie/'>Toma Beit-Arie</a></h2>
	<h3>Research Planner</h3>
</div>


<div>
	<h2><a href='https://www.linkedin.com/in/david-scrivener-toronto/'>David Scrivener	</a></h2>
	<h3>Field Researcher</h3>
</div>

<div>
	<h2><a href='https://www.linkedin.com/in/neufeldb/'>Bronwyn Neufeld </a></h2>
	<h3>Field Researcher</h3>
</div>

<div>
	<h2><a href='https://www.linkedin.com/in/ever-hughes-93ga64/'>Ever Hughes </a></h2>
	<h3>Data Intern</h3>
</div>

<div>
	<h2><a href='https://www.linkedin.com/in/amanda-ng-2323591a6/'>Amanda Ng </a></h2>
	<h3>Data Intern</h3>
</div>

<div>
	<h2><a href='https://www.linkedin.com/in/elainestam/'>Elaine Stam</a></h2>
	<h3>Graphic Designer</h3>
</div>

</div>


<Footer/>

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

/*DESKTOP*/

@media only screen and (min-width: 768px) {
	.card-grid {
		grid-template-columns: repeat(2, 1fr);
	}


}


</style>