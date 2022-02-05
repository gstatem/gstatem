// noinspection JSUnusedGlobalSymbols

/**
 * Created by shuieryin on 16. Oct 2021 11:57 AM.
 */

import React from "react";
import Counter from "../components/Counter";
import State1 from "../lib/State1";
import State2 from "../lib/State2";

export default {
	title: "Multiple statems"
};

export const Counters = () => {
	const count1 = State1.useSelect<number>(({ count1 }) => count1);
	const count2 = State2.useSelect<number>(({ count2 }) => count2);

	return (
		<>
			State1
			<Counter
				value={count1}
				onIncrement={() =>
					State1.dispatch(
						({
							count1,
							cd: {
								jk: { po }
							}
						}) => {
							console.log("deep nested string", po);
							return { count1: count1 + 1 };
						}
					)
				}
				onDecrement={() =>
					State1.dispatch(({ count1 }) => ({ count1: count1 - 1 }))
				}
			/>
			State2
			<Counter
				value={count2}
				onIncrement={() =>
					State2.dispatch(({ count2 }) => ({ count2: count2 + 1 }))
				}
				onDecrement={() =>
					State2.dispatch(({ count2 }) => ({ count2: count2 - 1 }))
				}
			/>
		</>
	);
};

Counters.parameters = {
	options: { showPanel: false },
	previewTabs: {
		"storybook/docs/panel": {
			hidden: true
		}
	}
};
