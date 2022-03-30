import type {
	DispatchOptions,
	EqualityFn,
	Selector,
	SelectState,
	SetOptions,
	State,
	Subscriber
} from "gstatem";

export type SvelteSetValue<T> = (nextValue: T) => void;

export interface SvelteGStatem<GState extends State> {
	/**
	 * @template GState, Piece
	 * Subscribe state piece with selector function, when the selected piece is dispatched by {@link dispatch}, the subscriber function is invoked and the component that wraps the useSelect is re-rendered.
	 *
	 * @param {VoidFunction} setValue - The set value function.
	 * @param {Selector<GState, Piece>} selector - The selector function.
	 * @param {EqualityFn<GState>} [equalityFn] - The equality function.
	 *
	 * @returns {Piece} The subscribing piece.
	 *
	 * @see [Examples]{@link https://gstatem.netlify.app/?path=/docs/svelte-basic-usage--page}
	 */
	useSelect: <Piece>(
		setValue: SvelteSetValue<Piece>,
		selector: Selector<GState, Piece>,
		equalityFn?: EqualityFn<GState>
	) => Piece;

	/**
	 * @see {@link GStatem#dispatch}
	 * Dispatch a piece of state, the relevant subscribe functions and the components will be triggered.
	 *
	 * @see [Examples]{@link https://gstatem.netlify.app/?path=/docs/svelte-basic-usage--page}
	 */
	dispatch: (
		piece: GState | SelectState<GState>,
		options?: DispatchOptions
	) => void;

	/**
	 * @see {@link GStatem#select}
	 */
	select<Piece>(
		selector: Selector<GState, Piece>,
		subscriber: Subscriber<GState>,
		equalityFn?: EqualityFn<GState>
	): [Piece, VoidFunction];

	/**
	 * @see {@link GStatem#get}
	 * Get a piece of state without triggering the subscribe function.
	 */
	get: <Piece>(selector: Selector<GState, Piece>) => Piece;

	/**
	 * @see {@link GStatem#set}
	 * Set a piece of state without triggering the subscribe function.
	 */
	set: (piece: GState | SelectState<GState>, options?: SetOptions) => void;

	/**
	 * @see {@link GStatem#subscribe}
	 */
	subscribe: (
		selector: Selector<GState>,
		subscriber: Subscriber<GState>,
		equalityFn?: EqualityFn<GState>
	) => VoidFunction;

	/**
	 * @see {@link GStatem#unsubscribe}
	 */
	unsubscribe: (subscribe: Subscriber<GState>) => void;
}
