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

type WalkPath<T> = (
	baseDir: T,
	callback: (filePath: string) => void,
	options: {
		extensions?: string[];
	}
) => void;

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

const replaceInFiles = (
	dirs,
	searchValue,
	replaceValue,
	extensions = ["ts", "tsx"]
) => {
	walkPaths(
		dirs.map(dir => path.join(workDir, dir)),
		filePath => {
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
};

(async () => {
	console.log("Generating JS files...");
	rimraf.sync(outputDir);

	replaceInFiles(resourceDirs, /\n{2}/g, `\n${blankLineKey}\n`);

	const toJsCmd = `tsc -p ${workDir}`;
	console.log(toJsCmd);
	await cmd(toJsCmd);

	replaceInFiles([...resourceDirs, "dist"], new RegExp(blankLineKey, "g"), "", [
		"js",
		"jsx",
		"ts",
		"tsx"
	]);

	const prettierCmd = `eslint -c ${eslintConfigPath} --rule "{'react/prop-types': 0}" --ext js,jsx --fix ${outputDir}`;
	console.log(prettierCmd);
	await cmd(prettierCmd);
})();
