import { PiecePayload } from "./Types";
import { State as GState } from "gstatem";

export const firstEntry = <T>(obj = {}): [key: string, value: T] => {
	// noinspection LoopStatementThatDoesntLoopJS
	for (const key in obj) {
		return [key, obj[key]];
	}
};

export const getPiece = ({ piece }: PiecePayload): GState => {
	return piece;
};

export const accPiece = ({ piece }: PiecePayload, store: object): void => {
	Object.assign(store, piece);
};

export const setPiece = ({ piece }: PiecePayload, nextPiece: GState): void => {
	Object.assign(piece, nextPiece);
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
