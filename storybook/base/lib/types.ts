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

export type FiddleCodeView = (
	codeView: HTMLDivElement,
	sourceBlock: HTMLDivElement
) => void;

export type AppendixComponent = {
	path: string;
};

export type AppendixComponents = {
	[componentName: string]: AppendixComponent;
};