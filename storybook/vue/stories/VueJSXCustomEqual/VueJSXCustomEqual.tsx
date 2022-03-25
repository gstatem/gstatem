import { defineComponent } from "vue";
import VueJSXCounter from "../../base/components/VueJSXCounter";
import {
	useCount,
	increaseCount,
	doubleIncreaseCount
} from "../VueCustomEqual/VueStoreCustomEqual";

export default defineComponent({
	setup() {
		const count = useCount();
		const renderCounter = () => (
			// @ts-ignore
			<VueJSXCounter value={count.value} onIncrement={increaseCount} />
		);

		return () => (
			<>
				{renderCounter()}
				<button onClick={doubleIncreaseCount}>+2</button>
			</>
		);
	}
});
