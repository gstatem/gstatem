import React, { FC } from "react";
import Counter from "../../base/components/Counter";
import { increaseCount, resetCount, useCount } from "./FCStore";

const FCBasicUsage: FC = () => {
	const count = useCount();
	return (
		<Counter value={count} onIncrement={increaseCount} onReset={resetCount} />
	);
};

export default FCBasicUsage;
