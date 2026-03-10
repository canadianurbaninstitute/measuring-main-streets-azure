<script>
  /**
   * GridSolutions.svelte
   *
   * A simple quadrant bubble chart showing climate solutions.
   */

  const solutions = [
    { label: 'Solar PV',         x: 18, y: 82, r: 22, color: '#f39c12' },
    { label: 'Onshore Wind',     x: 22, y: 74, r: 18, color: '#27ae60' },
    { label: 'Efficiency',       x: 12, y: 68, r: 14, color: '#2980b9' },
    { label: 'Forest Protect.',  x: 15, y: 56, r: 16, color: '#16a085' },
    { label: 'Offshore Wind',    x: 42, y: 62, r: 14, color: '#27ae60' },
    { label: 'Nuclear',          x: 60, y: 48, r: 12, color: '#8e44ad' },
    { label: 'BECCS',            x: 72, y: 30, r: 10, color: '#c0392b' },
    { label: 'Direct Air Cap.',  x: 85, y: 20, r:  9, color: '#c0392b' },
    { label: 'EV Transport',     x: 35, y: 52, r: 12, color: '#2980b9' },
    { label: 'Plant-rich Diet',  x: 28, y: 44, r: 10, color: '#16a085' },
  ];

  const W = 460, H = 300;
  const pad = { top: 20, right: 20, bottom: 40, left: 52 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const sx = (v) => (v / 100) * innerW;
  const sy = (v) => innerH - (v / 100) * innerH;
</script>

<svg viewBox="0 0 {W} {H}" width="100%" height="100%" style="max-height:280px">
  <g transform="translate({pad.left},{pad.top})">

    <!-- Quadrant shading -->
    <rect x="0" y="0" width={innerW/2} height={innerH/2}
          fill="#f0faf0" rx="2"/>
    <text x={innerW/4} y={innerH/2 - 6}
          font-size="8" fill="#aaa" text-anchor="middle"
          font-family="DM Mono, monospace">HIGH IMPACT · LOW COST</text>

    <!-- Axes -->
    <line x1="0" y1={innerH} x2={innerW} y2={innerH}
          stroke="#ddd" stroke-width="1"/>
    <line x1="0" y1="0" x2="0" y2={innerH}
          stroke="#ddd" stroke-width="1"/>

    <!-- Midlines -->
    <line x1={innerW/2} y1="0" x2={innerW/2} y2={innerH}
          stroke="#e8e8e8" stroke-width="1" stroke-dasharray="4 3"/>
    <line x1="0" y1={innerH/2} x2={innerW} y2={innerH/2}
          stroke="#e8e8e8" stroke-width="1" stroke-dasharray="4 3"/>

    <!-- Bubbles -->
    {#each solutions as s}
      <circle
        cx={sx(s.x)} cy={sy(s.y)}
        r={s.r * 0.55}
        fill={s.color} fill-opacity="0.2"
        stroke={s.color} stroke-width="1"
      />
      <text
        x={sx(s.x)} y={sy(s.y) + 3}
        font-size="7.5" fill="#333" text-anchor="middle"
        font-family="DM Mono, monospace"
      >{s.label}</text>
    {/each}

    <!-- Axis labels -->
    <text x={innerW/2} y={innerH + 28}
          font-size="9" fill="#999" text-anchor="middle"
          font-family="DM Mono, monospace">
      ← Lower cost · Higher cost →
    </text>
    <text
      x={-innerH/2} y={-38}
      font-size="9" fill="#999" text-anchor="middle"
      font-family="DM Mono, monospace"
      transform="rotate(-90)"
    >← Lower impact · Higher impact →</text>

  </g>
</svg>

<style>
  svg { display: block; }
</style>
