<!-- UI component for navigation bar.-->

<script>
	import { page } from '$app/state';
	import Icon from '@iconify/svelte';
	import { NavigationMenu } from 'bits-ui';
	import { onMount } from 'svelte';
	import cui_logo from '../assets/logos/cui_logo.svg';
	import mms_logo from '../assets/logos/mms_logo.svg';

	let menuOpen = $state(false);
	let isHovered = $state(false);

	let isHiddenRoute = $derived(
		page.url?.pathname.includes('/casestudies/tod/') || page.url?.pathname.includes('/reports/tod/')
	);

	//remove once new home page is switched over
	let isLandingNav = $derived(
		page.url?.pathname.includes('/new-home') ||
			page.url?.pathname.includes('/v2') ||
			page.url?.pathname.includes('/tod')
	);

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function onMouseOver() {
		// add hover logic here if needed, e.g. swap logo src
	}
	function onMouseOut() {
		// add hover logic here if needed
	}

	function handleResize() {
		if (window.innerWidth >= 768) menuOpen = false;
	}

	onMount(() => {
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});

	const caseStudies = [{ title: 'Measuring Main Streets', href: '/casestudies' }];

	const newCaseStudies = [
		{ title: 'Resilience on Main', href: '/casestudies/v2/?tab=msr' },
		{ title: 'TOD on Main', href: '/casestudies/v2/?tab=tod' }
	];

	const reports = [{ title: 'Measuring Main Streets', href: '/reports' }];

	const newReports = [
		{ title: 'Resilience on Main', href: '/reports/v2/?tab=msr' },
		{ title: 'TOD on Main', href: '/reports/v2/?tab=tod' }
	];

	const learnMore = [
		{ title: 'About', href: '/about' },
		{ title: 'FAQ', href: '/about/faq' },
		{ title: 'Data & Methodology', href: '/about/data-methodology' },
		{ title: 'Team', href: '/about/team' },
		{ title: 'Contact', href: '/about/contact' }
	];

	const newLearnMore = [
		{ title: 'About', href: '/about/v2' },
		{ title: 'FAQ', href: '/about/faq/v2' },
		{ title: 'Data & Methodology', href: '/about/data-methodology/v2' }
	];
</script>

<div
	id="bar-wrapper"
	class:hideable={isHiddenRoute}
	class:hovered={isHovered}
	class:landing-nav={isLandingNav}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	role="navigation"
>
	<div id="bar">
		<div id="logo-group">
			<a href={isLandingNav ? '/new-home' : '/'} aria-label="Home">
				<div class="flex gap-4 items-center">
					<img
						src={mms_logo}
						alt="Measuring Main Streets"
						onmouseover={onMouseOver}
						onmouseout={onMouseOut}
						onfocus={onMouseOver}
						onblur={onMouseOut}
					/>
					<div class="border-l border-gray-300 h-12"></div>
					<img
						src={cui_logo}
						alt="Canadian Urban Institute"
						onmouseover={onMouseOver}
						onmouseout={onMouseOut}
						onfocus={onMouseOver}
						onblur={onMouseOut}
					/>
				</div>
			</a>
		</div>

		<button
			id="mobile-toggle"
			class="mobile-toggle"
			type="button"
			aria-expanded={menuOpen}
			aria-controls="primary-nav"
			onclick={toggleMenu}
		>
			Menu
		</button>

		<nav id="menu" class="w-full" aria-label="Primary">
			<NavigationMenu.Root class="nav-root">
				<NavigationMenu.List id="primary-nav" class="nav-menu-list" data-open={menuOpen}>
					<!-- Direct Links -->
					<NavigationMenu.Item class="nav-menu-item">
						<NavigationMenu.Link href="/map" class="nav-link w-full"
							>Main Street Map</NavigationMenu.Link
						>
					</NavigationMenu.Item>

					<!-- Uncomment when ready to publish -->
					<NavigationMenu.Item class="nav-menu-item">
						<NavigationMenu.Link href="/transit-map" class="nav-link"
							>Transit Map</NavigationMenu.Link
						>
					</NavigationMenu.Item>

					<!-- Reports Dropdown -->
					<NavigationMenu.Item value="reports" class="nav-menu-item">
						<NavigationMenu.Trigger class="nav-trigger">
							Reports
							<Icon icon="icon-park-solid:down-one" class="nav-menu-icon" />
						</NavigationMenu.Trigger>
						<NavigationMenu.Content class="nav-content-pop">
							<ul class="nav-dropdown">
								{#each isLandingNav ? newReports : reports as item}
									<li>
										<NavigationMenu.Link href={item.href} class="nav-dropdown-link"
											>{item.title}</NavigationMenu.Link
										>
									</li>
								{/each}
							</ul>
						</NavigationMenu.Content>
					</NavigationMenu.Item>

					<!-- Case Studies Dropdown -->
					<NavigationMenu.Item value="case-studies" class="nav-menu-item">
						<NavigationMenu.Trigger class="nav-trigger">
							Case Studies
							<Icon icon="icon-park-solid:down-one" class="nav-menu-icon" />
						</NavigationMenu.Trigger>
						<NavigationMenu.Content class="nav-content-pop">
							<ul class="nav-dropdown">
								{#each isLandingNav ? newCaseStudies : caseStudies as item}
									<li>
										<NavigationMenu.Link href={item.href} class="nav-dropdown-link"
											>{item.title}</NavigationMenu.Link
										>
									</li>
								{/each}
							</ul>
						</NavigationMenu.Content>
					</NavigationMenu.Item>

					<!-- Tools link -->
					<NavigationMenu.Item class="nav-menu-item">
						<NavigationMenu.Link href={isLandingNav ? '/tools/v2' : '/tools'} class="nav-link"
							>Tools</NavigationMenu.Link
						>
					</NavigationMenu.Item>

					<!-- Learn More Dropdown -->
					<NavigationMenu.Item value="learn-more" class="nav-menu-item">
						<NavigationMenu.Trigger class="nav-trigger">
							Learn More
							<Icon icon="icon-park-solid:down-one" class="nav-menu-icon" />
						</NavigationMenu.Trigger>
						<NavigationMenu.Content class="nav-content-pop nav-content--right">
							<ul class="nav-dropdown">
								{#each isLandingNav ? newLearnMore : learnMore as item}
									<li>
										<NavigationMenu.Link href={item.href} class="nav-dropdown-link"
											>{item.title}</NavigationMenu.Link
										>
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
</div>

<style>
	/* Wrapper for the auto-hide mechanic */
	#bar-wrapper {
		width: 100%;
		position: relative;
		z-index: 50;
		transition: transform 0.3s ease;
	}

	#bar-wrapper.hideable {
		position: fixed;
		top: 0;
		/* Truncate everything but the lowest 15px so users have a hover target */
		transform: translateY(calc(-100% + 15px));
		background: transparent;
	}

	#bar-wrapper.hideable.hovered,
	#bar-wrapper.hideable:focus-within {
		transform: translateY(0);
		background: #fff;
	}

	/* Landing Nav Overrides */
	#bar-wrapper.landing-nav #bar {
		background-color: #fff;
		border-bottom: 2px solid var(--brandLightBlue);
		padding: 0.5rem 0;
	}

	#bar-wrapper.landing-nav :global(.nav-link),
	#bar-wrapper.landing-nav :global(.nav-trigger) {
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-size: 0.8rem;
	}

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
			justify-content: flex-end;
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
		height: 30px;
	}

	img:hover {
		cursor: pointer;
	}

	a {
		text-decoration: none;
	}

	nav#menu {
		background-color: #fff;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		width: 100%;
	}

	:global(nav div) {
		width: 100%;
	}

	/* Mobile toggle  */

	.mobile-toggle {
		padding: 0.5rem 0.1rem;
		margin: 0 auto 1rem auto;
		width: 90%;
		border-radius: 2rem;
		text-decoration: none;
		font-family: 'Inter', sans-serif;
		font-weight: 600;
		font-size: 0.9rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		background-color: var(--brandLightBlue);
		color: white;
		transition: transform 0.2s ease;
	}

	.mobile-toggle:hover {
		background-color: var(--brandDarkBlue);
	}

	@media (min-width: 768px) {
		.mobile-toggle {
			display: none;
		}
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

	:global(.nav-menu-list[data-open='true']) {
		display: flex;
	}

	@media (min-width: 768px) {
		:global(.nav-menu-list) {
			display: flex !important;
			flex-direction: row;
			align-items: center;
			justify-content: flex-end;
			padding: 0 2em 0 0;
			gap: 0;
			width: 100%;
		}
	}

	:global(.nav-menu-item) {
		position: relative;
	}

	/* Top-level link & trigger styles  */
	:global(.nav-link),
	:global(.nav-trigger) {
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
		background-color: rgba(0, 0, 0, 0.02);
	}

	:global(.nav-trigger[data-state='open']) {
		color: var(--brandLightBlue);
		background-color: rgba(0, 0, 0, 0.04);
	}

	:global(.nav-menu-icon) {
		position: relative;
		top: 1px;
		width: 0.75rem;
		height: 0.75rem;
		transition: transform 0.2s ease;
	}

	:global(.nav-trigger[data-state='open'] .nav-menu-icon) {
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
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		opacity: 0;
		transform: translateY(-4px) scale(0.96);
		pointer-events: none;
		z-index: 20;
		transition:
			opacity 0.15s ease,
			transform 0.15s ease;
	}

	/* Right-align variant (for last menu item) */
	:global(.nav-content--right) {
		left: auto;
		right: 0;
	}

	:global(.nav-content-pop[data-state='open']) {
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
		background-color: rgba(0, 0, 0, 0.04);
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

	:global(.nav-indicator[data-state='visible']) {
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
