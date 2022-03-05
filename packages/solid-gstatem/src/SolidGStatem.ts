import GStatem, { EqualityFn, State } from "gstatem";
import { SolidGStatem, UseSelectOptions } from "./common/types";
import { createSignal, onCleanup, Accessor } from "solid-js";

export const init = <GState extends State>(
	statem: GStatem<GState>
): SolidGStatem<GState> => ({
	useSelect: <Piece>(
		selector,
		{ equals, stateEqualityFn }: UseSelectOptions<GState, Piece> = {}
	): Accessor<Piece> => {
		const [value, setValue] = createSignal<Piece>(statem.get(selector));

		let equalityFn: EqualityFn<GState> = stateEqualityFn;
		if (!(stateEqualityFn instanceof Function) && equals instanceof Function) {
			equalityFn = (prevState, nextState) =>
				equals(selector(prevState), selector(nextState));
		}

		const subscriber = state => setValue(selector(state));
		const unsubscribe = statem.subscribe(selector, subscriber, equalityFn);
		onCleanup(unsubscribe);
		return value;
	},

	dispatch: statem.dispatch,

	select: statem.select,

	get: statem.get,

	set: statem.set,

	subscribe: statem.subscribe,

	unsubscribe: statem.unsubscribe
});

export const create = () => {};
