import { Component } from "solid-js";
import SolidCounter from "../../base/components/SolidCounter";
import { increaseCount, resetCount, useCount } from "./SolidStoreWithDevTools";

const SolidWithDevTools: Component = () => {
	const count = useCount();

	return (
		<SolidCounter
			value={count}
			onIncrement={increaseCount}
			onReset={resetCount}
		/>
	);
};

export default SolidWithDevTools;
