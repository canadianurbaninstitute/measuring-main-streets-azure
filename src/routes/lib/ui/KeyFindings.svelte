<script>
	import '../../styles.css';
    
    export let number;
	export let finding;
	export let message1;
	export let message2;
	export let message3;
</script>

<div class="graphic-container">
	<div class="finding">
        <h4>Key Finding {number}</h4>
		<h3>{finding}</h3>
	</div>
	<div class="message-container">
		<div class="message">
            <h4>Message 1</h4>
			<p>{message1}</p>
		</div>
		<div class="message">
            <h4>Message 2</h4>
			<p>{message2}</p>
		</div>
		<div class="message">
            <h4>Message 3</h4>
			<p>{message3}</p>
		</div>
	</div>
</div>

<style>
    .graphic-container {
        display: flex;
        flex-direction: column;
        gap: 1em;
        padding: 1em;
        border-radius: 1em;
        background-color: white;
        border: 2px solid #eee;
    }

    .message-container {
        display: flex;
        align-items: stretch;
        gap: 1em;
        border-radius: 1em;
        flex-direction: column;
    }

    .finding {
        padding: 1em;
        border-radius: 1em;
        background-color: var(--brandDarkBlue);
        display: flex;
        flex-direction: column;
        gap: 1em;
    }

    .message {
        padding: 1em;
        border-radius: 1em;
        background-color: var(--brandLightBlue);
        color: white;
    }

    h4 {
        color: white;
        text-transform: uppercase;
        margin: 0;
    }

    h3 {
        color: white;
        font-weight: 400;
        font-size: 1.2em;
        margin: 0;
    }

    @media only screen and (min-width: 768px) {
		.message-container {
			flex-direction: row;

		}
    }

</style>
