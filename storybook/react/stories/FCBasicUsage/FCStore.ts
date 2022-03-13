import { create } from "react-gstatem";

type StateType = { count: number };

const initialState = { count: 0 };
const { useSelect, dispatch } = create<StateType>({ state: initialState });

/* the count hook for function component */
export const useCount = () => useSelect<number>(state => state.count);

/* increase the counter */
export const increaseCount = () =>
	dispatch(state => ({ count: state.count + 1 }));

/* reset counter */
export const resetCount = () => dispatch(initialState);
