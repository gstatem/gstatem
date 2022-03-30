module.exports = {
	semi: true,
	trailingComma: "none",
	bracketSpacing: true,
	arrowParens: "avoid",
	useTabs: true,
	overrides: [
		{
			files: "*.svelte",
			options: {
				semi: false,
				bracketSameLine: true
			}
		}
	]
};
