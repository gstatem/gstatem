import React, { Component, FC } from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { create, EqualityFn, State } from "./";
import CounterFC from "../../../storybook/react/base/components/Counter";
import GStatem, { Init, Selector, SelectState, SetOptions } from "gstatem";

type StateProps = {
	count: number;
};

type CounterTestProps<T extends State> = {
	equalityFn?: EqualityFn<T>;
	customHooks?: VoidFunction;
};

const initialState = { count: 0 };
const initialConfig = { state: initialState };
const countSelector: Selector<StateProps, number> = state => state.count;
const { useSelect, dispatch, get, set, select, subscribe, unsubscribe } =
	create<StateProps>(initialConfig);

const useCount = (equalityFn: EqualityFn<StateProps>) =>
	useSelect<number>(countSelector, equalityFn);
const increaseCount = () => dispatch(state => ({ count: state.count + 1 }));
const resetCount = () => dispatch(initialState);

const CounterFCTest: FC<CounterTestProps<StateProps>> = ({
	equalityFn,
	customHooks
}) => {
	const count = useCount(equalityFn);

	if (customHooks instanceof Function) {
		customHooks();
	}

	return (
		<CounterFC value={count} onIncrement={increaseCount} onReset={resetCount} />
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

describe("ReactGStatem tests", () => {
	it("renders Counter component", () => {
		render(<CounterFCTest />);
		expect(screen.getByText("Clicked: 0 times")).toBeDefined();

		const incrementButton = screen.getByRole("button", { name: "+" });
		fireEvent.click(incrementButton);
		expect(screen.getByText("Clicked: 1 times")).toBeDefined();
		expect(get(countSelector)).toBe(1);

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
		expect(screen.getByText("Clicked: 5 times")).toBeDefined();

		const incrementButton = screen.getByRole("button", { name: "+" });
		fireEvent.click(incrementButton);
		expect(screen.getByText("Clicked: 5 times")).toBeDefined(); // +1 to count will not trigger re-render.

		const resetButton = screen.getByRole("button", { name: "Reset" });
		fireEvent.click(resetButton);
		expect(screen.getByText("Clicked: 0 times")).toBeDefined();
	});

	it("Tests in multiple components", () => {
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

		const incrementButton = screen.getAllByRole("button", { name: `+` })[0];
		fireEvent.click(incrementButton);
		const resetButton = screen.getAllByRole("button", { name: "Reset" })[0];
		fireEvent.click(resetButton);
		expect(screen.getAllByText("Clicked: 0 times")[0]).toBeDefined();
	});

	it("Class component", () => {
		render(<CounterCC />);
		expect(screen.getByText("Count: 0")).toBeDefined();

		const increaseCountButton = screen.getByRole("button", {
			name: "Increase count"
		});
		fireEvent.click(increaseCountButton);
		expect(screen.getByText("Count: 1")).toBeDefined();
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
