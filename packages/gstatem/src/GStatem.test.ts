import GStatem, { deepCopy, Selector, Subscriber } from "./";

type State = {
	color?: string;
	names?: string[];
	count?: number;
	count2?: number;
	count3?: number;
};

describe("Utils tests", () => {
	const circularObj = {
		ab: 12,
		cd: 34,
		ef: undefined
	};
	circularObj.ef = {
		gh: circularObj
	};

	const circularObjCopy = deepCopy(circularObj);
	expect(circularObjCopy.ab).toBe(12);
	expect(circularObjCopy.cd).toBe(34);
	expect(circularObjCopy.ef.gh).toBe(circularObjCopy);
});

describe("GStatem tests", () => {
	const { get, set, subscribe, unsubscribe, select, dispatch } =
		new GStatem<State>({
			state: {
				color: "gray",
				names: ["Kate", "Jin"]
			}
		});

	const countSelector: Selector<State> = state => state.count;
	const count2Selector: Selector<State> = state => state.count2;
	const count3Selector: Selector<State> = state => state.count3;
	const countSubscriber: Subscriber<State> = state => {
		expect(typeof state.count).toBe("number");
	};

	it("Verify init values", () => {
		expect(get(state => state.color)).toBe("gray");
		expect(get(state => state.names).length).toBe(2);
	});

	it("Set piece", () => {
		set({ count: 1 });
		expect(get(countSelector)).toBe(1);

		set({ count: 2 });
		expect(get(countSelector)).toBe(2);
	});

	it("Subscribe a piece, dispatch, and then unsubscribe.", () => {
		subscribe(countSelector, countSubscriber);

		set({ count: 3 }, { isDispatch: true });
		set({ count: 3 }, { isDispatch: true });
		set({ count: 4 }, { isDispatch: true });

		expect(get(countSelector)).toBe(4);
		unsubscribe(countSubscriber);

		set(({ count }) => ({ count: count + 1 }), { isDispatch: true });
		expect(get(countSelector)).toBe(5);
	});

	it("Select a piece and unsubscribe", () => {
		const [count, unsubscribeCount] = select(countSelector, countSubscriber);
		expect(typeof count).toBe("number");
		expect(typeof unsubscribeCount).toBe("function");
		unsubscribeCount();
	});

	it("Remove piece", () => {
		set({ count2: 1 });
		set({ count3: 1 });
		expect(get(count2Selector)).toBe(1);
		expect(get(count3Selector)).toBe(1);

		set(state => {
			delete state.count2;
			delete state.count3;
			return state;
		});

		expect(get(count2Selector)).toBeUndefined();
		expect(get(count3Selector)).toBeUndefined();
	});

	it("Replace state", () => {
		let state;
		state = get(state => state);
		expect(Object.keys(state).length).toBe(3);

		subscribe(count3Selector, state => {
			expect(state.count3).toBe(1);
		});

		// replace state with dispatch
		dispatch({ count2: 1, count3: 1 }, { isReplace: true, isForce: true });
		state = get(state => state);
		expect(Object.keys(state).length).toBe(2);

		// replace state with set
		set({ count: 0 }, { isReplace: true });
		state = get(state => state);
		expect(Object.keys(state).length).toBe(1);
	});

	it.skip("Custom equalityFn", () => {
		subscribe(
			countSelector,
			({ count: nextCount }, { count: prevCount }) => {
				expect(Math.abs(prevCount - nextCount)).toBeGreaterThanOrEqual(2);
			},
			({ count: prevCount }, { count: nextCount }) =>
				Math.abs(prevCount - nextCount) < 2
		);

		set(({ count }) => ({ count: count + 2 }), { isDispatch: true });
	});

	const numOfSelectors = 1000000;
	it("Performance testing", () => {
		const { dispatch, subscribe } = new GStatem({ state: { count: 0 } });

		for (let i = 0; i < numOfSelectors; i++) {
			subscribe(countSelector, () => {});
		}

		const t1 = performance.now();
		dispatch({ count: 9 });
		console.log(
			`Single dispatch to ${numOfSelectors} selectors in single store took ${
				performance.now() - t1
			} ms.`
		);
	});
});
