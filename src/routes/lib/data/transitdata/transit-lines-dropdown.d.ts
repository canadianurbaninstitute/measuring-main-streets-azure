export interface TransitLineOption {
  value: number;
  label: string;
}

export type TransitLines = Record<string, TransitLineOption[]>;
