import { create, Subscriber } from "react-gstatem";

export type State1Type = { count1: number };

const initialState = { count1: 0 };
const { select, dispatch } = create<State1Type>({ state: initialState });

/* select count for non function component */
export const selectCount1 = (subscribe: Subscriber<State1Type>) =>
	select<number>(state => state.count1, subscribe);

/* increase the counter */
export const increaseCount1 = () =>
	dispatch(state => ({ count1: state.count1 + 1 }));
