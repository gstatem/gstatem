import { create } from "vue-gstatem";

type StateType = { count: number };

const initialState = { count: 0 };
const { get, set } = create<StateType>({ state: initialState });

/* This won't trigger component re-render */
export const getCount = () => get<number>(state => state.count);

/* This won't trigger component re-render */
export const increaseCount = () => set(state => ({ count: state.count + 1 }));
