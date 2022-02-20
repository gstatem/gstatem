import React from "react";
import Counter from "../base/components/Counter";
import Store1 from "./base/stores/MultiStore1";
import Store2 from "./base/stores/MultiStore2";

// noinspection JSUnusedGlobalSymbols
export default {
	title: "React/Function component/Multiple stores"
};

export const Counters = () => {
	const count1 = Store1.useSelect<number>(state => state.count1);
	const count2 = Store2.useSelect<number>(state => state.count2);

	const increaseCount1 = () =>
		Store1.dispatch(state => ({ count1: state.count1 + 1 }));

	const increaseCount2 = () =>
		Store2.dispatch(state => ({ count2: state.count2 + 1 }));

	return (
		<>
			State1
			<Counter value={count1} onIncrement={increaseCount1} />
			State2
			<Counter value={count2} onIncrement={increaseCount2} />
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
