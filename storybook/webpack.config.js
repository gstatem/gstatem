const MiniCssExtractPlugin = require("mini-css-extract-plugin").default;
const { rules } = require("../webpack.shared");

module.exports = baseConfig => {
	baseConfig.config.module.rules = rules;
	baseConfig.config.plugins.push(new MiniCssExtractPlugin());
	return baseConfig.config;
};
