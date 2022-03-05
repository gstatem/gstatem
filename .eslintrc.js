const solidFiles = ["**/solid/**/*.{js,jsx,ts,tsx}"];

module.exports = {
	parserOptions: {
		ecmaVersion: 6,
		sourceType: "module",
		ecmaFeatures: {
			jsx: true,
			modules: true
		}
	},
	parser: "@babel/eslint-parser",
	rules: {
		"no-console": "off",
		semi: ["error", "always"]
	},
	ignorePatterns: ["packages/*/dist/**/*"],
	extends: ["eslint:recommended", "plugin:prettier/recommended"],
	plugins: ["import", "jsx-a11y", "react"],
	env: {
		browser: true,
		node: true,
		es6: true,
		jest: true,
		webextensions: true
	},
	overrides: [
		{
			files: ["**/*.{js,jsx,ts,tsx}"],
			excludedFiles: solidFiles,
			parser: "@typescript-eslint/parser",
			extends: [
				"plugin:react/recommended",
				"plugin:@typescript-eslint/eslint-recommended",
				"plugin:@typescript-eslint/recommended"
			],
			plugins: ["@typescript-eslint"],
			rules: {
				"@typescript-eslint/no-unused-vars": "off",
				"@typescript-eslint/ban-ts-comment": "off",
				"@typescript-eslint/no-empty-function": "off",
				"@typescript-eslint/no-var-requires": "off"
			}
		},
		{
			files: ["**/*.{md,mdx}"],
			extends: [
				"plugin:mdx/recommended",
				"plugin:mdx/overrides",
				"plugin:mdx/code-blocks"
			],
			rules: {
				semi: "off"
			}
		},
		{
			files: solidFiles,
			parser: "@typescript-eslint/parser",
			parserOptions: {
				project: [
					"./packages/solid-gstatem/tsconfig.json",
					"./storybook/solid/tsconfig.json",
					"./storybook/dist/solid/tsconfig.json"
				]
			},
			plugins: ["solid", "@typescript-eslint"],
			extends: ["plugin:solid/typescript"],
			rules: {
				"solid/reactivity": "off",
				"solid/no-destructure": "off",
				"solid/jsx-no-undef": "error",
				"solid/prefer-show": "off"
			}
		}
	],
	settings: {
		react: {
			version: "detect"
		}
	}
};
