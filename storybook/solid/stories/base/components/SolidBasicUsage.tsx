import { createSignal, Component } from "solid-js";
import SolidCounter from "../../../base/components/SolidCounter";

const SolidBasicUsage: Component = () => {
	const [count, setCount] = createSignal(0);

	const increaseCount = () => setCount(count() + 1);
	const resetCount = () => setCount(0);

	return (
		<SolidCounter
			value={count}
			onIncrement={increaseCount}
			onReset={resetCount}
		/>
	);
};

export default SolidBasicUsage;
