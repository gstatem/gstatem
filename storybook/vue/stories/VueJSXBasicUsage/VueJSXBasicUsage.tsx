import { defineComponent } from "vue";
import VueJSXCounter from "../../base/components/VueJSXCounter";
import { useCount, increaseCount, resetCount } from "../VueBasicUsage/VueStore";

export default defineComponent({
	setup() {
		const count = useCount();

		return () => (
			// @ts-ignore
			<VueJSXCounter
				value={count.value}
				onIncrement={increaseCount}
				onReset={resetCount}
			/>
		);
	}
});
