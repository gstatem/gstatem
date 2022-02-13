import React, { FC } from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { create, GSC, newStatem, EqualityFn, State } from "./";
import CounterFC from "../../../storybook/react/base/components/Counter";

type StateProps = {
	count?: number;
};

type CounterTestProps<T extends State> = {
	increaseAmount?: number;
	decreaseAmount?: number;
	incrementButtonText?: string;
	decrementButtonText?: string;
	equalityFn?: EqualityFn<T>;
	customHooks?: VoidFunction;
};

const { useSelect, dispatch, get, set } = create<StateProps>({
	state: { count: 0 }
});

const CounterFCTest: FC<CounterTestProps<StateProps>> = ({
	increaseAmount,
	decreaseAmount,
	incrementButtonText,
	decrementButtonText,
	equalityFn,
	customHooks
}) => {
	const count = useSelect(state => state.count, equalityFn);

	if (customHooks instanceof Function) {
		customHooks();
	}

	return (
		<CounterFC
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

CounterFCTest.defaultProps = {
	increaseAmount: 1,
	decreaseAmount: 1
};

const statem = newStatem<StateProps>({ state: { count: 0 } });

class CounterCC extends GSC<object, StateProps> {
	state = { count: statem.get(({ count }) => count) };

	constructor(props) {
		super(props);
		this.state = {
			count: this.select(
				({ count }) => count, // selector
				({ count }) => this.setState({ count }), // subscriber
				statem
			)
		};
	}

	increaseCount = () => {
		this.dispatch(({ count }) => ({ count: count + 1 }), statem);
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
		render(<CounterFCTest />);
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
			<CounterFCTest
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
			// TODO: 1. get rid of customizing button texts in Counter
			// TODO: 2. gen hyperlink for appendix components
			// TODO: 3. gen README.md examples from storybook examples
			// TODO: 4. add more examples
			counterTests.push(
				<CounterFCTest
					key={`counter_${index}`}
					incrementButtonText={`+${index}`}
					decrementButtonText={`-${index}`}
					customHooks={() => {
						for (let i = 0; i < numOfSelectorForEach; i++) {
							useSelect(({ count }) => count);
						}
					}}
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
		render(<CounterCC />);
		screen.getByText("Count: 0");

		const increaseCountButton = screen.getByRole("button", {
			name: "Increase count"
		});
		fireEvent.click(increaseCountButton);
		screen.getByText("Count: 1");
	});
});
