// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RawFileContent = string | any;

export type PrettifySource = (payload: {
	content: string;
	isRemoveExportForConst?: boolean;
	replacements?: {
		searchValue: string;
		replaceValue: string;
	}[];
	isRemoveComments?: boolean;
	tabWidth?: number;
	isTrimImportDir?: boolean;
}) => string;

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
