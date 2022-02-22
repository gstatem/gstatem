import { FiddleCodeView, PrettifySource } from "./types";
import { FilesInfo } from "../../gen_js";

const filesInfo: FilesInfo = require("../../dist/files-info.json");

export const defaultDocParams = () => ({
	viewMode: "docs",
	previewTabs: {
		canvas: {
			hidden: true
		}
	}
});

export const basename = (content: string) => {
	const matches = content.match(/([^/]+)$/);
	if (matches) {
		return matches[1];
	}
};

export const prettifySource: PrettifySource = ({
	content = "",
	isRemoveExportForConst = false,
	replacements = [],
	isRemoveComments = true,
	tabWidth = 2,
	isTrimImportDir = true
}) => {
	if (!content) return content;

	const contentArr = content.split("//$display-start");
	let returnContent = contentArr[1] || contentArr[0];
	returnContent = returnContent.split("//$display-end")[0] || "";

	if (isRemoveComments) {
		returnContent = returnContent.replace(/^(\s+)?\/\/.*\s+?/gm, "");
	}

	if (isRemoveExportForConst) {
		returnContent = returnContent.replace(/export const/g, "const");
	}

	if (isTrimImportDir) {
		returnContent = returnContent.replace(
			/(import\s+[A-Za-z0-9-{}\s,]+\s+from\s+["'])\.([A-Za-z0-9.\-/]+)(["'];)/g,
			(match, prefix, importPath, suffix) => {
				const componentName = basename(importPath);
				if (componentName) {
					return `${prefix}./${componentName}${suffix}`;
				} else {
					return match;
				}
			}
		);
	}

	for (const { searchValue, replaceValue } of replacements) {
		returnContent = returnContent.replace(searchValue, replaceValue);
	}

	returnContent = returnContent.replace(/\t/g, " ".repeat(tabWidth));
	return returnContent;
};

export const observeUntil = (
	element: HTMLElement,
	callback: (element: HTMLElement) => boolean | unknown,
	observeOptions: MutationObserverInit = { childList: true }
) => {
	if (!(element instanceof HTMLElement)) return;

	const observerCallback = (_mutations?, observer?) => {
		const isObserveDone = callback(element);
		if (isObserveDone && observer) {
			observer.disconnect();
		}
	};
	const observer = new MutationObserver(observerCallback);
	observerCallback(); // for remount;

	observer.observe(element, observeOptions);
	return () => {
		observer.disconnect();
	};
};

export const appendTopRight: FiddleCodeView = (codeView, sourceBlock) => {
	const topRightElement = codeView.getElementsByClassName(
		"code-view__top-right"
	)[0];
	if (topRightElement instanceof HTMLDivElement) {
		sourceBlock.insertBefore(topRightElement, sourceBlock.firstChild);
	}
};

export const genCodeTokenLinks: FiddleCodeView = (_codeView, sourceBlock) => {
	setTimeout(() => {
		const codeBody = sourceBlock.getElementsByTagName("code")[0];
		observeUntil(codeBody, () => {
			const elements = sourceBlock.getElementsByClassName("token class-name");
			for (const element of elements) {
				const { innerHTML: filename } = element;
				const { storybookPath } = filesInfo[filename] || {};
				if (storybookPath) {
					element.classList.add("code-view__token-jump");
					element.addEventListener(
						"click",
						() => {
							parent.location.search = `path=${storybookPath}`;
						},
						{ once: true }
					);
				}
			}
		});
	}, 1000);
};
