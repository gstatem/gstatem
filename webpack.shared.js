/**
 * Created by shuieryin on 31. Oct 2021 10:52 PM.
 */

const babelConfig = require("./babel.config");
const MiniCssExtractPlugin = require("mini-css-extract-plugin").default;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

// noinspection WebpackConfigHighlighting
module.exports = {
	rules: [
		{
			test: /\.html$/,
			loader: "html-loader"
		},

		{
			test: /\.tsx?$/,
			use: "ts-loader",
			exclude: /node_modules/
		},

		{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			use: [
				{
					loader: "babel-loader",
					options: babelConfig
				}
			]
		},

		{
			test: /\.(less|css)$/,
			use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]
		},

		{
			test: /\.(jpg|png|woff|woff2|eot|ttf|ttc|svg)$/,
			use: [
				{
					loader: "file-loader",
					options: {
						name: "images/[name].[ext]"
					}
				}
			]
		}
	],
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: "[name].[contenthash:8].css",
			chunkFilename: "[id].[name].[contenthash:8].css"
		})
	],
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					format: {
						comments: false
					}
				},
				extractComments: false
			})
		]
	}
};
