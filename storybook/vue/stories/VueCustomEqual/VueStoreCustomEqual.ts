// noinspection DuplicatedCode

import { create } from "vue-gstatem";

type StateType = { count: number };

const initialState = { count: 0 };
const { useSelect, dispatch } = create<StateType>({ state: initialState });

/* the count hook for function component */
/* the component will NOT be re-rendered if the diff */
/* between current count and next count is less or equal to 1 */
export const useCount = () =>
	useSelect(
		state => state.count,
		({ count: prevCount }, { count: nextCount }) => {
			return Math.abs(prevCount - nextCount) <= 1;
		}
	);

/* increase the counter by 1, this will NOT trigger component re-render */
export const increaseCount = () =>
	dispatch(state => ({ count: state.count + 1 }));

/* increase the counter by 2, this will trigger component re-render */
export const doubleIncreaseCount = () =>
	dispatch(state => ({ count: state.count + 2 }));
