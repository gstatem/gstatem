import { Action, State as GState } from "gstatem";

export type StepPayload = {
	statemId?: string;
	piece?: GState;
};

export type Step = {
	stepId?: string;
	action?: Action;
	payload?: StepPayload;
	timestamp?: number;
	isRead?: boolean;
};

export type StatemIds = { [statemId: string]: 1 };

export type OnPageReload = {
	name: string;
	tabId?: number;
	statemIds?: StatemIds;
	timestamp?: number;
};

export type PageOpen = {
	name: string;
	tabId?: number;
	tabState?: TabState;
};

export type OnAction = {
	name: string;
	tabId?: number;
	step?: Step;
};

export type TabState = {
	isPageOpened?: boolean;
	statemStepMap?: {
		[statemId: string]: {
			[stepId: string]: Step;
		};
	};
};

export type Statem = {
	steps?: Step[];
	stepsById?: {
		[stepId: string]: Step;
	};
	/**
	 * State of the statem.
	 */
	state?: GState;
};

export type Statems = {
	[statemId: string]: Statem;
};

export type ReadSteps = {
	[statemId: string]: string[]; // stepIds
};

export type MergeSteps = {
	statemId: string;
	sourceStepIds: string[];
	targetStepId: string;
};

export type PageToBg = {
	name: string;
	tabId?: number;
	readSteps?: ReadSteps;
	mergeSteps?: MergeSteps;
};
