import { create } from "react-gstatem";
import DevTools from "gstatem-devtools";

export type StateType = { count: number };

const initialState = { count: 0 };
const { useSelect, dispatch } = create<StateType>(
	new DevTools({
		/* optional, will be displayed as store id in devtools */
		id: "fc-store-with-devtools",
		state: initialState
	})
);

/* select count hook for function component */
export const useCount = () => useSelect(state => state.count);

/* update the store with callback */
export const increaseCount = () =>
	dispatch(state => ({ count: state.count + 1 }));

/* update the store with static value */
export const resetCount = () => dispatch(initialState);
