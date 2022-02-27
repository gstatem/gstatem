import { Action, State as GState } from "gstatem";

export type PiecePayload = {
	storeId?: string;
	piece?: GState;
};

export type PieceInfo = {
	pieceId?: string;
	action?: Action;
	payload?: PiecePayload;
	timestamp?: number;
	isRead?: boolean;
};

export type StoreIds = { [statemId: string]: 1 };

export type OnPageReload = {
	name: string;
	tabId?: number;
	storeIds?: StoreIds;
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
	piece?: PieceInfo;
};

export type TabState = {
	isPageOpened?: boolean;
	pieceInfoMap?: {
		[storeId: string]: {
			[pieceId: string]: PieceInfo;
		};
	};
};

export type StoreInfo = {
	piecesInfo?: PieceInfo[];
	piecesById?: {
		[pieceId: string]: PieceInfo;
	};
	store?: GState;
};

export type StoresInfo = {
	[storeId: string]: StoreInfo;
};

export type ReadPieces = {
	[storeId: string]: string[]; // pieceIds
};

export type MergePieces = {
	storeId: string;
	sourcePieceIds: string[];
	targetPieceId: string;
};

export type PageToBg = {
	name: string;
	tabId?: number;
	readPieces?: ReadPieces;
	mergePieces?: MergePieces;
};
