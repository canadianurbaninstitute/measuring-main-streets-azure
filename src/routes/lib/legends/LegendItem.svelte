<script>
  export let label;
  export let variant;
  export let bgcolor;
  export let bordercolor;
</script>

<div class="legend-item"><span class={variant} style="background-color: {bgcolor};  box-shadow:inset 0px 0px 0px 2px {bordercolor}; border-color: {bordercolor};"></span>{label}</div>

<style>

.legend-item {
    padding: 0.2em;
    display: flex;
    align-items: center;
    font-size: 0.8em;
}

.polygon {
    border-radius: 2px;
    display: inline-block;
    height: 15px;
    margin-right: 5px;
    width: 15px;
}

.circle {
    border-radius: 100px;
    display: inline-block;
    height: 15px;
    margin-right: 5px;
    width: 15px;
}

.line {
    border-radius: 2px;
    display: inline-block;
    margin-right: 5px;
    width: 15px;
    height: 0;
    border-style: solid;
    border-width: 2px 2px 0 0;
    transform: rotate(45deg);
}
</style>