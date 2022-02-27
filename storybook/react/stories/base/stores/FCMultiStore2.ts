import { create } from "react-gstatem";

type Store2Type = {
	count2: number;
};

const { useSelect, dispatch } = create<Store2Type>({ state: { count2: 0 } });

/* the count hook for function component */
export const useCount2 = () => useSelect<number>(state => state.count2);

/* increase the counter */
export const increaseCount2 = () =>
	dispatch(state => ({ count2: state.count2 + 1 }));
