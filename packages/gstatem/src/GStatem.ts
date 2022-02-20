import {
	Selector,
	Init,
	State,
	Subscriber,
	SelectState,
	SetOptions,
	Subscribers,
	EqualityFn
} from "./common/types";
import { deepCopy, uuidv4 } from "./common/utils";

/**
 * @template GState, Piece
 */
class GStatem<GState extends State> {
	id: string;
	state: GState;
	subscribers: Subscribers<GState> = new Map();

	constructor({ id = uuidv4(), state = {} as GState }: Init<GState> = {}) {
		this.id = id;
		this.state = deepCopy<GState>(state) as GState;
		this.get = this.get.bind(this);
		this.set = this.set.bind(this);
		this.subscribe = this.subscribe.bind(this);
		this.unsubscribe = this.unsubscribe.bind(this);
		this.select = this.select.bind(this);
		this.dispatch = this.dispatch.bind(this);
	}

	/**
	 * Get a piece of state.
	 *
	 * @param {Selector<GState, Piece>} selector - The selector function to select value from the state.
	 *
	 * @returns {Piece} The selected piece.
	 *
	 * @example
	 * import GStatem from "gstatem";
	 *
	 * const { get } = new GStatem();
	 * const count = get(state => state.count);
	 */
	get<Piece>(selector: Selector<GState, Piece>): Piece {
		if (selector instanceof Function) {
			return selector(this.state);
		}
	}

	/**
	 * Set a piece of state.
	 *
	 * @param {GState|SelectState<GState>} piece - The piece the state or a callback to select and return the piece of the state.
	 * @param {SetOptions} [options] - Options for the set method.
	 *
	 * @returns {void}
	 *
	 * @example
	 * import GStatem from "gstatem";
	 *
	 * const { set } = new GStatem();
	 *
	 * // Set with piece.
	 * set({ count: 2 });
	 * // Set with callback.
	 * set(state => ({ count: state.count + 1 }));
	 */
	set(
		piece: GState | SelectState<GState>,
		{ isDispatch = false, isReplace = false }: SetOptions = {}
	): void {
		if (piece instanceof Function) {
			piece = piece(this.state) as GState;
		}
		if (piece === this.state) return;

		const nextState = isReplace ? piece : { ...this.state, ...piece };
		if (isDispatch) {
			this.subscribers.forEach(({ selector, equalityFn }, subscribe) => {
				let isEqual;
				if (equalityFn instanceof Function) {
					isEqual = equalityFn(this.state, nextState);
				} else {
					isEqual = selector(this.state) === selector(nextState);
				}

				if (!isEqual) {
					subscribe(nextState, this.state);
				}
			});
		}
		this.state = nextState;
	}

	/**
	 * Subscribe a piece of state, the subscriber function will be triggered whenever selected piece of state is updated.
	 *
	 * @param {Selector<GState>} selector - The selector function to select value from the state.
	 * @param {Subscriber<GState>} subscriber - The subscriber function.
	 * @param {EqualityFn<GState>} [equalityFn] - The equality function.
	 *
	 * @returns {VoidFunction} The unsubscribe function.
	 *
	 * @example
	 * import GStatem from "gstatem";
	 *
	 * const { set, subscribe } = new GStatem({ state: { count: 0 } });
	 *
	 * const selector = state => state.count;
	 * const subscriber = state => {
	 *   console.log("count is updated", state.count);
	 * };
	 * subscribe(selector, subscriber);
	 *
	 * set(state => ({ count: state.count + 1}));
	 */
	subscribe(
		selector: Selector<GState>,
		subscriber: Subscriber<GState>,
		equalityFn?: EqualityFn<GState>
	): VoidFunction {
		let unsubscribe;
		if (selector instanceof Function && subscriber instanceof Function) {
			unsubscribe = () => this.subscribers.delete(subscriber);
			const subscriberPayload = { selector, unsubscribe, equalityFn };
			this.subscribers.set(subscriber, subscriberPayload);
		}

		return unsubscribe;
	}

	/**
	 * Unsubscribe a selector by the same subscriber function when subscribing.
	 *
	 * @param {Subscriber<GState>} subscribe - The same subscribe function when subscribed.
	 *
	 * @returns {void}
	 *
	 * @example
	 * import GStatem from "gstatem";
	 *
	 * const { subscribe, unsubscribe } = new GStatem({ state: { count: 0 } });
	 *
	 * const selector = state => state.count;
	 * const subscriber = state => {
	 *   console.log("count is updated", state.count);
	 * };
	 * subscribe(selector, subscriber);
	 *
	 * unsubscribe(subscriber);
	 */
	unsubscribe(subscribe: Subscriber<GState>): void {
		const subscriber = this.subscribers.get(subscribe);
		if (subscriber) {
			const { unsubscribe } = subscriber;
			unsubscribe();
		}
	}

	/**
	 * @template GState
	 * Dispatch a piece of state, the relevant subscribe functions will be triggered.
	 *
	 * @param {GState|SelectState<GState>} piece - The piece the state or a callback to select and return the piece of the state.
	 *
	 * @returns {void}
	 */
	dispatch(piece: GState | SelectState<GState>): void {
		this.set(piece, { isDispatch: true });
	}

	/**
	 * @template GState, Piece
	 * Subscribe a piece of state, when the selected piece is dispatched, the subscriber function is invoked.
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
	): [Piece, VoidFunction] {
		const unsubscribe = this.subscribe(selector, subscriber, equalityFn);
		return [this.get(selector), unsubscribe];
	}
}

export default GStatem;
