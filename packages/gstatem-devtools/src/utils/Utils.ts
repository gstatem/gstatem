import { StepPayload } from "./Types";
import { State as GState } from "gstatem";

export const firstEntry = <T>(obj = {}): [key: string, value: T] => {
	// noinspection LoopStatementThatDoesntLoopJS
	for (const key in obj) {
		return [key, obj[key]];
	}
};

export const getStepState = ({ piece }: StepPayload): GState => {
	return piece;
};

export const accStepState = (
	{ piece }: StepPayload,
	curState: object
): void => {
	Object.assign(curState, piece);
};

export const setStepState = (
	{ piece }: StepPayload,
	newStepState: GState
): void => {
	Object.assign(piece, newStepState);
};

export const uuidv4 = (): string => {
	// @ts-ignore
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		(
			c ^
			(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
		).toString(16)
	);
};
