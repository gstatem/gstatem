import { create } from "react-gstatem";

type Store1Type = {
	count1: number;
};

const { useSelect, dispatch } = create<Store1Type>({ state: { count1: 0 } });

/* the count hook for function component */
export const useCount1 = () => useSelect<number>(state => state.count1);

/* increase the counter */
export const increaseCount1 = () =>
	dispatch(state => ({ count1: state.count1 + 1 }));
