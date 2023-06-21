<script>
    import { onMount } from 'svelte';
  
    let sectionData = [];
  
    onMount(() => {
      // Retrieve section data from the DOM based on data-id attributes
      const sections = document.querySelectorAll('[data-id]');
      sectionData = Array.from(sections).map((section, index) => ({
        id: section.getAttribute('data-id'),
        title: section.querySelector('h2').textContent,
        number: index + 1
      }));
    });
  </script>
  
  <section>
    <style>
      .toc {
        padding: 2em;
        color: var(--brandLightBlue);
        text-align: center;
        position: relative;
        border: solid 1px var(--brandLightBlue);
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 1);
        list-style-type: none;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        flex-wrap: wrap;
        width:15vw;
      }
  
      .toc li {
        margin-bottom: 0.5rem;
      }
  
      .toc a {
        color: var(--brandLightBlue);
        text-decoration: none;
      }

    </style>
  
    <ul class="toc">
      {#each sectionData as section}
        <li>
          <span class="toc-number">{section.number}.</span>
          <a href={`#${section.id}`}>{section.title}</a>
        </li>
      {/each}
    </ul>
  </section>
  