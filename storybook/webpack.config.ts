import { CleanWebpackPlugin } from "clean-webpack-plugin";

const { rules, plugins } = require("../webpack.shared");

module.exports = baseConfig => {
	let {
		module: { rules: baseRules },
		plugins: basePlugins
	} = baseConfig.config;
	// init rules
	if (!Array.isArray(baseRules)) {
		baseRules = [];
		baseConfig.config.module = baseRules;
	}
	// init plugins
	if (!Array.isArray(basePlugins)) {
		basePlugins = [];
		baseConfig.plugins = basePlugins;
	}

	// add rules
	for (const rule of rules) {
		baseRules.push(rule);
	}

	// add plugins
	for (const plugin of plugins) {
		if (plugin instanceof CleanWebpackPlugin) {
			continue;
		}

		basePlugins.push(plugin);
	}

	return baseConfig.config;
};
