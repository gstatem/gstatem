import React from "react";
import Counter from "../base/components/Counter";
import Store1 from "./base/lib/MultiStore1";
import Store2 from "./base/lib/MultiStore2";

// noinspection JSUnusedGlobalSymbols
export default {
	title: "React/Function component/Multiple stores"
};

export const Counters = () => {
	const count1 = Store1.useSelect<number>(({ count1 }) => count1);
	const count2 = Store2.useSelect<number>(({ count2 }) => count2);

	const increaseCount1 = () =>
		Store1.dispatch(({ count1 }) => ({ count1: count1 + 1 }));
	const decreaseCount1 = () =>
		Store1.dispatch(({ count1 }) => ({ count1: count1 - 1 }));

	const increaseCount2 = () =>
		Store2.dispatch(({ count2 }) => ({ count2: count2 + 1 }));
	const decreaseCount2 = () =>
		Store2.dispatch(({ count2 }) => ({ count2: count2 - 1 }));

	return (
		<>
			State1
			<Counter
				value={count1}
				onIncrement={increaseCount1}
				onDecrement={decreaseCount1}
			/>
			State2
			<Counter
				value={count2}
				onIncrement={increaseCount2}
				onDecrement={decreaseCount2}
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
