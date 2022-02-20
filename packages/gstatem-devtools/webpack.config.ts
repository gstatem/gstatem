import { Configuration } from "webpack/types";

const path = require("path");
const { rules, plugins } = require("../../webpack.shared");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackShellPluginNext = require("webpack-shell-plugin-next");

module.exports = {
	mode: "development",
	entry: {
		"app/index": "./src/app/index.tsx",
		"devtoolsPage/index": "./src/devtoolsPage/index.ts"
	},
	devtool: "inline-source-map",
	module: { rules },
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},
	output: {
		path: path.resolve(__dirname, "extension/dist")
	},
	plugins: [
		...plugins,
		new HtmlWebpackPlugin({
			filename: "app/index.html",
			template: "public/app.html",
			chunks: ["app/index"]
		}),
		new HtmlWebpackPlugin({
			filename: "devtoolsPage/index.html",
			template: "public/devtoolsPage.html",
			chunks: ["devtoolsPage/index"]
		}),
		new WebpackShellPluginNext({
			onBuildEnd: {
				scripts: ["npm run build"]
			}
		})
	],
	devServer: {
		devMiddleware: {
			writeToDisk: true
		}
	}
} as Configuration;
