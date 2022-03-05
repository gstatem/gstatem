import { Component, JSX } from "solid-js";

type CounterProps = {
	value: number;
	onIncrement: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
	onReset?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
};

const SolidCounter: Component<CounterProps> = ({
	value,
	onIncrement,
	onReset
}) => {
	return (
		<div>
			<span>Clicked: {value} times</span>{" "}
			<button onClick={onIncrement}>+</button>{" "}
			{onReset && <button onClick={onReset}>Reset</button>}
		</div>
	);
};

export default SolidCounter;
