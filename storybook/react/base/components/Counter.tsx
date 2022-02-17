import React, { FC, MouseEventHandler } from "react";

type CounterProps = {
	value: number;
	onIncrement: MouseEventHandler<HTMLButtonElement>;
	onDecrement: MouseEventHandler<HTMLButtonElement>;
	onReset?: MouseEventHandler<HTMLButtonElement>;
};

const Counter: FC<CounterProps> = ({
	value,
	onIncrement,
	onDecrement,
	onReset
}) => {
	return (
		<div>
			<span>Clicked: {value} times</span>{" "}
			<button onClick={onIncrement}>+</button>{" "}
			<button onClick={onDecrement}>-</button>{" "}
			<button onClick={onReset}>Reset</button>
		</div>
	);
};

export default Counter;
