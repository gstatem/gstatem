import { Component } from "solid-js";
import {
	useCount,
	increaseCount,
	doubleIncreaseCount
} from "./SolidStoreCustomEqual";
import SolidCounter from "../../base/components/SolidCounter";

const SolidCustomEqual: Component = () => {
	const count = useCount();
	return (
		<>
			<SolidCounter value={count} onIncrement={increaseCount} />
			<button onClick={doubleIncreaseCount}>+2</button>
		</>
	);
};

export default SolidCustomEqual;
