module.exports = {
	rootDir: __dirname,
	...require("../../jest.shared"),
	transform: {
		"\\.[j|t]sx?$": "ts-jest",
		"\\.vue$": "@vue/vue3-jest"
	}
};
