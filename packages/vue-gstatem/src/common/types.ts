/* eslint-disable no-unused-vars */
// noinspection DuplicatedCode

import {
	DispatchOptions,
	EqualityFn,
	Selector,
	SelectState,
	SetOptions,
	State,
	Subscriber
} from "gstatem";
import { Ref, UnwrapRef } from "vue";

export interface VueGStatem<GState extends State> {
	/**
	 * @template GState, Piece
	 * Subscribe state piece with selector function, when the selected piece is dispatched by {@link dispatch}, the subscriber function is invoked and the component that wraps the useSelect is re-rendered.
	 *
	 * @param {Selector<GState, Piece>} selector - The selector function.
	 * @param {EqualityFn<GState>} [equalityFn] - The equality function.
	 *
	 * @returns {Ref<UnwrapRef<Piece>>} The subscribing piece ref.
	 *
	 * @see [Examples]{@link https://gstatem.netlify.app/?path=/docs/vue-template-basic-usage--basic-usage}
	 */
	useSelect: <Piece>(
		selector: Selector<GState, Piece>,
		equalityFn?: EqualityFn<GState>
	) => Ref<UnwrapRef<Piece>>;

	/**
	 * @see {@link GStatem#dispatch}
	 * Dispatch a piece of state, the relevant subscribe functions and the components will be triggered.
	 *
	 * @see [Examples]{@link https://gstatem.netlify.app/?path=/docs/vue-template-basic-usage--basic-usage}
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
