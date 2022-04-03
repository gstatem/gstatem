import { TsConfigJson } from "type-fest";

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const rimraf = require("rimraf");

const workDir = process.cwd();
const tsConfigPath = path.join(workDir, "src", "tsconfig.json");
const tsConfig: TsConfigJson = {
	extends: "../tsconfig.json",
	compilerOptions: {
		sourceMap: false
	},
	exclude: ["**/*.test.js", "**/*.test.jsx", "**/*.test.ts", "**/*.test.tsx"]
};

rimraf.sync(tsConfigPath);
fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig), {
	encoding: "utf-8"
});

let outDir = process.argv[2];
if (!outDir) {
	outDir = path.join(workDir, "dist");
}

const cmdStr = `tsc --project ${path.join(workDir, "src")} --outDir ${outDir}`;
console.log(cmdStr);
execSync(cmdStr);
rimraf.sync(tsConfigPath);

export {}; // resolve TS2451: Cannot redeclare block-scoped variable 'path'.
