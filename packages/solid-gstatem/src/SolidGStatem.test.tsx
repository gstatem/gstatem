import * as solid from "solid-js";
import { fireEvent, render, screen } from "solid-testing-library";
import { create } from "./";
import SolidCounter from "../../../storybook/solid/base/components/SolidCounter";
import { UseSelectOptions } from "solid-gstatem/dist/common/types";
import GStatem, {
	Init,
	Selector,
	SelectState,
	SetOptions,
	State
} from "gstatem";
import { createStore } from "solid-js/store";
import { Component } from "solid-js";

type StateProps = {
	count: number;
};

type Options = UseSelectOptions<StateProps, number>;

type CounterTestProps = {
	customHooks?: VoidFunction;
	options?: Options;
};

const initialState = { count: 0 };
const initialConfig = { state: initialState };
const countSelector: Selector<StateProps, number> = state => state.count;

// select, subscribe, unsubscribe
const { useSelect, dispatch, get } = create<StateProps>(solid, initialConfig);

const useCount = (options?: Options) =>
	useSelect<number>(countSelector, options);

const increaseCount = () => dispatch(state => ({ count: state.count + 1 }));
const resetCount = () => dispatch(initialState);

const CounterTest: Component<CounterTestProps> = ({ customHooks, options }) => {
	const count = useCount(options);

	if (customHooks instanceof Function) {
		customHooks();
	}

	return (
		<SolidCounter
			value={count}
			onIncrement={increaseCount}
			onReset={resetCount}
		/>
	);
};

const [solidState, setSolidState] = createStore(initialState);

const SolidCounterTest: Component<CounterTestProps> = ({ customHooks }) => {
	if (customHooks instanceof Function) {
		customHooks();
	}

	const increaseCount = () => {
		setSolidState({ count: solidState.count + 1 });
	};

	const resetCount = () => {
		setSolidState({ count: 0 });
	};

	return (
		<SolidCounter
			value={() => solidState.count}
			onIncrement={increaseCount}
			onReset={resetCount}
		/>
	);
};

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
const performanceTest = (name, TestComponent, selectStore) => {
	const counterTests = [];
	for (let i = 0; i < numOfComponents; i++) {
		counterTests.push(
			<TestComponent
				customHooks={() => {
					for (let i = 0; i < numOfSelectorForEach; i++) {
						selectStore();
					}
				}}
			/>
		);
	}
	render(() => <>{counterTests}</>);

	// noinspection DuplicatedCode
	const t1 = performance.now();
	const incrementButton = screen.getAllByRole("button", { name: `+` })[0];
	fireEvent.click(incrementButton);
	console.log(
		`${name} - single dispatch to ${numOfComponents} components with ${numOfSelectorForEach} selectors each in single store, took ${
			performance.now() - t1
		} ms.`
	);

	fireEvent.click(incrementButton);
	const resetButton = screen.getAllByRole("button", { name: "Reset" })[0];
	fireEvent.click(resetButton);
	expect(screen.getAllByText("Clicked: 0 times")[0]).toBeDefined();
};

const testEquals = () => {
	expect(screen.getByText("Clicked: 0 times")).toBeDefined();

	const incrementButton = screen.getByRole("button", { name: "+" });
	fireEvent.click(incrementButton);
	expect(screen.getByText("Clicked: 0 times")).toBeDefined(); // +1 to count will not trigger re-render.
	dispatch({ count: 3 });
	expect(screen.getByText("Clicked: 3 times")).toBeDefined();

	const resetButton = screen.getByRole("button", { name: "Reset" });
	fireEvent.click(resetButton);
	expect(screen.getByText("Clicked: 0 times")).toBeDefined();
};

describe("SolidGStatem tests", () => {
	it("test throw error on create", () => {
		// @ts-ignore
		expect(() => create({ createSignal: () => {} })).toThrow(TypeError);
		// @ts-ignore
		expect(() => create({ onCleanup: () => {} })).toThrow(TypeError);
	});

	it("renders counter component", () => {
		render(() => <CounterTest />);
		expect(screen.getByText("Clicked: 0 times")).toBeDefined();

		const incrementButton = screen.getByRole("button", { name: "+" });
		fireEvent.click(incrementButton);
		expect(screen.getByText("Clicked: 1 times")).toBeDefined();
		expect(get(countSelector)).toBe(1);

		const resetButton = screen.getByRole("button", { name: "Reset" });
		fireEvent.click(resetButton);
		expect(screen.getByText("Clicked: 0 times")).toBeDefined();
	});

	it("test solid equals", () => {
		render(() => (
			<CounterTest
				options={{
					equals: (prevCount, nextCount) => Math.abs(prevCount - nextCount) < 2
				}}
			/>
		));
		testEquals();
	});

	it("custom equalityFn", () => {
		render(() => (
			<CounterTest
				options={{
					stateEqualityFn: ({ count: prevCount }, { count: nextCount }) =>
						Math.abs(prevCount - nextCount) < 2
				}}
			/>
		));
		testEquals();
	});

	it("Solid Store performance test", () => {
		performanceTest("Solid Store", SolidCounterTest, () => {
			setSolidState({ count: 0 });
		});
	});

	it("Solid GStatem performance test", () => {
		performanceTest("Solid GStatem", CounterTest, () => {
			useSelect(countSelector);
		});
	});

	it("middleware test", () => {
		const { get: middlewareGet, set: middlewareSet } = create<StateProps>(
			solid,
			new Middleware<StateProps>(initialConfig)
		);
		middlewareSet({ count: 1 });
		expect(middlewareGet(state => state.count)).toBe(1);
	});
});
