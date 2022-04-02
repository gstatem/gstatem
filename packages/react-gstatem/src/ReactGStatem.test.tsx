import React, { Component, FC } from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { create, EqualityFn, State } from "./";
import CounterFC from "../../../storybook/react/base/components/Counter";
import GStatem, { Init, Selector, SelectState, SetOptions } from "gstatem";
import { Provider, useSelector, useDispatch } from "react-redux";
import { createSlice, configureStore } from "@reduxjs/toolkit";
import zustandCreate from "zustand";
import { RecoilRoot, atom, useRecoilState } from "recoil";

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

const counterReduxSlice = createSlice({
	name: "counter",
	initialState: {
		count: 0
	},
	reducers: {
		increment: state => {
			state.count += 1;
		},
		reset: state => {
			state.count = 0;
		}
	}
});

const reduxStore = configureStore({ reducer: counterReduxSlice.reducer });

const ReduxCounter: FC<CounterTestProps<StateProps>> = ({ customHooks }) => {
	const count = useSelector(countSelector);
	const dispatch = useDispatch();

	if (customHooks instanceof Function) {
		customHooks();
	}

	return (
		<CounterFC
			value={count}
			onIncrement={() => dispatch(counterReduxSlice.actions.increment())}
			onReset={() => dispatch(counterReduxSlice.actions.reset())}
		/>
	);
};

const zustandUseStore = zustandCreate(set => ({
	count: 0,
	// @ts-ignore
	increaseCount: () => set(state => ({ count: state.count + 1 })),
	// @ts-ignore
	resetCount: () => set({ count: 0 })
}));

const ZustandCounter: FC<CounterTestProps<StateProps>> = ({ customHooks }) => {
	const count = zustandUseStore(countSelector);
	const increaseCount = zustandUseStore(state => state.increaseCount);
	const resetCount = zustandUseStore(state => state.resetCount);

	if (customHooks instanceof Function) {
		customHooks();
	}

	return (
		<CounterFC value={count} onIncrement={increaseCount} onReset={resetCount} />
	);
};

const recoilCounterState = atom({
	key: "counterState",
	default: 0
});

const RecoilCounter: FC<CounterTestProps<StateProps>> = ({ customHooks }) => {
	const [count, setCount] = useRecoilState(recoilCounterState);
	const increaseCount = () => setCount(count + 1);
	const resetCount = () => setCount(0);

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

const numOfComponents = 100;
const numOfSelectorForEach = 10;
const performanceTest = (name, TestComponent, renderCallback) => {
	const counterTests = [];
	for (let i = 0; i < numOfComponents; i++) {
		const index = i + 1;
		counterTests.push(
			<TestComponent
				key={`counter_${index}`}
				customHooks={() => {
					for (let i = 0; i < numOfSelectorForEach; i++) {
						useSelect(countSelector);
					}
				}}
			/>
		);
	}
	renderCallback(<>{counterTests}</>);

	const t1 = performance.now();
	const incrementButton = screen.getAllByRole("button", { name: `+` })[0];
	fireEvent.click(incrementButton);
	console.log(
		`${name} single dispatch to ${numOfComponents} components with ${numOfSelectorForEach} selectors each in single store, took ${
			performance.now() - t1
		} ms.`
	);

	fireEvent.click(incrementButton);
	const resetButton = screen.getAllByRole("button", { name: "Reset" })[0];
	fireEvent.click(resetButton);
	expect(screen.getAllByText("Clicked: 0 times")[0]).toBeDefined();
};

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

	it("Recoil performance test", () => {
		performanceTest("Recoil -", RecoilCounter, children => {
			render(<RecoilRoot>{children}</RecoilRoot>);
		});
	});

	it("React Redux performance test", () => {
		performanceTest("React Redux -", ReduxCounter, children => {
			render(<Provider store={reduxStore}>{children}</Provider>);
		});
	});

	it("Zustand performance test", () => {
		performanceTest("Zustand -", ZustandCounter, render);
	});

	it("React GStatem performance test", () => {
		performanceTest("React GStatem -", CounterFCTest, render);
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
