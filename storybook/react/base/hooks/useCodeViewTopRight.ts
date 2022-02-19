import { MutableRefObject, useEffect } from "react";

export default (mountNodeRef: MutableRefObject<HTMLDivElement>) => {
	useEffect(() => {
		const mountNode = mountNodeRef.current;
		if (mountNode instanceof HTMLDivElement) {
			const observerCallback = (_mutations?, observer?) => {
				const sourceBlockElem =
					mountNode.getElementsByClassName("docblock-source")[0];
				const switchButtonsElem = mountNode.getElementsByClassName(
					"code-view__top-right"
				)[0];

				if (
					sourceBlockElem instanceof HTMLDivElement &&
					switchButtonsElem instanceof HTMLDivElement
				) {
					sourceBlockElem.insertBefore(
						switchButtonsElem,
						sourceBlockElem.firstChild
					);

					if (observer) {
						observer.disconnect();
					}
				}
			};
			const observer = new MutationObserver(observerCallback);
			observerCallback(); // for remount;

			observer.observe(mountNode, { childList: true });
			return () => {
				observer.disconnect();
			};
		}
	}, []);
};
