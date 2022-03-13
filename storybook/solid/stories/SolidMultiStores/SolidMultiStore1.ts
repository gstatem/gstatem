import * as solid from "solid-js";
import { create } from "solid-gstatem";

type StateType = { count1: number };

const initialState = { count1: 0 };
const { useSelect, dispatch } = create<StateType>(solid, {
	state: initialState
});

/* the count hook for function component */
export const useCount1 = () => useSelect<number>(state => state.count1);

/* increase the counter */
export const increaseCount1 = () =>
	dispatch(state => ({ count1: state.count1 + 1 }));
