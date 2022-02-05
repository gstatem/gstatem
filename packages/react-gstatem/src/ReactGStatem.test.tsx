/**
 * Created by shuieryin on 17. Oct 2021 5:50 PM.
 */

// @ts-ignore
import React, { FC } from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { create, GSC, newStatem, EqualityFn, State } from "./";
import Counter from "../../../storybook/components/Counter";

type StateProps = {
	count?: number;
};

const { useSelect, dispatch, get, set } = create<StateProps>({
	state: { count: 0 }
});

type CounterTestProps<T extends State> = {
	increaseAmount?: number;
	decreaseAmount?: number;
	incrementButtonText?: string;
	decrementButtonText?: string;
	equalityFn?: EqualityFn<T>;
	numOfStressSelectors?: number;
};

const CounterTest: FC<CounterTestProps<StateProps>> = ({
	increaseAmount,
	decreaseAmount,
	incrementButtonText,
	decrementButtonText,
	equalityFn,
	numOfStressSelectors
}) => {
	const count = useSelect(state => state.count, equalityFn);

	for (let i = 0; i < numOfStressSelectors; i++) {
		useSelect(({ count }) => count);
	}

	return (
		<Counter
			value={count}
			onIncrement={() =>
				dispatch(state => ({ count: state.count + increaseAmount }))
			}
			onDecrement={() =>
				dispatch(state => ({ count: state.count - decreaseAmount }))
			}
			incrementButtonText={incrementButtonText}
			decrementButtonText={decrementButtonText}
		/>
	);
};

CounterTest.defaultProps = {
	increaseAmount: 1,
	decreaseAmount: 1,
	numOfStressSelectors: 0
};

const statemCc = newStatem<StateProps>({ state: { count: 0 } });

class CounterCc extends GSC<object, StateProps> {
	state = { count: statemCc.get(({ count }) => count) };

	constructor(props) {
		super(props);
		this.state = {
			count: this.select(
				({ count }) => count, // selector
				({ count }) => this.setState({ count }), // subscriber
				statemCc
			)
		};
	}

	increaseCount = () => {
		this.dispatch(({ count }) => ({ count: count + 1 }), statemCc);
	};

	componentWillUnmount() {
		super.componentWillUnmount();
	}

	render() {
		return (
			<div>
				Count: {this.state.count}
				<button onClick={this.increaseCount}>Increase count</button>
			</div>
		);
	}
}

describe("ReactGStatem test", () => {
	it("renders Counter component", () => {
		render(<CounterTest />);
		screen.getByText("Clicked: 0 times");

		const incrementButton = screen.getByRole("button", { name: "+" });
		fireEvent.click(incrementButton);
		screen.getByText("Clicked: 1 times");

		set({ count: 5 });
		expect(get(({ count }) => count)).toBe(5);

		const decrementButton = screen.getByRole("button", { name: "-" });
		fireEvent.click(decrementButton);
		screen.getByText("Clicked: 4 times");
	});

	it("Custom equalityFn", () => {
		render(
			<CounterTest
				increaseAmount={2}
				decreaseAmount={1}
				equalityFn={({ count: prevCount }, { count: nextCount }) =>
					Math.abs(prevCount - nextCount) < 2
				}
			/>
		);
		screen.getByText("Clicked: 4 times");

		const decrementButton = screen.getByRole("button", { name: "-" });
		fireEvent.click(decrementButton);
		screen.getByText("Clicked: 4 times"); // although the fire button is clicked, the count doesn't trigger re-render of the component as defined in equalityFn, but the actual count is 3.

		const incrementButton = screen.getByRole("button", { name: "+" });
		fireEvent.click(incrementButton);
		screen.getByText("Clicked: 5 times"); // Because the actual count is 3, increasing by 2 will trigger re-render of the component so now shows 5.
	});

	it("Performance testing", () => {
		const numOfComponents = 10;
		const numOfSelectorForEach = 100;
		const counterTests = [];
		for (let i = 0; i < numOfComponents; i++) {
			const index = i + 1;
			counterTests.push(
				<CounterTest
					key={`counter_${index}`}
					incrementButtonText={`+${index}`}
					decrementButtonText={`-${index}`}
					numOfStressSelectors={numOfSelectorForEach}
				/>
			);
		}
		render(<>{counterTests}</>);

		const t1 = performance.now();
		const incrementButton = screen.getByRole("button", {
			name: `+${numOfComponents}`
		});
		fireEvent.click(incrementButton);
		console.log(
			`${numOfComponents} components with ${numOfSelectorForEach} selectors each, took ${
				performance.now() - t1
			} ms.`
		);
	});

	it("GSC for class component", () => {
		render(<CounterCc />);
		screen.getByText("Count: 0");

		const increaseCountButton = screen.getByRole("button", {
			name: "Increase count"
		});
		fireEvent.click(increaseCountButton);
		screen.getByText("Count: 1");
	});
});
