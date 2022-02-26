import {
	CHANNEL_NAME,
	PAGE_OPEN,
	GROUP_NAME,
	MARK_AS_READ,
	MERGE_PIECES,
	REQUEST_PAGE_OPEN,
	ON_PAGE_RELOAD,
	ON_ACTION
} from "../utils/Constants";
import {
	OnAction,
	PageToBg,
	TabState,
	PageOpen,
	OnPageReload,
	PieceInfo
} from "../utils/Types";
import { getPiece, setPiece } from "../utils/Utils";

type TabStates = {
	[tabId: number]: TabState;
};

const validActions = { set: true };

class Background {
	private portNameRegex = new RegExp(`^${CHANNEL_NAME}__(\\d+)`);
	tabStates: TabStates;
	connections = {};
	saveTabStatesTimeout;
	waitUntilTabStatesInitInterval;

	constructor() {
		chrome.runtime.onConnect.addListener(this.onConnect);
		chrome.runtime.onMessage.addListener(this.onMessage);
		chrome.tabs.onRemoved.addListener(this.onClose);
		(async () => {
			await this.initTabStates();
		})();
	}

	initTabStates = async () => {
		const { tabStates = {} } = await chrome.storage.local.get("tabStates");
		this.tabStates = tabStates;
		if (!this.tabStates) {
			this.tabStates = {};
			this.saveTabStates();
		}
	};

	waitUntilTabStatesInit = () => {
		if (this.waitUntilTabStatesInitInterval) {
			clearInterval(this.waitUntilTabStatesInitInterval);
			this.waitUntilTabStatesInitInterval = undefined;
		}
		return new Promise(resolve => {
			setInterval(() => {
				if (this.tabStates instanceof Object) {
					clearInterval(this.waitUntilTabStatesInitInterval);
					this.waitUntilTabStatesInitInterval = undefined;
					resolve(undefined);
				}
			}, 0);
		});
	};

	getTabState = async (tabId: number): Promise<TabState> => {
		await this.waitUntilTabStatesInit();
		let tabState = this.tabStates[tabId];
		if (!tabState) {
			tabState = { pieceInfoMap: {} };
			this.tabStates[tabId] = tabState;
		}
		this.saveTabStates();
		return tabState;
	};

	removeTabState = async (tabId: number) => {
		if (!this.tabStates?.[tabId]) return;
		delete this.tabStates[tabId];
		this.saveTabStates();
	};

	saveTabStates = () => {
		if (this.saveTabStatesTimeout) {
			clearTimeout(this.saveTabStatesTimeout);
		}
		this.saveTabStatesTimeout = setTimeout(async () => {
			await chrome.storage.local.set({ tabStates: this.tabStates });
			this.saveTabStatesTimeout = undefined;
		}, 3000);
	};

	extensionListener = port => async (message: PageToBg) => {
		const { tabId, name } = message;
		const tabState = await this.getTabState(tabId);
		const { isPageOpened } = tabState;
		switch (name) {
			case REQUEST_PAGE_OPEN: {
				if (!isPageOpened) {
					const pageOpenMessage: PageOpen = {
						tabId,
						name: PAGE_OPEN,
						tabState
					};
					port.postMessage(pageOpenMessage);
					tabState.isPageOpened = true;
				}
				break;
			}
			case MARK_AS_READ:
				this.markAsRead(message, tabState);
				break;
			case MERGE_PIECES:
				this.mergePieces(message, tabState);
				break;
		}
	};

	markAsRead = ({ readPieces }: PageToBg, { pieceInfoMap }: TabState) => {
		let needSave = false;
		for (const storeId in readPieces) {
			const pieceIds = readPieces[storeId];
			const pieceMap = pieceInfoMap[storeId];
			if (!pieceMap) {
				console.warn(
					`[${storeId}] is not found in pieceInfoMap ${pieceInfoMap}`
				);
				continue;
			}

			for (const pieceId of pieceIds) {
				const piece = pieceMap[pieceId];
				piece.isRead = true;
				needSave = true;
			}
		}

		if (needSave) {
			this.saveTabStates();
		}
	};

	mergePieces = (
		{ mergePieces: { storeId, sourcePieceIds, targetPieceId } }: PageToBg,
		{ pieceInfoMap }: TabState
	) => {
		const pieceMap = pieceInfoMap[storeId];
		const piecesToBeMerged: PieceInfo[] = [];
		const mergePieces = {};
		for (const pieceId of sourcePieceIds) {
			const piece = pieceMap[pieceId];
			piecesToBeMerged.push(piece);
			delete pieceMap[pieceId];
		}
		piecesToBeMerged.sort((a, b) => a.timestamp - b.timestamp);
		for (const { payload: piecePayloadToBeMerged } of piecesToBeMerged) {
			Object.assign(mergePieces, getPiece(piecePayloadToBeMerged));
		}

		const { payload: targetPayload } = pieceMap[targetPieceId];
		const targetPiece = getPiece(targetPayload);
		Object.assign(mergePieces, targetPiece);
		setPiece(targetPayload, mergePieces);
		this.saveTabStates();
	};

	onConnect = (port: chrome.runtime.Port) => {
		const tabId = Number(this.portNameRegex.exec(port.name)?.[1] || 0);
		if (!tabId) return;

		this.connections[tabId] = port;

		port.onMessage.addListener(this.extensionListener(port));
		port.onDisconnect.addListener(this.onDisconnect(tabId));
	};

	onDisconnect = (tabId: number) => async () => {
		const tabState = await this.getTabState(tabId);
		delete this.connections[tabId];

		tabState.isPageOpened = false;
	};

	onMessage = async (
		message: OnAction & OnPageReload,
		{ tab: { id: tabId } }: chrome.runtime.MessageSender
	) => {
		console.log("==message", message);
		const port = this.connections[tabId];
		const tabState = await this.getTabState(tabId);
		const { pieceInfoMap } = tabState;
		message.tabId = tabId;

		const { name } = message;
		if (port) {
			port.postMessage(message);
		}

		if (name.startsWith(GROUP_NAME)) {
			switch (name) {
				case ON_PAGE_RELOAD:
					await this.removeTabState(tabId);
					break;
				case ON_ACTION: {
					const { piece }: OnAction = message;
					const {
						pieceId,
						payload: { storeId },
						action
					} = piece;

					if (validActions[action]) {
						let pieceMap = pieceInfoMap[storeId];
						if (!pieceMap) {
							pieceMap = {};
							pieceInfoMap[storeId] = pieceMap;
						}
						pieceMap[pieceId] = piece;
						this.saveTabStates();
					}
				}
			}
		}
	};

	onClose = async tabId => {
		await this.removeTabState(tabId);
	};
}

new Background();
