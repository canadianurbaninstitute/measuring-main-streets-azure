export interface TransitLine {
	id: number | null | string;
	name: string;
}

export interface TransitLineWithContext extends TransitLine {
	id: number | null | string;
	name: string;
	regionName?: string;
	regionId?: number | null | string;
	[key: string]: any;
}

export interface Region {
	id: string | null;
	name: string;
	bbox: [number, number, number, number];
	lines: TransitLine[];
}

export type Regions = Region[];
