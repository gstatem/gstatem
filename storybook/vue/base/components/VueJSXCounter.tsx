import { defineComponent } from "vue";

export default defineComponent({
	props: {
		value: {
			type: Number,
			default: 0
		},
		onIncrement: {
			type: Function,
			default: () => {}
		},
		onReset: {
			type: Function,
			default: undefined
		}
	},
	setup(props) {
		return () => (
			<div>
				<span>Clicked: {props.value} times</span>&nbsp;
				<button onClick={() => props.onIncrement()}>+</button>&nbsp;
				{props.onReset && (
					<button onClick={() => props.onReset()}>Reset</button>
				)}
			</div>
		);
	}
});
