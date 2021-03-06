import { defineConfig } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import stripExports from "rollup-plugin-strip-exports";

const plugins = [commonjs(), nodeResolve(), terser(), stripExports()];

export default defineConfig([
	{
		input: "./dist/background/index.js",
		output: {
			file: "extension/dist/background.js",
			format: "cjs",
			exports: "auto"
		},
		plugins
	},
	{
		input: "./dist/pageScript/pageScript.js",
		output: {
			file: "extension/dist/pageScript.js",
			format: "cjs",
			exports: "auto"
		},
		plugins
	}
]);
