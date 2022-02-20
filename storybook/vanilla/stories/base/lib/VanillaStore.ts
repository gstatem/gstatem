import GStatem, { Subscriber, SetOptions } from "gstatem";

export type StateType = { count: number };

const initialState = { count: 0 };
const Store = new GStatem<StateType>({
	state: initialState
});

/* static methods to manipulate the store */
const { get, set, select } = Store;

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
