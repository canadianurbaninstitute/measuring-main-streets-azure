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
	props?: Record<string, unknown>;
}

export interface AnchorItem {
  type: 'anchor';
  id: string;
	label: string;
	stepIndex?: number;
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
  panelUid?: string | null;
  heading?: string;
	eyebrow?: string;
	sectionIndex?: number;
  body: string;
  panelId?: string;
	panelIds?: string[];
	globalStepIndex?: number;
	cta?: { href: string; label: string; target?: string; };
	props?: Record<string, unknown>;
}

export interface Panel {
	uid?: string;
	id?: string;
	label?: string;
	source?: string;
	config?: VisConfigItem | null;
	sectionIndex?: number;
}

export interface Section {
	layout?: string;
	blocks: Block[];
	panels: Panel[];
	si?: number;
}

export interface Group
{
	layout: string;
	sections: Section[];
}