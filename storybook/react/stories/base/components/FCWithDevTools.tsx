import React, { FC } from "react";
import Counter from "../../../base/components/Counter";
import Store from "../lib/FCStoreWithDevTools";
const { useSelect, dispatch } = Store;

const FCWithDevTools: FC = () => {
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

export default FCWithDevTools;
