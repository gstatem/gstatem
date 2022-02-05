module.exports = {
	stories: ["./stories/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"storybook-dark-mode"
	],
	core: {
		builder: "webpack5"
	}
};
