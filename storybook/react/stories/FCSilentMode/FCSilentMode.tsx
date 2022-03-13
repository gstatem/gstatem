import React, { FC, useReducer } from "react";
import { getCount, increaseCount } from "./FCStoreSilentMode";
import Counter from "../../base/components/Counter";

const FCSilentMode: FC = () => {
	const rerender = useReducer(x => !x, true)[1];

	return (
		<>
			<button onClick={() => rerender()}>re-render</button>
			<Counter value={getCount()} onIncrement={increaseCount} />
		</>
	);
};

export default FCSilentMode;
