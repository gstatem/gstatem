import { Configuration } from "webpack/types";

const webpackConfig = require("./webpack.config");
const { optimization } = require("../../webpack.shared");

module.exports = {
	...webpackConfig,
	mode: "production",
	output: {
		filename: "[name].js",
		path: require("path").resolve(__dirname, "extension/dist")
	},
	optimization,
	devtool: undefined,
	devServer: undefined
} as Configuration;
