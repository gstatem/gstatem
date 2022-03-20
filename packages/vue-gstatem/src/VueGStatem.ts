import GStatem, { Init, State } from "gstatem";
import { VueGStatem } from "./common/types";
import { ref, onBeforeUnmount } from "vue";

export const init = <GState extends State>(
	statem: GStatem<GState>
): VueGStatem<GState> => ({
	useSelect: <Piece>(selector, equalityFn) => {
		const valueRef = ref<Piece>(statem.get(selector));
		const subscriber = state => {
			valueRef.value = selector(state);
		};
		const unsubscribe = statem.subscribe(selector, subscriber, equalityFn);

		onBeforeUnmount(() => {
			unsubscribe();
		});
		return valueRef;
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
 * @returns {VueGStatem<GState>} Returns the store.
 *
 * @see [Examples]{@link https://gstatem.netlify.app/?path=/docs/solid-basic-usage--page}
 */
export const create = <GState extends State>(
	config?: Init<GState> | GStatem<GState>
): VueGStatem<GState> => {
	let statem;
	if (config instanceof GStatem) {
		statem = config;
	} else {
		statem = newStatem<GState>(config);
	}

	return init(statem);
};
