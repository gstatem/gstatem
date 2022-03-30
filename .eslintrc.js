const solidFiles = ["**/{solid,solid-gstatem}/**/*.{js,jsx,ts,tsx}"];
const vueFiles = ["**/{vue,vue-gstatem}/**/*.{js,jsx,ts,tsx,vue}"];

module.exports = {
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module"
	},
	parser: "@babel/eslint-parser",
	rules: {
		"no-console": "off",
		semi: ["error", "always"]
	},
	ignorePatterns: ["packages/*/dist/**/*"],
	extends: ["eslint:recommended", "plugin:prettier/recommended"],
	plugins: ["import"],
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
			excludedFiles: [...solidFiles, ...vueFiles],
			parser: "@typescript-eslint/parser",
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
					modules: true
				}
			},
			extends: [
				"plugin:react/recommended",
				"plugin:@typescript-eslint/eslint-recommended",
				"plugin:@typescript-eslint/recommended"
			],
			plugins: ["@typescript-eslint", "jsx-a11y", "react"],
			rules: {
				"@typescript-eslint/ban-ts-comment": "off",
				"@typescript-eslint/no-empty-function": "off",
				"@typescript-eslint/no-var-requires": "off"
			},
			settings: {
				react: {
					version: "detect"
				}
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
		},
		{
			files: vueFiles,
			parser: "vue-eslint-parser",
			parserOptions: {
				parser: "@typescript-eslint/parser",
				extraFileExtensions: [".vue"],
				project: [
					"./packages/vue-gstatem/tsconfig.json",
					"./storybook/vue/tsconfig.json",
					"./storybook/dist/vue/tsconfig.json"
				]
			},
			plugins: ["vue"],
			extends: ["plugin:vue/vue3-strongly-recommended"],
			rules: {
				"vue/script-setup-uses-vars": "error",
				"vue/html-indent": "off",
				"vue/multi-word-component-names": "off",
				"vue/singleline-html-element-content-newline": "off",
				"vue/max-attributes-per-line": "off",
				"vue/attribute-hyphenation": "off"
			},
			env: {
				"vue/setup-compiler-macros": true
			}
		},
		{
			files: ["**/*.svelte"],
			parser: "@typescript-eslint/parser",
			processor: "svelte3/svelte3",
			plugins: ["svelte3", "@typescript-eslint", "es"],
			settings: {
				"svelte3/typescript": true
			},
			rules: {
				semi: ["error", "never"]
			}
		}
	]
};
