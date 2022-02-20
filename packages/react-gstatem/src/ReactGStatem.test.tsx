import React, { Component, FC } from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { create, EqualityFn, State } from "./";
import CounterFC from "../../../storybook/react/base/components/Counter";
import GStatem, { Init, SelectState, SetOptions } from "gstatem";

type StateProps = {
	count?: number;
};

type CounterTestProps<T extends State> = {
	equalityFn?: EqualityFn<T>;
	customHooks?: VoidFunction;
};

const initialConfig = { state: { count: 0 } };
const countSelector = state => state.count;
const { useSelect, dispatch, get, set, select, subscribe, unsubscribe } =
	create<StateProps>(initialConfig);

const increaseCount = () => dispatch(state => ({ count: state.count + 1 }));
const reset = () => dispatch({ count: 0 });

const CounterFCTest: FC<CounterTestProps<StateProps>> = ({
	equalityFn,
	customHooks
}) => {
	const count = useSelect(state => state.count, equalityFn);

	if (customHooks instanceof Function) {
		customHooks();
	}

	return (
		<CounterFC value={count} onIncrement={increaseCount} onReset={reset} />
	);
};

class CounterCC extends Component<object, StateProps> {
	unsubscribes = [];

	constructor(props) {
		super(props);

		const [count, unsubCount] = select(countSelector, state =>
			this.setState({ count: state.count })
		);
		this.unsubscribes.push(unsubCount);

		this.state = { count };
	}

	componentWillUnmount() {
		this.unsubscribes.forEach(unsub => unsub());
	}

	render() {
		return (
			<div>
				Count: {this.state.count}
				<button onClick={() => increaseCount()}>Increase count</button>
			</div>
		);
	}
}

class Middleware<GState extends State> extends GStatem<GState> {
	constructor(config?: Init<GState>) {
		super(config);
	}

	set = (
		piece: GState | SelectState<GState>,
		setOptions?: SetOptions
	): void => {
		/* do something before set */
		return super.set(piece, setOptions);
	};
}

describe("ReactGStatem test", () => {
	it("renders Counter component", () => {
		render(<CounterFCTest />);
		screen.getByText("Clicked: 0 times");

		const incrementButton = screen.getByRole("button", { name: "+" });
		fireEvent.click(incrementButton);
		screen.getByText("Clicked: 1 times");

		set({ count: 5 });
		expect(get(countSelector)).toBe(5);
	});

	it("Custom equalityFn", () => {
		render(
			<CounterFCTest
				equalityFn={({ count: prevCount }, { count: nextCount }) =>
					Math.abs(prevCount - nextCount) < 2
				}
			/>
		);
		screen.getByText("Clicked: 5 times");

		const incrementButton = screen.getByRole("button", { name: "+" });
		fireEvent.click(incrementButton);
		screen.getByText("Clicked: 5 times"); // +1 to count will not trigger re-render.

		const resetButton = screen.getByRole("button", { name: "Reset" });
		fireEvent.click(resetButton);
		screen.getByText("Clicked: 0 times");
	});

	it("Performance testing", () => {
		const numOfComponents = 10;
		const numOfSelectorForEach = 100;
		const counterTests = [];
		for (let i = 0; i < numOfComponents; i++) {
			const index = i + 1;
			counterTests.push(
				<CounterFCTest
					key={`counter_${index}`}
					customHooks={() => {
						for (let i = 0; i < numOfSelectorForEach; i++) {
							useSelect(countSelector);
						}
					}}
				/>
			);
		}
		render(<>{counterTests}</>);

		const t1 = performance.now();
		const incrementButton = screen.getAllByRole("button", { name: `+` })[0];
		fireEvent.click(incrementButton);
		console.log(
			`${numOfComponents} components with ${numOfSelectorForEach} selectors each, took ${
				performance.now() - t1
			} ms.`
		);

		const resetButton = screen.getAllByRole("button", { name: "Reset" })[0];
		fireEvent.click(resetButton);
		screen.getAllByText("Clicked: 0 times");
	});

	it("Class component", () => {
		render(<CounterCC />);
		screen.getByText("Count: 0");

		const increaseCountButton = screen.getByRole("button", {
			name: "Increase count"
		});
		fireEvent.click(increaseCountButton);
		screen.getByText("Count: 1");
	});

	it("Pure subscribe and unsubscribe", () => {
		const subscribeFn = state => {
			expect(typeof state.count).toBe("number");
		};
		subscribe(countSelector, subscribeFn);
		unsubscribe(subscribeFn);
	});

	it("Middleware test", () => {
		const { get: middlewareGet, set: middlewareSet } = create<StateProps>(
			new Middleware<StateProps>(initialConfig)
		);
		middlewareSet({ count: 1 });
		expect(middlewareGet(state => state.count)).toBe(1);
	});
});

// TODO: 1. gen README.md examples from storybook examples
// TODO: 2. add more examples
