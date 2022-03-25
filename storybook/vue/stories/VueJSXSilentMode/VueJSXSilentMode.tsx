import { defineComponent, getCurrentInstance } from "vue";
import VueJSXCounter from "../../base/components/VueJSXCounter";
import { getCount, increaseCount } from "../VueSilentMode/VueStoreSilentMode";

export default defineComponent({
	setup() {
		const renderCounter = () => (
			// @ts-ignore
			<VueJSXCounter value={getCount()} onIncrement={increaseCount} />
		);
		const instance = getCurrentInstance();
		return () => (
			<>
				<button onClick={() => instance.proxy.$forceUpdate()}>
					force update
				</button>
				{renderCounter()}
			</>
		);
	}
});
