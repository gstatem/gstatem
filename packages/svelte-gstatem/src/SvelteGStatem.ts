import GStatem, { Init, State } from "gstatem";
import type { SvelteGStatem } from "./common/types";
import { onDestroy } from "svelte";

// TODO: not able to fix the error "Uncaught Error: Function called outside component initialization"
export const init = <GState extends State>(
	statem: GStatem<GState>
): SvelteGStatem<GState> => ({
	useSelect: <Piece>(setValue, selector, equalityFn) => {
		if (!(setValue instanceof Function)) {
			throw new TypeError("Invalid 'setValue' function passed to 'useSelect'");
		}

		const [value, unsubscribe] = statem.select<Piece>(
			selector,
			state => setValue(selector(state)),
			equalityFn
		);
		onDestroy(unsubscribe);

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
 * @returns {SvelteGStatem<GState>} Returns the store.
 *
 * @see [Examples]{@link https://gstatem.netlify.app/?path=/docs/solid-basic-usage--page}
 */
export const create = <GState extends State>(
	config?: Init<GState> | GStatem<GState>
): SvelteGStatem<GState> => {
	let statem;
	if (config instanceof GStatem) {
		statem = config;
	} else {
		statem = newStatem<GState>(config);
	}

	return init(statem);
};
