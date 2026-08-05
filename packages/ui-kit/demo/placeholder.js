/** Inline SVG placeholder so the showcase has zero external image requests. */
export function placeholderImage(seed = '', color = '#00adf2') {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="100%" height="100%" fill="${color}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="16">${seed}</text></svg>`;
	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
