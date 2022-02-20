import { MutableRefObject, useEffect } from "react";
import { observeUntil } from "../../../base/lib/utils";
import { FiddleCodeView } from "../../../base/lib/types";

export default (
	viewRef: MutableRefObject<HTMLDivElement>,
	onCodeBlockMount?: FiddleCodeView
) => {
	useEffect(() => {
		const codeView = viewRef.current;
		observeUntil(codeView, () => {
			const sourceBlock = codeView.getElementsByClassName("docblock-source")[0];

			if (sourceBlock instanceof HTMLDivElement) {
				if (onCodeBlockMount instanceof Function) {
					onCodeBlockMount(codeView, sourceBlock);
				}
				return true;
			}
		});
	}, []);
};
