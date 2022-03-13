import { Component } from "solid-js";
import SolidCounter from "../../base/components/SolidCounter";
import { useCount1, increaseCount1 } from "./SolidMultiStore1";
import { useCount2, increaseCount2 } from "./SolidMultiStore2";

const SolidMultiStores: Component = () => {
	const count1 = useCount1();
	const count2 = useCount2();

	return (
		<>
			Store1 <SolidCounter value={count1} onIncrement={increaseCount1} />
			Store2 <SolidCounter value={count2} onIncrement={increaseCount2} />
		</>
	);
};

export default SolidMultiStores;
