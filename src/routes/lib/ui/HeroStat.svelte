<script>
    export let number;
    export let subtitle;
    export let color = 'var(--brandPink)';
  
    let boundingRef = null;
  
    function handleMouseEnter(event) {
      boundingRef = event.currentTarget.getBoundingClientRect();
    }
  
    function handleMouseLeave() {
      boundingRef = null;
    }
  
    function handleMouseMove(event) {
      if (!boundingRef) return;
  
      const x = event.clientX - boundingRef.left;
      const y = event.clientY - boundingRef.top;
      const xPercentage = x / boundingRef.width;
      const yPercentage = y / boundingRef.height;
      const xRotation = (xPercentage - 0.5) * 30;
      const yRotation = (0.5 - yPercentage) * 30;
  
      event.currentTarget.style.setProperty("--x-rotation", `${yRotation}deg`);
      event.currentTarget.style.setProperty("--y-rotation", `${xRotation}deg`);
      event.currentTarget.style.setProperty("--x", `${xPercentage * 100}%`);
      event.currentTarget.style.setProperty("--y", `${yPercentage * 100}%`);
    }
  </script>
  
  <div 
    role="button"
    tabindex="0"
    class="card"
    on:mouseleave={handleMouseLeave}
    on:mouseenter={handleMouseEnter}
    on:mousemove={handleMouseMove}
    style="background-color: {color}"
  >
    <div class="card-text-container">
      <h2>{number}</h2>
      <h5>{subtitle}</h5>
    </div>
    <div class="card-hover"></div>
  </div>
  
  <style>
    .card {
      margin: 1em;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 1em;
      justify-content: center;
      transition: transform 0.3s ease-out;
      perspective: 800px;
      min-width: 15%;
    }
  
    .card:hover {
      cursor: pointer;
      /* background-color: #eee; */
      transform: rotateX(var(--x-rotation)) rotateY(var(--y-rotation)) scale(1);
    }
  
    .card-text-container {
      width: 100%;
      padding: 2em;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    }
  
    .card-hover {
      pointer-events: none;
      position: absolute;
      inset: 0;
    }
  
    .card:hover .card-hover {
      background: radial-gradient(at var(--x) var(--y), rgba(255, 255, 255, 0.1) 20%, transparent 80%);
      border-radius: 1em;
    }
  
    h2 {
      color: #fff;
      font-weight: 400;
      text-align: center;
    }
  
    h5 {
        color: #fff;
      font-weight: 400;
      text-align: center;
    }
  </style>
  