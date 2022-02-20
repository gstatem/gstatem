import { AppendixComponents } from "./base/lib/types";

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const rimraf = require("rimraf");

const workDir = path.resolve(__dirname);
const parentDir = path.resolve(path.join(__dirname, ".."));
const outputDir = path.resolve(path.join(__dirname, "./dist"));
const eslintConfigPath = path.join(parentDir, ".eslintrc");
const resourceDirs = ["base", "react", "vanilla"];
const blankLineKey = "//_blank-line";
const appendixComponentsInfo: AppendixComponents = require("./base/lib/appendix-components.json");

type WalkPath<T> = (
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

export type ReplaceInFiles = (payload: ReplaceInFilesPayload) => FilesInfo;

const cmd = (cmdStr: string) =>
	new Promise<void>(resolve => {
		exec(cmdStr, (error, stdout, stderr) => {
			console.log(stdout);
			if (error) {
				throw new Error(error.message);
			}
			if (stderr) {
				throw new Error(stderr);
			}
			resolve();
		});
	});

const walkPath: WalkPath<string> = (baseDir, callback, options = {}) => {
	const { extensions } = options;
	const files = fs.readdirSync(baseDir);

	files.forEach(file => {
		const filePath = path.join(baseDir, file);
		if (fs.statSync(filePath).isDirectory()) {
			walkPath(filePath, callback, options);
		} else {
			if (
				Array.isArray(extensions) &&
				!extensions.includes(path.extname(file).replace(".", ""))
			) {
				return;
			}

			callback(filePath);
		}
	});
};

const walkPaths: WalkPath<string[]> = (baseDirs, callback, options) => {
	for (const baseDir of baseDirs) {
		walkPath(baseDir, callback, options);
	}
};

const replaceInFiles: ReplaceInFiles = ({
	dirs,
	searchValue,
	replaceValue,
	extensions = ["ts", "tsx"]
}) => {
	const filesInfo: FilesInfo = {};
	walkPaths(
		dirs.map(dir => path.join(workDir, dir)),
		filePath => {
			const filename = path.basename(filePath);
			const extName = path.extname(filename);
			const fileBasename = filename.replace(extName, "");
			const config: FileInfo = {
				filename,
				fileBasename,
				extName,
				relativeFilePath: path.join(".", filePath.replace(__dirname, "")),
				fullFilePath: filePath
			};
			const { path: storybookPath } =
				appendixComponentsInfo[fileBasename] ||
				appendixComponentsInfo[filename] ||
				{};

			if (storybookPath) {
				config.storybookPath = storybookPath;
			}

			filesInfo[fileBasename] = config;
			filesInfo[filename] = config;

			const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });
			fs.writeFileSync(
				filePath,
				fileContent.replace(searchValue, replaceValue),
				{ encoding: "utf-8" }
			);
		},
		{
			extensions
		}
	);

	return filesInfo;
};

(async () => {
	console.log("Start Generating files...\n");
	rimraf.sync(outputDir);
	fs.mkdirSync(outputDir, { recursive: true });

	const filesInfo = replaceInFiles({
		dirs: resourceDirs,
		searchValue: /\n{2}/g,
		replaceValue: `\n${blankLineKey}\n`
	});

	const filesInfoFilePath = path.join(outputDir, "files-info.json");
	fs.writeFileSync(filesInfoFilePath, JSON.stringify(filesInfo), {
		encoding: "utf-8"
	});
	console.log(`Generated files info to [${filesInfoFilePath}].\n`);

	const toJsCmd = `tsc -p ${workDir}`;
	console.log(toJsCmd);
	await cmd(toJsCmd);

	replaceInFiles({
		dirs: [...resourceDirs, "dist"],
		searchValue: new RegExp(blankLineKey, "g"),
		replaceValue: "",
		extensions: ["js", "jsx", "ts", "tsx"]
	});

	const prettierCmd = `eslint -c ${eslintConfigPath} --rule "{'react/prop-types': 0}" --ext js,jsx --fix ${outputDir}`;
	console.log(prettierCmd);
	await cmd(prettierCmd);
})();
