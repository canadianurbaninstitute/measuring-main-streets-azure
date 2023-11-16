<script>
	export let minlabel = 0;
  export let maxlabel;
  export let label;
  export let gradient = 'linear-gradient(to right, #ebf9ff, #cceffe, #99dffc, #67cefb, #34bef9, #01aef8, #018bc6, #016895, #004663, #002332, #001d29)';
</script>

<div id="legend" class='legend'>
  <div class=gradient-container>
  <div class="regular-item">{label}</div>
  <div class="gradient-box" style="background:{gradient}"></div>
  <span class="minlabel">{minlabel}</span>
  <span class="maxlabel">{maxlabel}</span>
  </div>
</div>

<style>
    .legend {
    position: relative;
    display: block;
    background-color: #fff;
    font: 12px/20px 'Inter', sans-serif;
    z-index: 1;
}

.legend .regular-item {
    display:flex;
    flex-direction: row;
    align-items: center;
}

.gradient-container {
    padding: 0 0.2em 0.2em 0.2em;
}

.gradient-box {
    width:100%;
    height: 10px;
    margin-top: 5px;
    margin-bottom: 5px;
    /* border: 1px solid #000033; */
  }

  .minlabel {
    font: 12px/20px 'Inter', sans-serif;
    position: relative;

  }
  
  .maxlabel {
    font: 12px/20px 'Inter', sans-serif;
    position: absolute;
    right: 0.2em;

  }
</style>