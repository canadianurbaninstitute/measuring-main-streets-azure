//helper function to interpolate colours for d3

export default function getD3InterpolateExpression(
	features,
	variable,
	min = 0,
	max = 0,
	colors = ['#F5C8D7', '#E87CA0', '#DB3069', '#721433']
) {
	const values = features.map((f) => f.properties[variable]).filter((v) => v != null);

	const uniqueValues = Array.from(new Set(values)).sort((a, b) => a - b);
	min = Math.min(...uniqueValues);
	max = Math.max(...uniqueValues);
	const stops = colors
		.map((color, i) => [min + (i * (max - min)) / (colors.length - 1), color])
		.flat();

	return {
		expression: ['interpolate', ['linear'], ['get', variable], ...stops],
		min,
		max
	};
}
