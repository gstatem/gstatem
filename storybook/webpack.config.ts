const path = require("path");
const { rules, plugins } = require("../webpack.shared");

console.log(
	'path.join(__dirname, "solid", "tsconfig.json")',
	path.join(__dirname, "solid", "tsconfig.json")
);

module.exports = baseConfig => {
	baseConfig.config.module.rules = [
		...baseConfig.config.module.rules,
		...rules
	];

	const [miniCssPlugin] = plugins;
	baseConfig.config.plugins = [...baseConfig.config.plugins, miniCssPlugin];

	return baseConfig.config;
};
