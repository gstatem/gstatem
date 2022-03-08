const { execSync } = require("child_process");
// @ts-ignore
const path = require("path");
const fs = require("fs");
const rimraf = require("rimraf");

const tsConfigPath = path.join(__dirname, "src", "tsconfig.json");
const tsConfig = {
	extends: "../tsconfig.json",
	exclude: ["**/*.test.ts", "**/*.test.tsx"]
};

rimraf.sync(tsConfigPath);
fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig), {
	encoding: "utf-8"
});

let outDir = process.argv[2];
if (!outDir) {
	outDir = path.join(__dirname, "dist");
}

const cmdStr = `tsc --project ${path.join(
	__dirname,
	"src"
)} --outDir ${outDir}`;
console.log(cmdStr);
execSync(cmdStr);
rimraf.sync(tsConfigPath);
