import GStatem, { Subscriber, SetOptions } from "gstatem";

export type StateType = { count: number };

const initialState = { count: 0 };
const { get, set, select, dispatch } = new GStatem<StateType>({
	state: initialState
});

export const countSelector = state => state.count;

export const getCount = get(countSelector);

/* select count for non function component */
export const selectCount = (subscribe: Subscriber<StateType>) =>
	select<number>(countSelector, subscribe);

/* increase the counter */
export const increaseCount = () =>
	dispatch(state => ({ count: state.count + 1 }));

/* reset counter */
export const resetCount = (options?: SetOptions) => set(initialState, options);
