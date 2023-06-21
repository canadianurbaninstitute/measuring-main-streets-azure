<script>
    import { onMount } from "svelte";
    import PhotoSwipeLightbox from 'photoswipe/lightbox';
    import 'photoswipe/style.css';
  
    export let galleryID;
    export let images;
  
    onMount(() => {
      let lightbox;
  
      const initializeLightbox = async () => {
        const module = await import('photoswipe');
        lightbox = new PhotoSwipeLightbox({
          gallery: '#' + galleryID,
          children: 'a',
          pswpModule: () => module,
        });
        lightbox.init();
      };
  
      initializeLightbox();
  
      return () => {
        if (lightbox) {
          lightbox.destroy();
        }
      };
    });
  </script>
  
  <div class="pswp-gallery grid-container" id={galleryID}>
    {#each images as image}
      <a
        href={image.largeURL}
        data-pswp-width={image.width}
        data-pswp-height={image.height}
        target="_blank"
        rel="noreferrer"
      >
        <img src={image.thumbnailURL} alt="" />
      </a>
    {/each}
  </div>

  <style>
    .grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); /* Adjust the size as per your needs */
  grid-gap: 10px; /* Adjust the gap between images */
}

.grid-container img {
  max-width: 100%;
  height: auto;
}
  </style>
    