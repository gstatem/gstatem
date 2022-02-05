/**
 * Created by shuieryin on 17. Oct 2021 10:07 AM.
 */

import React, { FC, MouseEventHandler } from "react";
import { State1Props } from "../lib/State1";
import { State2Props } from "../lib/State2";
import { State3Props } from "../lib/State3";
import { ValueOf } from "gstatem";

type CounterProps = {
	value: ValueOf<State1Props> | ValueOf<State2Props> | ValueOf<State3Props>;
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
	const incrementIfOdd: MouseEventHandler<HTMLButtonElement> = e => {
		if (typeof value === "number" && value % 2 !== 0) {
			onIncrement(e);
		}
	};

	const incrementAsync = () => {
		setTimeout(onIncrement, 1000);
	};

	return (
		<p>
			<span
				style={{
					color: "lightcoral"
				}}
			>
				Clicked: {value} times
			</span>{" "}
			<button onClick={onIncrement}>{incrementButtonText}</button>{" "}
			<button onClick={onDecrement}>{decrementButtonText}</button>{" "}
			<button onClick={incrementIfOdd}>Increment if odd</button>{" "}
			<button onClick={incrementAsync}>Increment async</button>
		</p>
	);
};

Counter.defaultProps = {
	incrementButtonText: "+",
	decrementButtonText: "-"
};

export default Counter;
