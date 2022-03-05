import GStatem, { EqualityFn, Init, State } from "gstatem";
import { SolidGStatem, UseSelectOptions } from "./common/types";
import { Accessor } from "solid-js";
import { Signal, SignalOptions } from "solid-js/types/reactive/signal";

export const init = <GState extends State>(
	{
		createSignal,
		onCleanup
	}: {
		createSignal: <T>(value: T, options?: SignalOptions<T>) => Signal<T>;
		onCleanup: (fn: () => void) => () => void;
	},
	statem: GStatem<GState>
): SolidGStatem<GState> => ({
	useSelect: <Piece>(
		selector,
		{
			stateEqualityFn,
			equals,
			...restOptions
		}: UseSelectOptions<GState, Piece> = {}
	): Accessor<Piece> => {
		const [value, setValue] = createSignal<Piece>(statem.get(selector), {
			equals,
			...restOptions
		});

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
 * @param {object} solid - The solid store.
 * @param {Init<GState>} [config] - Init config.
 *
 * @returns {SolidGStatem<GState>} Returns the store.
 *
 * @see [Examples]{@link https://gstatem.netlify.app/?path=/docs/solid-basic-usage--page}
 */
export const create = <GState extends State>(
	solid,
	config?: Init<GState> | GStatem<GState>
): SolidGStatem<GState> => {
	let statem;
	if (config instanceof GStatem) {
		statem = config;
	} else {
		statem = newStatem<GState>(config);
	}

	return init(solid, statem);
};
