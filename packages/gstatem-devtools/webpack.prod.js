/**
 * Created by shuieryin on 01. Nov 2021 10:58 PM.
 */
const path = require("path");
const webpackConfig = require("./webpack.config");
const { optimization } = require("../../webpack.shared");

module.exports = {
	...webpackConfig,
	mode: "production",
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "extension/dist")
	},
	optimization,
	devtool: undefined,
	devServer: undefined
};
