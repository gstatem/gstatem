import {
	AppendixComponents,
	CopyFiles,
	FileInfo,
	FilesInfo,
	ProjectConfigs,
	ReplaceInFiles,
	WalkPath
} from "./base/lib/types";

const { exec } = require("child_process");
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

const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");

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

const copyfiles: CopyFiles = ({
	workDir = "./",
	dir,
	outDir,
	ext,
	outExt,
	callback
}) => {
	const baseDir = path.join(workDir, dir);
	walkPath(
		baseDir,
		filePath => {
			const relativePath = filePath.replace(baseDir, "");
			let curOutPath = path.join(workDir, outDir, relativePath);
			const extName = path.extname(curOutPath);
			curOutPath = curOutPath.replace(extName, `.${outExt}`);

			const curOutDir = path.dirname(curOutPath);
			fs.mkdirSync(curOutDir, { recursive: true });

			fs.writeFileSync(
				curOutPath,
				fs.readFileSync(filePath, { encoding: "utf-8" }),
				{ encoding: "utf-8" }
			);

			if (callback instanceof Function) {
				const filename = path.basename(filePath);
				callback({
					filename,
					fileBasename: filename.replace(extName, ""),
					extName,
					relativeFilePath: path.join("./", curOutPath.replace(baseDir, "")),
					fullFilePath: curOutPath
				});
			}
		},
		{
			extensions: [ext]
		}
	);
};

const workDir = path.resolve(__dirname);
const projectConfigs: ProjectConfigs = [
	{
		dir: "."
	},
	{
		dir: "solid",
		tsConfig: {
			extends: "../../../packages/solid-gstatem/tsconfig.json"
		}
	},
	{
		dir: "vue",
		tsConfig: {
			extends: "../../../packages/vue-gstatem/tsconfig.json"
		},
		afterDone: () => {
			const filesInfo: FilesInfo = {};
			copyfiles({
				workDir,
				dir: "./vue",
				outDir: "./dist/vue",
				ext: "vue",
				outExt: "txt",
				callback: fileInfo => {
					const { filename, fileBasename } = fileInfo;
					const { path: storybookPath } =
						appendixComponentsInfo[fileBasename] ||
						appendixComponentsInfo[filename] ||
						{};

					if (storybookPath) {
						fileInfo.storybookPath = storybookPath;
					}

					filesInfo[fileBasename] = fileInfo;
					filesInfo[filename] = fileInfo;
				}
			});
			return filesInfo;
		}
	},
	{
		dir: "svelte",
		tsConfig: {
			extends: "../../../packages/svelte-gstatem/tsconfig.json"
		}
	}
];
const parentDir = path.resolve(path.join(__dirname, ".."));
const outputDir = path.resolve(path.join(__dirname, "./dist"));
const eslintConfigPath = path.join(parentDir, ".eslintrc.js");
const resourceDirs = ["base", "react", "solid", "vue", "svelte", "vanilla"];
const blankLineKey = "//_blank-line";
const appendixComponentsInfo: AppendixComponents = require("./base/lib/appendix-components.json");

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
				relativeFilePath: path.join("./", filePath.replace(__dirname, "")),
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
	console.log("Start generating files...\n");
	rimraf.sync(outputDir);
	fs.mkdirSync(outputDir, { recursive: true });

	const filesInfo = replaceInFiles({
		dirs: resourceDirs,
		searchValue: /\n{2}/g,
		replaceValue: `\n${blankLineKey}\n`
	});

	for (const { dir, tsConfig } of projectConfigs) {
		const toJsCmd = `tsc -p ${path.join(workDir, dir)}`;
		console.log(toJsCmd);
		await cmd(toJsCmd);
		if (tsConfig) {
			fs.writeFileSync(
				path.join(outputDir, dir, "tsconfig.json"),
				JSON.stringify(tsConfig)
			);
		}
	}

	replaceInFiles({
		dirs: [...resourceDirs, "dist"],
		searchValue: new RegExp(blankLineKey, "g"),
		replaceValue: "",
		extensions: ["js", "jsx", "ts", "tsx"]
	});

	const inlineRules = {
		"react/prop-types": "off",
		"no-unused-vars": "off"
	};

	const prettierCmd = `eslint -c ${eslintConfigPath} --rule "${JSON.stringify(
		inlineRules
	)}" --ext js,jsx --fix ${outputDir}`;
	console.log(prettierCmd);
	await cmd(prettierCmd);

	for (const { afterDone } of projectConfigs) {
		if (afterDone instanceof Function) {
			const curFilesInfo = afterDone();
			Object.assign(filesInfo, curFilesInfo);
		}
	}

	const filesInfoFilePath = path.join(outputDir, "files-info.json");
	fs.writeFileSync(filesInfoFilePath, JSON.stringify(filesInfo), {
		encoding: "utf-8"
	});
	console.log(`Generated files info to [${filesInfoFilePath}].\n`);
})();
