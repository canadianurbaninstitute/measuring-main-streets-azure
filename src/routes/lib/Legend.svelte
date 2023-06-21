

<div id="legend" class='legend'>
    <!-- <h3>Legend</h3> -->
    <div class=gradient-container>
    <div class="regular-item">Business Density</div>
    <div class="gradient-box"></div>
    <span class="minlabel">Low</span>
    <span class="maxlabel">High</span>
    <hr>
    <div class="regular-item"><span style="background-color: #ffdd33;  box-shadow:inset 0px 0px 0px 2px #c4ad37"></span>West Queen West</div>
    </div>
</div>

<style>
    .legend {
    position: fixed;
    bottom:4%;
    right:10px;
    display: block;
    background-color: #fff;
    border-radius: 8px;
    font: 12px/20px 'Inter', sans-serif;
    padding: 10px;
    z-index: 1;
    width:20vw;
}

.legend .regular-item {
    display:flex;
    flex-direction: row;
    align-items: center;
}

.legend div span {
    border-radius: 2px;
    display: inline-block;
    height: 15px;
    margin-right: 5px;
    width: 15px;
}

.gradient-container {
    padding: 0px 5px 0px 5px;
}

.gradient-box {
    width:100%;
    height: 10px;
    background: linear-gradient(to right, #000033, #50127b, #b6377a, #fb8761, #ffd91a);
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