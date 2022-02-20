import { create, Subscriber } from "react-gstatem";
import DevTools from "gstatem-devtools";

export type StateType = { count: number };

const initialState = { count: 0 };
const Store = create<StateType>(
	new DevTools({
		/* optional, will be displayed as store id in devtools */
		id: "cc-store-with-devtools",
		state: initialState
	})
);

/* static methods to manipulate the store */
const { select, dispatch } = Store;

/* select count for non function component */
export const selectCount = (subscribe: Subscriber<StateType>) =>
	select<number>(state => state.count, subscribe);

/* update the store with callback */
export const increaseCount = () =>
	dispatch(state => ({ count: state.count + 1 }));

/* update the store with static value */
export const resetCount = () => dispatch(initialState);
