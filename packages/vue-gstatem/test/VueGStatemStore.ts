import { create } from "../src/";

export type StateType = { count: number };

const initialState = { count: 0 };
export const { useSelect, dispatch, get } = create<StateType>({
	state: initialState
});

export const countSelector = state => state.count;

export const useCount = () => useSelect(countSelector);

export const getCount = () => get(countSelector);

export const increaseCount = () =>
	dispatch(state => ({ count: state.count + 1 }));

export const resetCount = () => dispatch(initialState);
