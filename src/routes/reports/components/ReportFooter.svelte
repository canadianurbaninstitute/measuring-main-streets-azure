<script>
  export let notes = "";
  export let sources = [];
  export let organization = "";
  export let year = new Date().getFullYear();
</script>

<footer class="report-footer">
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        {#if organization}
          <span class="org">{organization}</span>
        {/if}
        <span class="copy">&copy; {year}</span>
      </div>
      <div class="footer-rule" />
    </div>

    {#if notes}
      <div class="footer-section">
        <h3 class="footer-heading">Notes</h3>
        <p class="footer-text">{notes}</p>
      </div>
    {/if}

    {#if sources.length}
      <div class="footer-section">
        <h3 class="footer-heading">Sources</h3>
        <ol class="sources-list">
          {#each sources as src}
            <li class="footer-text">
              {#if src.url}
                <a href={src.url} target="_blank" rel="noopener">{src.label}</a>
              {:else}
                {src.label}
              {/if}
            </li>
          {/each}
        </ol>
      </div>
    {/if}
  </div>
</footer>

<style>
  .report-footer {
    background-color: var(--color-ink);
    color: var(--color-paper);
    padding: 4rem clamp(1.5rem, 6vw, 6rem);
  }

  .footer-inner {
    max-width: 820px;
  }

  .footer-top {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }

  .footer-brand {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  .org {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .copy {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    opacity: 0.4;
  }

  .footer-rule {
    flex: 1;
    height: 1px;
    background: color-mix(in srgb, var(--color-paper) 15%, transparent);
  }

  .footer-section {
    margin-bottom: 2rem;
  }

  .footer-heading {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-accent);
    margin: 0 0 0.75rem;
  }

  .footer-text {
    font-family: var(--font-body);
    font-size: 0.8rem;
    line-height: 1.7;
    color: color-mix(in srgb, var(--color-paper) 55%, transparent);
    margin: 0;
  }

  .sources-list {
    margin: 0;
    padding-left: 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  a {
    color: inherit;
    text-decoration: underline;
    text-decoration-color: color-mix(in srgb, var(--color-paper) 30%, transparent);
    text-underline-offset: 3px;
  }

  a:hover {
    color: var(--color-paper);
    text-decoration-color: var(--color-accent);
  }
</style>
