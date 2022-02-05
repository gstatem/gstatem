/**
 * Created by shuieryin on 30. Oct 2021 2:37 PM.
 */

import { GROUP_NAME } from "../utils/Constants";
import { OnAction, OnPageReload } from "../utils/Types";

const listener = e => {
	if (e.source !== window) {
		return;
	}

	const message: OnAction & OnPageReload = e.data || {};
	const { name } = message;

	if (name?.startsWith(GROUP_NAME)) {
		chrome.runtime.sendMessage(message);
	}
};

window.addEventListener("message", listener);
