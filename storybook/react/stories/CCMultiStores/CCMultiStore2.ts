import { create, Subscriber } from "react-gstatem";

export type State2Type = { count2: number };

const initialState = { count2: 0 };
const { select, dispatch } = create<State2Type>({ state: initialState });

/* select count for non function component */
export const selectCount2 = (subscribe: Subscriber<State2Type>) =>
	select<number>(state => state.count2, subscribe);

/* increase the counter */
export const increaseCount2 = () =>
	dispatch(state => ({ count2: state.count2 + 1 }));
