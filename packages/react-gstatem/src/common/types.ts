import { EqualityFn, Selector, SelectState, State, Subscriber } from "gstatem";

export interface ReactGStatem<GState extends State> {
	/**
	 * @template GState, Piece
	 * Subscribe state piece with selector function, when the selected piece is dispatched by {@link dispatch}, the subscriber function is invoked and the component that wraps the useSelect is re-rendered.
	 *
	 * @param {Selector<GState, Piece>} selector - The selector function.
	 * @param {EqualityFn<GState>} [equalityFn] - The equality function.
	 *
	 * @returns {Piece} The subscribing piece.
	 *
	 * @example
	 * import { create } from "react-gstatem";
	 *
	 * const { useSelect, dispatch } = create({ state: { count: 0 } });
	 *
	 * export default = () => {
	 *   const count = useSelect(state => state.count);
	 *
	 *   return (
	 *     <Counter
	 *       value={count}
	 *       onIncrement={() => dispatch(({ count }) => ({ count: count + 1 }))}
	 *       onDecrement={() => dispatch(({ count }) => ({ count: count - 1 }))}
	 *     />
	 *   );
	 * };
	 */
	useSelect: <Piece>(
		selector: Selector<GState, Piece>,
		equalityFn?: EqualityFn<GState>
	) => Piece;

	/**
	 * @see {@link GStatem#select}
	 */
	select<Piece>(
		selector: Selector<GState, Piece>,
		subscriber: Subscriber<GState>,
		equalityFn?: EqualityFn<GState>
	): [Piece, VoidFunction];

	/**
	 * @see {@link GStatem#dispatch}
	 * Dispatch a piece of state, the relevant subscribe functions and the components will be triggered.
	 */
	dispatch: (piece: GState | SelectState<GState>) => void;

	/**
	 * @see {@link GStatem#get}
	 * Get a piece of state without triggering the subscribe function.
	 */
	get: <Piece>(selector: Selector<GState, Piece>) => Piece;

	/**
	 * @see {@link GStatem#set}
	 * Set a piece of state without triggering the subscribe function.
	 */
	set: (piece: GState | SelectState<GState>) => void;

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
