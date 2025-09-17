export interface Stop {
	value: number;
	label: string;
}

export type LineStops = Record<string, Stop[]>;
