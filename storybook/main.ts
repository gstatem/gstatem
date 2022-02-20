module.exports = {
	stories: ["./**/*.@(story|stories).@(js|jsx|ts|tsx|mdx)"],
	addons: [
		"@storybook/addon-docs",
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"storybook-dark-mode"
	],
	core: {
		builder: "webpack5"
	}
};
