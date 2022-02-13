import React, { FC, MouseEventHandler } from "react";

type CounterProps = {
	value: number;
	onIncrement: MouseEventHandler<HTMLButtonElement>;
	onDecrement: MouseEventHandler<HTMLButtonElement>;
	incrementButtonText?: string;
	decrementButtonText?: string;
};

const Counter: FC<CounterProps> = ({
	value,
	onIncrement,
	onDecrement,
	incrementButtonText,
	decrementButtonText
}) => {
	return (
		<p>
			<span>Clicked: {value} times</span>{" "}
			<button onClick={onIncrement}>{incrementButtonText}</button>{" "}
			<button onClick={onDecrement}>{decrementButtonText}</button>{" "}
		</p>
	);
};

Counter.defaultProps = {
	incrementButtonText: "+",
	decrementButtonText: "-"
};

export default Counter;
