import { create } from "../src/";
import GStatem, { Init, SelectState, SetOptions } from "gstatem";

export type StateType = { count: number };

const initialState = { count: 0 };
const initialConfig = {
	state: initialState
};
export const { useSelect, dispatch, get } = create<StateType>(initialConfig);

export const countSelector = state => state.count;

export const useCount = () => useSelect(countSelector);

export const getCount = () => get(countSelector);

export const increaseCount = () =>
	dispatch(state => ({ count: state.count + 1 }));

export const resetCount = () => dispatch(initialState);

class Middleware<GState extends StateType> extends GStatem<GState> {
	constructor(config?: Init<GState>) {
		super(config);
	}

	set = (
		piece: GState | SelectState<GState>,
		setOptions?: SetOptions
	): void => {
		/* do something before set */
		return super.set(piece, setOptions);
	};
}

export const createMiddleware = () =>
	create<StateType>(new Middleware<StateType>(initialConfig));
