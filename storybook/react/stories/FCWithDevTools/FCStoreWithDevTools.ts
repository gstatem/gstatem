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

/* increase the counter */
export const increaseCount = () =>
	dispatch(state => ({ count: state.count + 1 }));

/* reset counter */
export const resetCount = () => dispatch(initialState);
