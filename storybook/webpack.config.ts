const { rules, plugins } = require("../webpack.shared");

module.exports = baseConfig => {
	baseConfig.config.module.rules = [
		...baseConfig.config.module.rules,
		...rules
	];
	baseConfig.config.plugins = [...baseConfig.config.plugins, ...plugins];
	return baseConfig.config;
};
