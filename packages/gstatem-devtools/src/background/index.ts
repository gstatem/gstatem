import {
	CHANNEL_NAME,
	PAGE_OPEN,
	GROUP_NAME,
	MARK_AS_READ,
	MERGE_STEPS,
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
	Step
} from "../utils/Types";
import { getStepState, setStepState } from "../utils/Utils";

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
			tabState = { statemStepMap: {} };
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
			case MERGE_STEPS:
				this.mergeSteps(message, tabState);
				break;
		}
	};

	markAsRead = ({ readSteps }: PageToBg, { statemStepMap }: TabState) => {
		let needSave = false;
		for (const statemId in readSteps) {
			const stepIds = readSteps[statemId];
			const stepMap = statemStepMap[statemId];
			if (!stepMap) {
				console.warn(
					`[${statemId}] is not found in statemStepMap ${statemStepMap}`
				);
				continue;
			}

			for (const stepId of stepIds) {
				const step = stepMap[stepId];
				step.isRead = true;
				needSave = true;
			}
		}

		if (needSave) {
			this.saveTabStates();
		}
	};

	mergeSteps = (
		{ mergeSteps: { statemId, sourceStepIds, targetStepId } }: PageToBg,
		{ statemStepMap }: TabState
	) => {
		const stepMap = statemStepMap[statemId];
		const stepsToBeMerged: Step[] = [];
		const mergeStepStates = {};
		for (const stepId of sourceStepIds) {
			const step = stepMap[stepId];
			stepsToBeMerged.push(step);
			delete stepMap[stepId];
		}
		stepsToBeMerged.sort((a, b) => a.timestamp - b.timestamp);
		for (const { payload: stepPayloadToBeMerged } of stepsToBeMerged) {
			Object.assign(mergeStepStates, getStepState(stepPayloadToBeMerged));
		}

		const { payload: targetPayload } = stepMap[targetStepId];
		const targetStepState = getStepState(targetPayload);
		Object.assign(mergeStepStates, targetStepState);
		setStepState(targetPayload, mergeStepStates);
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
		const port = this.connections[tabId];
		const tabState = await this.getTabState(tabId);
		const { statemStepMap } = tabState;
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
					const { step }: OnAction = message;
					const {
						stepId,
						payload: { statemId },
						action
					} = step;

					if (validActions[action]) {
						let stepMap = statemStepMap[statemId];
						if (!stepMap) {
							stepMap = {};
							statemStepMap[statemId] = stepMap;
						}
						stepMap[stepId] = step;
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
