import { defineComponent } from "vue";
import VueJSXCounter from "../../base/components/VueJSXCounter";
import { useCount1, increaseCount1 } from "../VueMultiStores/VueMultiStore1";
import { useCount2, increaseCount2 } from "../VueMultiStores/VueMultiStore2";

export default defineComponent({
	setup() {
		const count1 = useCount1();
		const count2 = useCount2();

		const genCounter = (value, onIncrement) => (
			// @ts-ignore
			<VueJSXCounter value={value} onIncrement={onIncrement} />
		);

		return () => (
			<>
				<div>Store1 {genCounter(count1.value, increaseCount1)}</div>
				<div>Store2 {genCounter(count2.value, increaseCount2)}</div>
			</>
		);
	}
});
