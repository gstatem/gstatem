import { useState, useLayoutEffect } from "react";
import GStatem, {
	State,
	Init,
	EqualityFn,
	Selector,
	SelectState,
	Subscriber
} from "gstatem";

export type ReactGStatem<GState extends State> = {
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
	 * @template GState, Piece
	 * Subscribe state piece with selector function, when the selected piece is dispatched by {@link dispatch}, the subscriber function is invoked and the component that wraps the useSelect is re-rendered.
	 *
	 * @param {Selector<GState, Piece>} selector - The selector function.
	 * @param {Subscriber<GState>} subscriber - The subscriber function.
	 * @param {EqualityFn<GState>} [equalityFn] - The equality function.
	 *
	 * @returns {[Piece, VoidFunction]} The subscribing piece and the unsubscribe function.
	 */
	select<Piece>(
		selector: Selector<GState, Piece>,
		subscriber: Subscriber<GState>,
		equalityFn?: EqualityFn<GState>
	): [Piece, VoidFunction];

	/**
	 * @template GState
	 * Dispatch a state value by the key of the state value, the value will be changed and all related subscribe functions are triggered in the order of subscribe.
	 *
	 * @param {GState|SelectState<GState>} piece - The piece the state or a callback to select and return the piece of the state.
	 *
	 * @returns {void}
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
	dispatch: (piece: GState | SelectState<GState>) => void;

	/**
	 * @template GState, Piece
	 * Get a piece of state without triggering the subscribe function.
	 *
	 * @param {Selector<GState, Piece>} selector - The selector function to select value from the state.
	 *
	 * @returns {Piece} The selected piece.
	 *
	 * @example
	 * import { create } from "react-gstatem";
	 *
	 * const { get } = create({ state: { count: 0 } });
	 *
	 * export default = () => {
	 *   const count = get(state => state.count);
	 *   return <div>count: {count}</div>;
	 * };
	 */
	get: <Piece>(selector: Selector<GState, Piece>) => Piece;

	/**
	 * @template GState
	 * Set a piece of state without triggering the subscribe function.
	 *
	 * @param {GState|SelectState<GState>} piece - The piece the state or a callback to select and return the piece of the state.
	 *
	 * @returns {void}
	 *
	 * @example
	 * import { create } from "react-gstatem";
	 *
	 * const { set, get } = create({ state: { count: 0 } });
	 *
	 * export const someUtilFunc = () => {
	 *   set({ count: 2 });
	 *   set({ count } => ({ count: count + 1 }));
	 * };
	 */
	set: (piece: GState | SelectState<GState>) => void;
};

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

	select: <Piece>(
		selector: Selector<GState, Piece>,
		subscriber: Subscriber<GState>,
		equalityFn?: EqualityFn<GState>
	): [Piece, VoidFunction] => {
		return statem.select(selector, subscriber, equalityFn);
	},

	dispatch: (piece): void => {
		statem.set(piece, { isDispatch: true });
	},

	get: <Piece>(selector): Piece => statem.get(selector),

	set: piece => statem.set(piece)
});

/**
 * @template GState
 *
 * Create a new statem for function component.
 *
 * @param {Init<GState>} [config] - Init config for new statem.
 *
 * @returns {ReactGStatem<GState>} Returns the new statem.
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
		statem = new GStatem<GState>(config);
	}

	return init(statem);
};
