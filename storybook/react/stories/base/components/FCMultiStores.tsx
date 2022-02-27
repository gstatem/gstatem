import React, { FC } from "react";
import Counter from "../../../base/components/Counter";
import { useCount1, increaseCount1 } from "../stores/FCMultiStore1";
import { useCount2, increaseCount2 } from "../stores/FCMultiStore2";

const FCMultiStores: FC = () => {
	const count1 = useCount1();
	const count2 = useCount2();

	return (
		<>
			Store1 <Counter value={count1} onIncrement={increaseCount1} />
			Store2 <Counter value={count2} onIncrement={increaseCount2} />
		</>
	);
};

export default FCMultiStores;
