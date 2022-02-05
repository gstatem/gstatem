import GStatem from "./";

type State = {
	color?: string;
	names?: string[];
	count?: number;
	count2?: number;
	count3?: number;
};

describe("GStatem tests", () => {
	const { get, set, subscribe, unsubscribe } = new GStatem<State>({
		state: {
			color: "gray",
			names: ["Kate", "Jin"]
		}
	});

	it("Verify init values", () => {
		expect(get(state => state.color)).toBe("gray");
		expect(get(state => state.names).length).toBe(2);
	});

	it("Set value", () => {
		set({ count: 1 });
		expect(get(({ count }) => count)).toBe(1);

		set({ count: 2 });
		expect(get(({ count }) => count)).toBe(2);
	});

	it("Subscribe a value, dispatch, and then unsubscribe.", () => {
		const subscriber = state => {
			expect(typeof state.count).toBe("number");
		};
		subscribe(({ count }) => count, subscriber);

		set({ count: 3 }, { isDispatch: true });
		set({ count: 3 }, { isDispatch: true });
		set({ count: 4 }, { isDispatch: true });

		expect(get(({ count }) => count)).toBe(4);
		unsubscribe(subscriber);

		set(({ count }) => ({ count: count + 1 }), { isDispatch: true });
		expect(get(({ count }) => count)).toBe(5);
	});

	it("Remove value", () => {
		set({ count2: 1 });
		set({ count3: 1 });
		expect(get(({ count2 }) => count2)).toBe(1);
		expect(get(({ count3 }) => count3)).toBe(1);

		set(state => {
			delete state.count2;
			delete state.count3;
			return state;
		});

		expect(get(({ count2 }) => count2)).toBeUndefined();
		expect(get(({ count3 }) => count3)).toBeUndefined();
	});

	it("Custom equalityFn", () => {
		subscribe(
			({ count }) => count,
			({ count: nextCount }, { count: prevCount }) => {
				expect(Math.abs(prevCount - nextCount)).toBeGreaterThanOrEqual(2);
			},
			({ count: prevCount }, { count: nextCount }) =>
				Math.abs(prevCount - nextCount) < 2
		);

		set(({ count }) => ({ count: count + 2 }), { isDispatch: true });
	});

	it("Replace state", () => {
		set({ count3: 0 }, { isReplace: true });
		const state = get(state => state);
		expect(Object.keys(state).length).toBe(1);
		expect(state.count3).toBe(0);
	});

	it("Performance testing", () => {
		const numOfSelectors = 100000;
		const { set, subscribe } = new GStatem({ state: { count: 0 } });

		for (let i = 0; i < numOfSelectors; i++) {
			subscribe(
				({ count }) => count,
				() => {}
			);
		}

		const t1 = performance.now();
		set({ count: 9 }, { isDispatch: true });
		console.log(
			`${numOfSelectors} selectors took ${performance.now() - t1} ms.`
		);
	});
});
