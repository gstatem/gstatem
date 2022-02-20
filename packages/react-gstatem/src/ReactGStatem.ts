import { useState, useLayoutEffect } from "react";
import GStatem, { State, Init } from "gstatem";
import { ReactGStatem } from "./common/types";

export const init = <GState extends State>(
	statem: GStatem<GState>
): ReactGStatem<GState> => ({
	useSelect: <Piece>(selector, equalityFn): Piece => {
		const [value, setValue] = useState<Piece>(statem.get(selector));
		useLayoutEffect(() => {
			const subscriber = state => setValue(selector(state));
			return statem.subscribe(selector, subscriber, equalityFn);
		}, []);
		return value;
	},

	dispatch: statem.dispatch,

	select: statem.select,

	get: statem.get,

	set: statem.set,

	subscribe: statem.subscribe,

	unsubscribe: statem.unsubscribe
});

/**
 * @see {@link GStatem}
 */
export const newStatem = <GState extends State>(config?: Init<GState>) =>
	new GStatem<GState>(config);

/**
 * @template GState
 *
 * Create a store.
 *
 * @param {Init<GState>} [config] - Init config.
 *
 * @returns {ReactGStatem<GState>} Returns the store.
 *
 * @example
 * import { create } from "react-gstatem";
 *
 * const statem = create({ state: { count: 0 } });
 */
export const create = <GState extends State>(
	config?: Init<GState> | GStatem<GState>
): ReactGStatem<GState> => {
	let statem;
	if (config instanceof GStatem) {
		statem = config;
	} else {
		statem = newStatem<GState>(config);
	}

	return init(statem);
};
