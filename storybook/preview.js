// noinspection JSUnusedGlobalSymbols

import { themes } from "@storybook/theming";

export const parameters = {
	darkMode: {
		current: "dark",
		dark: themes.dark,
		light: themes.light
	},
	docs: {
		theme: themes.dark
	}
};
