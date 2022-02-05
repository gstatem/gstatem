// noinspection JSUnusedGlobalSymbols

/**
 * Created by shuieryin on 16. Oct 2021 11:57 AM.
 */

import React from "react";
import Counter from "../components/Counter";
import State3 from "../lib/State3";
const { useSelect, dispatch } = State3;

export default {
	title: "Single statem"
};

export const counter = () => {
	const count = useSelect(({ count }) => count);

	return (
		<>
			State3
			<Counter
				value={count}
				onIncrement={() => dispatch(({ count }) => ({ count: count + 1 }))}
				onDecrement={() => dispatch(({ count }) => ({ count: count - 1 }))}
			/>
		</>
	);
};

counter.parameters = {
	options: { showPanel: false },
	previewTabs: {
		"storybook/docs/panel": {
			hidden: true
		}
	}
};
