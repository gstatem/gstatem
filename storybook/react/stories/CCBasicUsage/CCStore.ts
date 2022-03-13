import { create, Subscriber } from "react-gstatem";

export type StateType = { count: number };

const initialState = { count: 0 };
const { select, dispatch } = create<StateType>({ state: initialState });

/* select count for non function component */
export const selectCount = (subscribe: Subscriber<StateType>) =>
	select<number>(state => state.count, subscribe);

/* increase the counter */
export const increaseCount = () =>
	dispatch(state => ({ count: state.count + 1 }));

/* reset counter */
export const resetCount = () => dispatch(initialState);
