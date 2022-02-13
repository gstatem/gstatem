import React, { FC } from "react";
import Counter from "../../../base/components/Counter";
import Store from "../lib/FCStore";
const { useSelect, dispatch } = Store;

const FCBasicUsage: FC = () => {
	const count = useSelect(({ count }) => count);

	const increaseCount = () => dispatch(({ count }) => ({ count: count + 1 }));
	const decreaseCount = () => dispatch(({ count }) => ({ count: count - 1 }));

	return (
		<Counter
			value={count}
			onIncrement={increaseCount}
			onDecrement={decreaseCount}
		/>
	);
};

export default FCBasicUsage;
