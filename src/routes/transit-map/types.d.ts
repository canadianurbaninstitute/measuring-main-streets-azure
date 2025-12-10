export interface Station {
  id: number | null;
  stop_label?: string;
  line_display_name?: string;
  longitude?: number;
  latitude?: number;
  line_ids_array?: number[];
  [key: string]: any;
}

export interface Region {
  id: string;
  name: string;
  bbox: [[number, number], [number, number]];
  lines: Line[];
}

export interface Line {
  id: number;
  name: string;
  regionId?: string;
  regionName?: string;
}

export interface SearchResults {
  regions: Region[];
  lines: Line[];
  stops: Station[];
}