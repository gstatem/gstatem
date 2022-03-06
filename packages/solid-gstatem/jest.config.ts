const path = require("path");

module.exports = {
	rootDir: __dirname,
	...require("../../jest.shared"),
	moduleNameMapper: {
		"solid-js/web": "<rootDir>/../../node_modules/solid-js/web/dist/web.cjs",
		"solid-js": "<rootDir>/../../node_modules/solid-js/dist/solid.cjs"
	},
	globals: {
		"ts-jest": {
			tsconfig: path.join(__dirname, "tsconfig.json"),
			babelConfig: require("./babel.config.json")
		}
	}
};
