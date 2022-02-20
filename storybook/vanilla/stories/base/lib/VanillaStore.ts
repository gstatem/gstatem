import GStatem, { Subscriber, SetOptions } from "gstatem";

export type StateType = { count: number };

const initialState = { count: 0 };
const { get, set, select } = new GStatem<StateType>({
	state: initialState
});

export const countSelector = state => state.count;

export const getCount = get(countSelector);

/* select count for non function component */
export const selectCount = (subscribe: Subscriber<StateType>) =>
	select<number>(countSelector, subscribe);

/* update the store with callback */
export const increaseCount = (options?: SetOptions) =>
	set(state => ({ count: state.count + 1 }), options);

/* update the store with static value */
export const resetCount = (options?: SetOptions) => set(initialState, options);
