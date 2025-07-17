<script>
	import { NavigationMenu } from "bits-ui";
	import Icon from "@iconify/svelte";
	import logo from "../lib/assets/logos/cui_logo.svg"; // unused visually but kept if you want to swap brands
	import mms_logo from "../lib/assets/logos/mms_logo.svg";
	import mms_logo_alt from "../lib/assets/logos/mms_logo_alt.svg";
  
	// Logo hover swap ---------------------------------------------------------
	let imageSrc = mms_logo;
	const onMouseOver = () => (imageSrc = mms_logo_alt);
	const onMouseOut = () => (imageSrc = mms_logo);
  
	// Responsive mobile menu toggle -------------------------------------------
	let menuOpen = false;
	const toggleMenu = () => (menuOpen = !menuOpen);
  
	// Optional: close mobile menu when moving to desktop width
	import { onMount } from "svelte";
	function handleResize() {
	  if (window.innerWidth >= 768) menuOpen = false;
	}
	onMount(() => {
	  window.addEventListener("resize", handleResize);
	  return () => window.removeEventListener("resize", handleResize);
	});
  
	// Data --------------------------------------------------------------------
	const caseStudies = [
	//   { title: "TOD on Main", href: "/" },
	  { title: "Measuring Main Streets", href: "/casestudies" }
	];
  
	const reports = [
	//   { title: "TOD on Main", href: "/" },
	  { title: "Measuring Main Streets", href: "/reports" }
	];
  
	const learnMore = [
	  { title: "About", href: "/about" },
	  { title: "Platform", href: "/about/platform" },
	  { title: "FAQ", href: "/about/faq" },
	  { title: "Data & Methodology", href: "/about/data-methodology" },
	  { title: "Team", href: "/about/team" },
	  { title: "Contact", href: "/about/contact" }
	];
  </script>
  

  <div id="bar">
	<div id="logo-group">
	  <a href="/" aria-label="Home">
		<img
		  src={imageSrc}
		  alt="Measuring Main Streets"
		  on:mouseover={onMouseOver}
		  on:mouseout={onMouseOut}
		  on:focus={onMouseOver}
		  on:blur={onMouseOut}
		/>
	  </a>
	</div>
  
	<button
	  id="mobile-toggle"
	  class="mobile-toggle"
	  type="button"
	  aria-expanded={menuOpen}
	  aria-controls="primary-nav"
	  on:click={toggleMenu}
	>
	  Menu
	</button>
  
	<nav id="menu" aria-label="Primary">
	  <NavigationMenu.Root class="nav-root">
		<NavigationMenu.List id="primary-nav" class="nav-menu-list" data-open={menuOpen}>
		  <!-- Direct Links -->
		  <NavigationMenu.Item class="nav-menu-item">
			<NavigationMenu.Link href="/map" class="nav-link">Main Street Map</NavigationMenu.Link>
		  </NavigationMenu.Item>
  
		  <!-- Uncomment when ready to publish -->
		  <!-- <NavigationMenu.Item class="nav-menu-item">
			<NavigationMenu.Link href="/transit-map" class="nav-link">Transit Map</NavigationMenu.Link>
		  </NavigationMenu.Item>
   		  -->
		  <!-- Case Studies Dropdown -->
		  <NavigationMenu.Item value="case-studies" class="nav-menu-item">
			<NavigationMenu.Trigger class="nav-trigger">
			  Case Studies
			  <Icon icon="icon-park-solid:down-one" class="nav-menu-icon" />
			</NavigationMenu.Trigger>
			<NavigationMenu.Content class="nav-content-pop">
			  <ul class="nav-dropdown">
				{#each caseStudies as item}
				  <li>
					<NavigationMenu.Link href={item.href} class="nav-dropdown-link">{item.title}</NavigationMenu.Link>
				  </li>
				{/each}
			  </ul>
			</NavigationMenu.Content>
		  </NavigationMenu.Item>
  
		  <!-- Reports Dropdown -->
		  <NavigationMenu.Item value="reports" class="nav-menu-item">
			<NavigationMenu.Trigger class="nav-trigger">
			  Reports
			  <Icon icon="icon-park-solid:down-one" class="nav-menu-icon" />
			</NavigationMenu.Trigger>
			<NavigationMenu.Content class="nav-content-pop">
			  <ul class="nav-dropdown">
				{#each reports as item}
				  <li>
					<NavigationMenu.Link href={item.href} class="nav-dropdown-link">{item.title}</NavigationMenu.Link>
				  </li>
				{/each}
			  </ul>
			</NavigationMenu.Content>
		  </NavigationMenu.Item>
  
		  <!-- Tools link -->
		  <NavigationMenu.Item class="nav-menu-item">
			<NavigationMenu.Link href="/tools" class="nav-link">Tools</NavigationMenu.Link>
		  </NavigationMenu.Item>
  
		  <!-- Learn More Dropdown -->
		  <NavigationMenu.Item value="learn-more" class="nav-menu-item">
			<NavigationMenu.Trigger class="nav-trigger">
			  Learn More
			  <Icon icon="icon-park-solid:down-one" class="nav-menu-icon" />
			</NavigationMenu.Trigger>
			<NavigationMenu.Content class="nav-content-pop nav-content--right">
			  <ul class="nav-dropdown">
				{#each learnMore as item}
				  <li>
					<NavigationMenu.Link href={item.href} class="nav-dropdown-link">{item.title}</NavigationMenu.Link>
				  </li>
				{/each}
			  </ul>
			</NavigationMenu.Content>
		  </NavigationMenu.Item>
  
		  <!-- Optional indicator (arrow under active trigger) -->
		  <NavigationMenu.Indicator class="nav-indicator">
			<div class="nav-indicator-arrow"></div>
		  </NavigationMenu.Indicator>
		</NavigationMenu.List>
	  </NavigationMenu.Root>
	</nav>
  </div>
  
  <style>

#bar {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  width: 100%;
	  justify-content: space-between;
	  border-bottom: 1px solid #eee;
	}

	@media (min-width: 768px) {
	  #bar {
		flex-direction: row;
	  }
	}
  
	#logo-group {
	  position: relative;
	  display: flex;
	  align-items: center;
	  flex-direction: row;
	  padding: 1em 1em 1em 2em;
	}
  
	img {
	  height: 50px;
	}

	img:hover { cursor: pointer; }
  
	a { text-decoration: none; }
  
	nav#menu {
	  background-color: #fff;
	  display: flex;
	  justify-content: flex-end;
	  align-items: center;
	  width: 100%;
	}
  
	/* Mobile toggle  */

	.mobile-toggle {
	  display: inline-flex;
	  align-items: center;
	  justify-content: center;
	  margin-right: 1rem;
	  margin-bottom: 0.5rem;
	  padding: 0.25rem 0.75rem;
	  border: 1px solid #ccc;
	  border-radius: 0.375rem;
	  background: #f8f8f8;
	  font-size: 0.875rem;
	  line-height: 1.25;
	}

	@media (min-width: 768px) {
	  .mobile-toggle { display: none; }
	}
  
	/* Bits root */
	:global(.nav-root) {
	  position: relative;
	  z-index: 10;
	  display: flex;
	  width: 100%;
	  justify-content: end;
	}
  
	/* Top-level list */
	:global(.nav-menu-list) {
	  display: none; /* hidden by default on mobile */
	  flex-direction: column;
	  list-style: none;
	  align-items: flex-start;
	  justify-content: flex-start;
	  padding: 0 1.5rem 1rem;
	  gap: 0.75rem;
	  margin: 0;
	  width: 100%;
	}

	:global(.nav-menu-list[data-open="true"]) {
	  display: flex;
	}

	@media (min-width: 768px) {
	  :global(.nav-menu-list) {
		display: flex !important;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 0 2em 0 0;
		gap: 2em;
		width: auto;
	  }
	}
  
	:global(.nav-menu-item) {
	  position: relative;
	}
  
	/* Top-level link & trigger styles  */
	:global(.nav-link), :global(.nav-trigger) {
	  color: var(--brandDarkBlue);
	  text-decoration: none;
	  text-align: center;
	  display: inline-flex;
	  height: 2rem;
	  width: max-content;
	  align-items: center;
	  justify-content: center;
	  border-radius: 0.5em;
	  background-color: transparent;
	  padding: 0.5rem 1rem;
	  font-weight: 500;
	  transition: all 0.2s ease;
	  outline: none;
	  cursor: pointer;
	  border: none;
	  font-size: inherit;
	  font-family: inherit;
	  gap: 0.25rem;
	}

	:global(.nav-link:hover),
	:global(.nav-trigger:hover),
	:global(.nav-link:focus),
	:global(.nav-trigger:focus) {
	  color: var(--brandLightBlue);
	  background-color: rgba(0,0,0,0.02);
	}

	:global(.nav-trigger[data-state="open"]) {
	  color: var(--brandLightBlue);
	  background-color: rgba(0,0,0,0.04);
	}
  
	:global(.nav-menu-icon) {
	  position: relative;
	  top: 1px;
	  width: 0.75rem;
	  height: 0.75rem;
	  transition: transform 0.2s ease;
	}

	:global(.nav-trigger[data-state="open"] .nav-menu-icon) {
	  transform: rotate(180deg);
	}
  
	/* Dropdown panel (popover)  */
	:global(.nav-content-pop) {
	  position: absolute;
	  top: 100%;
	  left: 0;
	  margin-top: 0.25rem;
	  min-width: 250px;
	  background-color: #fff;
	  border: 1px solid #ddd;
	  border-radius: 0.5rem;
	  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
	  opacity: 0;
	  transform: translateY(-4px) scale(.96);
	  pointer-events: none;
	  z-index: 20;
	  transition: opacity .15s ease, transform .15s ease;
	}

	/* Right-align variant (for last menu item) */
	:global(.nav-content--right) {
	  left: auto;
	  right: 0;
	}

	:global(.nav-content-pop[data-state="open"]) {
	  opacity: 1;
	  transform: translateY(0) scale(1);
	  pointer-events: auto;
	}
  
	/* Dropdown list items  */
	:global(.nav-dropdown) {
	  margin: 0;
	  padding: 0.75rem;
	  list-style: none;
	  display: flex;
	  flex-direction: column;
	  gap: 0.25rem;
	  min-width: 200px;
	}

	:global(.nav-dropdown-link) {
	  display: block;
	  padding: 0.5rem 0.75rem;
	  color: var(--brandDarkBlue);
	  text-decoration: none;
	  border-radius: 0.375rem;
	  transition: all 0.2s ease;
	  outline: none;
	}

	:global(.nav-dropdown-link:hover),
	:global(.nav-dropdown-link:focus) {
	  background-color: rgba(0,0,0,0.04);
	  color: var(--brandLightBlue);
	}
  
	/* Indicator  */
	:global(.nav-indicator) {
	  position: absolute;
	  top: 100%;
	  z-index: 25;
	  display: flex;
	  height: 0.625rem;
	  align-items: flex-end;
	  justify-content: center;
	  overflow: hidden;
	  transition: all 0.2s ease;
	  opacity: 0;
	}

	:global(.nav-indicator[data-state="visible"]) {
	  opacity: 1;
	}

	:global(.nav-indicator-arrow) {
	  position: relative;
	  top: 70%;
	  height: 0.625rem;
	  width: 0.625rem;
	  transform: rotate(45deg);
	  border-radius: 0.125rem 0 0 0;
	  background-color: #fff;
	  border: 1px solid #ddd;
	  border-right: none;
	  border-bottom: none;
	}
	
  </style>
  