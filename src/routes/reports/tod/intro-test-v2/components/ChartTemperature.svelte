<script>
  /**
   * ChartTemperature.svelte
   *
   * A simple SVG bar chart showing temperature anomalies.
   * Replace with your real chart library (e.g. LayerCake, D3, Chart.js).
   */

  // Synthetic temperature anomaly data (°C relative to 1951–1980 baseline)
  const data = [
    { year: 1960, anomaly: -0.02 },
    { year: 1965, anomaly: -0.10 },
    { year: 1970, anomaly:  0.02 },
    { year: 1975, anomaly: -0.01 },
    { year: 1980, anomaly:  0.26 },
    { year: 1985, anomaly:  0.12 },
    { year: 1990, anomaly:  0.45 },
    { year: 1995, anomaly:  0.38 },
    { year: 2000, anomaly:  0.42 },
    { year: 2005, anomaly:  0.68 },
    { year: 2010, anomaly:  0.72 },
    { year: 2015, anomaly:  0.90 },
    { year: 2020, anomaly:  1.02 },
    { year: 2023, anomaly:  1.17 },
  ];

  const W = 480, H = 300;
  const pad = { top: 24, right: 20, bottom: 36, left: 44 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const minA = Math.min(...data.map(d => d.anomaly));
  const maxA = Math.max(...data.map(d => d.anomaly));

  const xScale = (i) => (i / (data.length - 1)) * innerW;
  const yScale = (v) => innerH - ((v - minA) / (maxA - minA)) * innerH;
  const zeroY  = yScale(0);

  const barW = (innerW / data.length) * 0.65;

  function barColour(v) {
    if (v >= 0.8)  return '#c0392b';
    if (v >= 0.4)  return '#e67e22';
    if (v >= 0)    return '#f1c40f';
    return '#3498db';
  }
</script>

<svg viewBox="0 0 {W} {H}" width="100%" height="100%" style="max-height:280px">
  <g transform="translate({pad.left},{pad.top})">

    <!-- Zero baseline -->
    <line
      x1="0" y1={zeroY}
      x2={innerW} y2={zeroY}
      stroke="#ccc" stroke-width="1" stroke-dasharray="4 3"
    />

    <!-- Bars -->
    {#each data as d, i}
      {@const x = xScale(i) - barW / 2}
      {@const y = d.anomaly >= 0 ? yScale(d.anomaly) : zeroY}
      {@const h = Math.abs(yScale(d.anomaly) - zeroY)}
      <rect
        x={x} y={y}
        width={barW} height={h}
        fill={barColour(d.anomaly)}
        rx="1"
      />
    {/each}

    <!-- X axis labels -->
    {#each data as d, i}
      {#if i % 3 === 0}
        <text
          x={xScale(i)} y={innerH + 20}
          font-size="10" fill="#888" text-anchor="middle"
          font-family="DM Mono, monospace"
        >{d.year}</text>
      {/if}
    {/each}

    <!-- Y axis labels -->
    {#each [-0.2, 0, 0.4, 0.8, 1.2] as tick}
      <text
        x={-8} y={yScale(tick) + 4}
        font-size="9" fill="#aaa" text-anchor="end"
        font-family="DM Mono, monospace"
      >{tick > 0 ? '+' : ''}{tick.toFixed(1)}°C</text>
    {/each}

  </g>
</svg>

<style>
  svg { display: block; }
</style>
