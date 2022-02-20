import React, { FC, MouseEventHandler } from "react";

type CounterProps = {
	value: number;
	onIncrement: MouseEventHandler<HTMLButtonElement>;
	onReset?: MouseEventHandler<HTMLButtonElement>;
};

const Counter: FC<CounterProps> = ({ value, onIncrement, onReset }) => {
	return (
		<div>
			<span>Clicked: {value} times</span>{" "}
			<button onClick={onIncrement}>+</button>{" "}
			<button onClick={onReset}>Reset</button>
		</div>
	);
};

export default Counter;
