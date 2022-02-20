import { addons } from "@storybook/addons";

addons.setConfig({
	toolbar: {
		title: { hidden: true },
		zoom: { hidden: true },
		eject: { hidden: true },
		copy: { hidden: true },
		theme: { hidden: true },
		"storybook/background": { hidden: true },
		"storybook/viewport": { hidden: true },
		"storybook/outline": { hidden: true }
	}
});
