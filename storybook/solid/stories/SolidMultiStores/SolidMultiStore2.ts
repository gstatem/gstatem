import * as solid from "solid-js";
import { create } from "solid-gstatem";

type StateType = { count2: number };

const initialState = { count2: 0 };
const { useSelect, dispatch } = create<StateType>(solid, {
	state: initialState
});

/* the count hook for function component */
export const useCount2 = () => useSelect<number>(state => state.count2);

/* increase the counter */
export const increaseCount2 = () =>
	dispatch(state => ({ count2: state.count2 + 1 }));
