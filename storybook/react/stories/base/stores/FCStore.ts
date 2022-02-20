import { create } from "react-gstatem";

type StateType = { count: number };

const initialState = { count: 0 };
const Store = create<StateType>({ state: initialState });

/* static methods to manipulate the store */
const { useSelect, dispatch } = Store;

/* the count hook for function component */
export const useCount = () => useSelect<number>(state => state.count);

/* update the store with callback */
export const increaseCount = () =>
	dispatch(state => ({ count: state.count + 1 }));

/* update the store with static value */
export const resetCount = () => dispatch(initialState);
