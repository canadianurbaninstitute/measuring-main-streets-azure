<script>
  /**
   * MapEmissions.svelte
   *
   * Placeholder map visualization.
   * Replace the SVG placeholder with a real map library
   * (e.g. Svelte-Maplibre, D3-geo, Leaflet).
   */

  const countries = [
    { name: 'China',         x: 72, y: 34, r: 36, fill: '#c0392b' },
    { name: 'USA',           x: 20, y: 32, r: 28, fill: '#e74c3c' },
    { name: 'India',         x: 64, y: 42, r: 22, fill: '#e67e22' },
    { name: 'Russia',        x: 60, y: 22, r: 18, fill: '#e67e22' },
    { name: 'Japan',         x: 80, y: 34, r: 12, fill: '#f39c12' },
    { name: 'Germany',       x: 48, y: 26, r: 10, fill: '#f39c12' },
    { name: 'South Korea',   x: 79, y: 37, r:  8, fill: '#f1c40f' },
    { name: 'Iran',          x: 59, y: 37, r:  8, fill: '#f1c40f' },
    { name: 'Canada',        x: 18, y: 24, r: 10, fill: '#f39c12' },
    { name: 'Saudi Arabia',  x: 57, y: 40, r:  9, fill: '#f1c40f' },
  ];
</script>

<svg viewBox="0 0 100 70" width="100%" height="100%" style="max-height:280px">
  <!-- Faint world outline placeholder -->
  <rect x="0" y="0" width="100" height="70" fill="#f7f7f7" rx="2"/>
  <text x="50" y="8" font-size="3.5" fill="#ccc" text-anchor="middle"
        font-family="DM Mono, monospace" letter-spacing="0.3">
    GLOBAL EMISSIONS MAP
  </text>

  <!-- Graticule lines -->
  {#each [20,40,60,80] as lon}
    <line x1={lon} y1="10" x2={lon} y2="65" stroke="#eee" stroke-width="0.3"/>
  {/each}
  {#each [20,35,50] as lat}
    <line x1="5" y1={lat} x2="95" y2={lat} stroke="#eee" stroke-width="0.3"/>
  {/each}

  <!-- Proportional circles -->
  {#each countries as c}
    <circle cx={c.x} cy={c.y} r={c.r * 0.38}
            fill={c.fill} fill-opacity="0.55" stroke={c.fill} stroke-width="0.4"/>
    <text x={c.x} y={c.y + c.r * 0.38 + 3.2}
          font-size="2.4" fill="#555" text-anchor="middle"
          font-family="DM Mono, monospace">
      {c.name}
    </text>
  {/each}

  <!-- Legend -->
  <g transform="translate(4,56)">
    <text font-size="2.2" fill="#aaa" font-family="DM Mono, monospace">
      Circle size = total emissions · Colour = intensity
    </text>
  </g>
</svg>

<style>
  svg { display: block; }
</style>
