import React, { FC } from "react";
import Counter from "../../base/components/Counter";
import {
	useCount,
	increaseCount,
	doubleIncreaseCount
} from "./FCStoreCustomEqual";

const FCCustomEqual: FC = () => {
	const count = useCount();
	return (
		<>
			<Counter value={count} onIncrement={increaseCount} />
			<button onClick={doubleIncreaseCount}>+2</button>
		</>
	);
};

export default FCCustomEqual;
