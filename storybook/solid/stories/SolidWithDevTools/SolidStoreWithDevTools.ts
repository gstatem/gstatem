import * as solid from "solid-js";
import { create } from "solid-gstatem";
import DevTools from "gstatem-devtools";

type StateType = { count: number };

const initialState = { count: 0 };
const { useSelect, dispatch } = create<StateType>(
	solid,
	new DevTools({
		state: initialState
	})
);

/* the count hook for function component */
export const useCount = () => useSelect<number>(state => state.count);

/* increase the counter */
export const increaseCount = () =>
	dispatch(state => ({ count: state.count + 1 }));

/* reset counter */
export const resetCount = () => dispatch(initialState);
