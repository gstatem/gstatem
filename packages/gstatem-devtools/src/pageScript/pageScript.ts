import { GROUP_NAME } from "../utils/Constants";
import { OnAction, OnPageReload } from "../utils/Types";

const listener = e => {
	if (e.source !== window) {
		return;
	}

	const message: OnAction & OnPageReload = e.data || {};
	const { name } = message;

	if (name?.startsWith(GROUP_NAME)) {
		chrome.runtime.sendMessage(message, response => {
			if (response?.status !== "ok") {
				console.error(response);
			}
		});
	}
};

window.addEventListener("message", listener);
