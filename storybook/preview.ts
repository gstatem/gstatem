import "!style-loader!css-loader!less-loader!./base/assets/global.less";
import { create, themes } from "@storybook/theming";
import { ThemeVars } from "@storybook/theming/dist/ts3.9/types";

const themeConfig: ThemeVars = {
	base: "dark",
	brandTitle: "GStatem examples",
	brandUrl: "https://github.com/gstatem/gstatem"
};

const darkTheme = create(themeConfig);

const lightTheme = create({
	...themeConfig,
	base: "light"
});

const exampleOrder = [
	"Basic usage",
	"With DevTools",
	"Multiple stores",
	"Silent mode",
	"Custom equal"
];

export const parameters = {
	darkMode: {
		current: "dark",
		dark: darkTheme,
		light: lightTheme
	},
	docs: {
		theme: themes.dark
	},
	controls: { hideNoControlsWarning: true },
	options: {
		storySort: {
			order: [
				"React",
				["Function component", exampleOrder, "Class component", exampleOrder],
				"Solid",
				exampleOrder,
				"Vue",
				"Vanilla",
				"Appendix"
			]
		}
	}
};
