<script>
	export let minlabel;
  export let maxlabel;
  export let label;
  export let gradient;
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
    background-color: #eee;
    border-radius: 8px;
    font: 12px/20px 'Inter', sans-serif;
    padding: 10px;
    z-index: 1;
}

.legend .regular-item {
    display:flex;
    flex-direction: row;
    align-items: center;
}

.gradient-container {
    padding: 0px 5px 0px 5px;
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
    right: 15px;

  }
</style>