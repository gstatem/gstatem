import { TsConfigJson } from "type-fest";

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

export type FileInfo = {
	fileBasename: string;
	filename: string;
	extName: string;
	relativeFilePath: string;
	fullFilePath: string;
	storybookPath?: string;
};

export type FilesInfo = {
	[fileBasename: string]: FileInfo;
};

export type ProjectConfig = {
	dir: string;
	tsConfig?: TsConfigJson;
	afterDone?: () => FilesInfo;
};

export type ProjectConfigs = ProjectConfig[];

export type WalkPath<T> = (
	baseDir: T,
	callback: (filePath: string) => void,
	options: {
		extensions?: string[];
	}
) => void;

export type GenSbJsExtension = "js" | "jsx" | "ts" | "tsx";

export type ReplaceInFilesPayload = {
	dirs: string[];
	searchValue: string | RegExp;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	replaceValue: string | ((substring: string, ...args: any[]) => string);
	extensions?: GenSbJsExtension[];
};

export type ReplaceInFiles = (payload: ReplaceInFilesPayload) => FilesInfo;

export type CopyFiles = (config: {
	workDir?: string;
	dir: string;
	outDir: string;
	ext: string;
	outExt: string;
	callback?: (config: FileInfo) => void;
}) => void;
