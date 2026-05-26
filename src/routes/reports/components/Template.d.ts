export interface VisConfigItem {
	type: string;
	src?: string;
	alt?: string;
	caption?: string;
	fit?: string;
	aspect?: string;
	component?: any;
	href?: string;
	btnLabel?: string;
	target?: string;
}

// export interface NavItem {
// 	type: string;
// 	id?: string;
// 	label: string;
// 	stepIndex?: number;
// 	isFirstInSection?: boolean;
// }

export interface AnchorItem {
  type: 'anchor';
  id: string;
  label: string;
  isFirstInSection?: boolean;
}

export interface StepItem {
  type: 'step';
  stepIndex: number;
  label: string;
  isFirstInSection?: boolean;
}

export type NavItem = AnchorItem | StepItem;

export interface Block
{
  panelUids?: string[];
  panelUid?: string;
  heading?: string | undefined;
  eyebrow?: string;
  body: string;
  panelId?: string | undefined;
  panelIds?: string[] | undefined;
  cta?: { href: string; label: string; target?: string;  }
}

export interface Panel {
	uid?: string;
	id?: string;
	label?: string;
	source?: string;
	config?: VisConfigItem | null;
}

export interface Section {
	blocks: Block[];
	panels: Panel[];
}