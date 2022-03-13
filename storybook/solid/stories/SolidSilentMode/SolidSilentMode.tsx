import { Component } from "solid-js";
import { useCount, increaseCount, refreshCount } from "./SolidStoreSilentMode";
import SolidCounter from "../../base/components/SolidCounter";

const SolidSilentMode: Component = () => {
	const count = useCount();
	return (
		<>
			<button onClick={refreshCount}>re-render</button>
			<SolidCounter value={count} onIncrement={increaseCount} />
		</>
	);
};

export default SolidSilentMode;
