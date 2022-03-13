import * as solid from "solid-js";
import { create } from "solid-gstatem";

type StateType = { count: number };

const initialState = { count: 0 };
const { useSelect, dispatch, get, set } = create<StateType>(solid, {
	state: initialState
});

/* the count hook for function component */
export const useCount = () => useSelect<number>(state => state.count);

/* This won't trigger component re-render */
export const getCount = () => get(state => state.count);

/* This won't trigger component re-render */
export const increaseCount = () => set(state => ({ count: state.count + 1 }));

/* increase the counter */
export const refreshCount = () =>
	dispatch({ count: getCount() }, { isForce: true });
