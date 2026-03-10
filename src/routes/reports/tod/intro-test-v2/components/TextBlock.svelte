<script>
  /**
   * TextBlock.svelte
   *
   * A single "step" in the scrollytelling narrative.
   * Renders a text card and exposes a `data-step` attribute so
   * Scroller's IntersectionObserver can track it.
   *
   * Props:
   *   index       {number}  — position in the steps array (required)
   *   active      {boolean} — whether this block is currently in view
   *   eyebrow     {string}  — small label above the heading (optional)
   *   heading     {string}  — section heading (optional)
   *   body        {string}  — paragraph text (required)
   */

  export let index = 0;
  export let active = false;
  export let eyebrow = '';
  export let heading = '';
  export let body = '';
</script>

<div
  class="text-block"
  class:active
  data-step={index}
>
  {#if eyebrow}
    <p class="eyebrow">{eyebrow}</p>
  {/if}

  {#if heading}
    <h2 class="heading">{heading}</h2>
  {/if}

  <p class="body">{body}</p>
</div>

<style>
  .text-block {
    min-height: 80vh;          /* each block is ~one viewport tall */
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 3rem 0;
    opacity: 0.35;
    transform: translateY(8px);
    transition:
      opacity 0.45s ease,
      transform 0.45s ease;
  }

  .text-block.active {
    opacity: 1;
    transform: translateY(0);
  }

  /* First & last blocks get extra padding so content sits comfortably */
  .text-block:first-child {
    padding-top: 40vh;
  }
  .text-block:last-child {
    padding-bottom: 40vh;
  }

  .eyebrow {
    font-family: 'DM Mono', 'Courier New', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #888;
    margin: 0 0 0.6rem;
  }

  .heading {
    font-family: 'Playfair Display', 'Georgia', serif;
    font-size: clamp(1.4rem, 2.5vw, 2rem);
    font-weight: 700;
    color: #111;
    margin: 0 0 1rem;
    line-height: 1.25;
  }

  .body {
    font-family: 'Source Serif 4', 'Georgia', serif;
    font-size: clamp(0.95rem, 1.5vw, 1.1rem);
    color: #333;
    line-height: 1.75;
    margin: 0;
    max-width: 46ch;
  }
</style>
