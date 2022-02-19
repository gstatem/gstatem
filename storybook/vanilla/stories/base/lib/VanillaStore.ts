import GStatem from "gstatem";
import { SetOptions } from "gstatem/dist/common/Types";

export type StateType = { count: number };

const initialState = { count: 0 };
const Store = new GStatem<StateType>({
	state: initialState
});

/* export static methods to manipulate the store */
export const { get, set, subscribe, unsubscribe } = Store;

/* update the store with callback */
export const increaseCount = (options?: SetOptions) =>
	set(state => ({ count: state.count + 1 }), options);

/* update the store with static value */
export const resetCount = (options?: SetOptions) => set(initialState, options);
