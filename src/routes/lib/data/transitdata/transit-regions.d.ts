export interface TransitLine {
	id: number;
	name: string;
}

export interface Region {
	id: string;
	name: string;
	bbox: [number, number, number, number];
	lines: TransitLine[];
}

export type Regions = Region[];
