// Define the Svelte Action for intersection observer
export function intersect(node, callback) {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					callback(entry.target);
				}
			});
		},
		{
			root: null,
			rootMargin: '-40% 0px -40% 0px', // Triggers when element is near the center of the viewport
			threshold: 0
		}
	);

	observer.observe(node);

	return {
		destroy() {
			observer.unobserve(node);
			observer.disconnect();
		}
	};
}
